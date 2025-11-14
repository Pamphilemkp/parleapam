'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CallControls, ParticipantView, SpeakerLayout, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WhiteboardCanvas } from './whiteboard/whiteboard-canvas';
import { AvatarRealistic } from './avatar/avatar-realistic';
import { useAITranscript } from '@/hooks/use-ai-transcript';
import { VisualExplanationPanel } from './visual-explanation-panel';
import type { VisualExplanationData } from '@/modules/call/lib/visual-explanation';
import { usePremium } from '@/hooks/use-premium';
import { PenTool, Sparkles, X } from 'lucide-react';
import { trpc } from '@/trpc/client';

interface Props {
    onLeave: () => void;
    meetingName: string;
    meetingId: string;
    agentId?: string;
}

export const CallActive = ({ onLeave, meetingName, meetingId, agentId }: Props) => {
    const call = useCall();
    const { useParticipants, useLocalParticipant } = useCallStateHooks();
    const participants = useParticipants();
    const localParticipant = useLocalParticipant();
    const remoteParticipants = participants.filter(
        (participant) => participant.sessionId !== localParticipant?.sessionId
    );
    const { isPremium } = usePremium();
    const normalizedAgentId = agentId?.toLowerCase();
    const agentParticipant = remoteParticipants.find((participant) => {
        const userId = participant.userId?.toLowerCase();
        if (!userId) {
            return false;
        }

        if (normalizedAgentId) {
            if (userId === normalizedAgentId) {
                return true;
            }
        }

        return userId.includes('agent');
    });
    const shouldShowParticipantsBar = remoteParticipants.length > 1;
    const effectiveAgentId = agentParticipant?.userId ?? agentId;
    const hasInteractiveAgent = Boolean(isPremium && effectiveAgentId);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const saveWhiteboard = trpc.meetings.updateWhiteboard.useMutation();
    const [isAIDemoActive, setIsAIDemoActive] = useState(false);
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [avatarExpression, setAvatarExpression] = useState<'neutral' | 'smile' | 'laugh' | 'talk' | 'explain'>('neutral');
    const [visualExplanation, setVisualExplanation] = useState<VisualExplanationData | null>(null);

    useEffect(() => {
        if (!visualExplanation) return;
        const timeout = window.setTimeout(() => setVisualExplanation(null), 20000);
        return () => window.clearTimeout(timeout);
    }, [visualExplanation]);

    // Listen for AI transcriptions and detect teaching commands
    useAITranscript({
        call,
        agentId: effectiveAgentId,
        onTranscript: (text) => {
            // Update avatar expression based on transcript content
            const lowerText = text.toLowerCase();
            if (lowerText.includes('laugh') || lowerText.includes('haha') || lowerText.includes('funny')) {
                setAvatarExpression('laugh');
            } else if (lowerText.includes('explain') || lowerText.includes('demonstrate') || lowerText.includes('show')) {
                setAvatarExpression('explain');
            } else if (lowerText.includes(':)') || lowerText.includes('smile')) {
                setAvatarExpression('smile');
            } else if (isAgentSpeaking) {
                setAvatarExpression('talk');
            } else {
                setAvatarExpression('neutral');
            }
        },
        onTeachingCommand: (command) => {
            // Automatically open whiteboard when AI wants to demonstrate/teach
            if (isPremium && !showWhiteboard) {
                setShowWhiteboard(true);
                
                // Trigger whiteboard command after a short delay
                window.setTimeout(() => {
                    const event = new CustomEvent('ai-whiteboard-command', {
                        detail: { command }
                    });
                    window.dispatchEvent(event);
                }, 500);
            }
        },
        onVisual: (visual) => {
            setVisualExplanation(visual);

            if (isPremium && !showWhiteboard) {
                const shouldOpenWhiteboard = ['flowchart', 'equation'].includes(visual.type);
                if (shouldOpenWhiteboard) {
                    setShowWhiteboard(true);
                }
            }
        }
    });

    // Detect when AI agent is speaking (audio level detection)
    useEffect(() => {
        setIsAgentSpeaking(Boolean(agentParticipant?.isSpeaking));
    }, [agentParticipant]);

    const handleSaveWhiteboard = (data: unknown) => {
        saveWhiteboard.mutate({
            id: meetingId,
            whiteboardData: data,
        });
    };

    // ESC to close whiteboard
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowWhiteboard(false);
        };
        if (showWhiteboard) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showWhiteboard]);

    // AI demo: auto-open whiteboard, show avatar gesturing, and trigger AI drawing
    const triggerAIDemo = () => {
        setIsAIDemoActive(true);
        if (!showWhiteboard) setShowWhiteboard(true);
        
        // Trigger AI drawing commands sequentially to demonstrate AI using whiteboard
        const commands = [
            'draw a circle',
            'draw a rectangle',
            'draw a line',
            'write Hello, this is AI demonstrating',
            'draw a diagram',
        ];
        
        commands.forEach((cmd, index) => {
            window.setTimeout(() => {
                const event = new CustomEvent('ai-whiteboard-command', {
                    detail: { command: cmd }
                });
                window.dispatchEvent(event);
            }, 2000 + index * 2500); // Stagger commands
        });
        
        // Stop demo after all commands execute
        window.setTimeout(() => setIsAIDemoActive(false), 2000 + commands.length * 2500 + 2000);
    };

    return (
        <div className="flex h-screen-mobile w-full max-w-full flex-col gap-3 overflow-hidden bg-[#050505] p-2 text-white sm:p-4">
            {/* Header - Responsive */}
            <div className="sticky top-0 z-20 flex w-full max-w-full flex-shrink-0 items-center gap-2 rounded-full bg-[#101213] px-2 py-2 sm:top-[env(safe-area-inset-top)] sm:gap-4 sm:px-4">
                <Link
                    href="/"
                    className="flex min-h-[44px] min-w-[44px] w-fit items-center justify-center rounded-full bg-white/10 p-1"
                >
                   <Image src="/logo.svg" alt="Logo" width={22} height={22} className="rounded-full" />
               </Link>
                <h4 className="flex-1 truncate text-sm sm:text-base">{meetingName}</h4>
               {/* Premium features button */}
               {isPremium && (
                   <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => setShowWhiteboard(!showWhiteboard)}
                        className="min-h-[44px] min-w-[44px] text-white hover:bg-white/20"
                        title={showWhiteboard ? 'Close Whiteboard' : 'Open Whiteboard'}
                   >
                       {showWhiteboard ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />}
                   </Button>
               )}
               {isPremium && (
                   <Button
                       variant="secondary"
                       size="sm"
                       onClick={triggerAIDemo}
                        className="min-h-[44px] min-w-[44px]"
                       title="AI Demonstration"
                   >
                       <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                   </Button>
               )}
            </div>

            {/* Speaker Layout with dedicated agent area */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
                <div className="relative flex-1">
                    <div
                        className="grid h-full gap-3 lg:grid-cols-[minmax(0,1fr)_320px]"
                        data-testid="call-layout-grid"
                    >
                        <div
                            className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-2xl
                                       [&_.str-video__speaker-layout]:h-full
                                       [&_.str-video__speaker-layout]:w-full
                                       [&_.str-video__speaker-layout__wrapper]:h-full
                                       [&_.str-video__speaker-layout__spotlight]:h-full
                                       [&_.str-video__speaker-layout__spotlight]:w-full
                                       [&_.str-video__participant-view]:!h-full
                                       [&_.str-video__participant-view]:!w-full
                                       [&_.str-video__participant-view__video]:!h-full
                                       [&_.str-video__participant-view__video]:!w-full
                                       [&_.str-video__participant-view__video]:!object-contain
                                       [&_.str-video__participant-view__video]:sm:!object-cover"
                        >
                            <SpeakerLayout
                                participantsBarPosition={shouldShowParticipantsBar ? 'bottom' : null}
                                participantsBarLimit="dynamic"
                                excludeLocalParticipant
                            />

                            {localParticipant && (
                                <div className="absolute left-3 top-3 w-36 overflow-hidden rounded-3xl border border-white/30 bg-black/70 shadow-2xl backdrop-blur-sm sm:left-6 sm:top-6 sm:w-48 md:w-56">
                                    <div className="relative h-full w-full">
                                        <ParticipantView
                                            participant={localParticipant}
                                            mirror
                                            className="!h-full !w-full overflow-hidden rounded-3xl [&_.str-video__participant-view__video]:!h-full [&_.str-video__participant-view__video]:!w-full [&_.str-video__participant-view__video]:!object-cover"
                                        />
                                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium shadow">
                                            You
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden h-full flex-col rounded-3xl border border-white/10 bg-black/50 p-4 shadow-2xl lg:flex">
                            {hasInteractiveAgent ? (
                                <>
                                    <div className="flex items-center justify-between pb-3">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-primary/70">
                                            Interactive Agent
                                        </span>
                                        {isAgentSpeaking && (
                                            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                                                <span className="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                                                Speaking
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 items-center justify-center">
                                        <AvatarRealistic
                                            name={agentParticipant?.name ?? 'AI Teacher'}
                                            isPremium={isPremium}
                                            isSpeaking={isAgentSpeaking || isAIDemoActive}
                                            expression={avatarExpression}
                                            className="w-full max-w-[180px]"
                                        />
                                    </div>
                                    <p className="mt-3 text-xs text-white/60">
                                        Gestures stay visible here so your view of the call stays clear on every device.
                                    </p>
                                </>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/70">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Interactive avatar reserved</p>
                                        <p className="text-xs text-white/60">
                                            Upgrade to Premium to replace the static assistant with a live, gesturing AI.
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => window.open('/upgrade', '_blank')}
                                        variant="default"
                                    >
                                        Upgrade Now
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {hasInteractiveAgent ? (
                    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/50 p-3 shadow-lg lg:hidden">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/70 sm:h-20 sm:w-20">
                            <AvatarRealistic
                                name={agentParticipant?.name ?? 'AI Teacher'}
                                isPremium={isPremium}
                                isSpeaking={isAgentSpeaking || isAIDemoActive}
                                expression={avatarExpression}
                                className="h-16 w-16 sm:h-20 sm:w-20"
                            />
                        </div>
                        <div className="flex flex-1 flex-col text-xs text-white/70">
                            <p className="text-sm font-semibold text-white">Interactive Agent</p>
                            <p>
                                The AI avatar now lives here so the call view stays centered. Watch it gesture without hiding
                                you or the agent.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-black/40 p-3 text-xs text-white/70 lg:hidden">
                        <div>
                            <p className="text-sm font-semibold text-white">Premium interactive avatar</p>
                            <p>Reserve space is ready—upgrade to swap in the live gesturing agent on mobile too.</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => window.open('/upgrade', '_blank')}
                            variant="default"
                        >
                            Upgrade
                        </Button>
                    </div>
                )}
            </div>

            {/* Controls - Responsive */}
            <div className="sticky bottom-0 z-20 flex w-full max-w-full flex-shrink-0 items-center justify-center rounded-full bg-[#101213] px-2 py-2 sm:bottom-[env(safe-area-inset-bottom)] sm:px-4">
                <CallControls onLeave={onLeave} />
            </div>

            {/* Whiteboard Overlay */}
            {showWhiteboard && (
                <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex p-2 sm:p-4">
                    <div className="relative m-auto w-full max-w-full h-full sm:h-[75vh] sm:max-h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col border-2 border-primary/20">
                        {/* Close button - prominently displayed */}
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 z-50">
                            <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => setShowWhiteboard(false)} 
                                title="Close Whiteboard (ESC)" 
                                className="min-w-[44px] min-h-[44px] shadow-lg"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </div>
                        {/* ESC hint text */}
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 bg-background/90 px-2 py-1 rounded text-xs sm:text-sm text-muted-foreground">
                            Press ESC to close
                        </div>
                        <WhiteboardCanvas
                            meetingId={meetingId}
                            onClose={() => setShowWhiteboard(false)}
                            onSave={handleSaveWhiteboard}
                            demo={isAIDemoActive}
                            call={call}
                            agentId={effectiveAgentId}
                        />
                    </div>
                </div>
            )}

            <VisualExplanationPanel
                data={visualExplanation}
                onClose={() => setVisualExplanation(null)}
            />

        </div>
    );
};
