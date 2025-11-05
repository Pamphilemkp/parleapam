'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CallControls, SpeakerLayout, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WhiteboardCanvas } from './whiteboard/whiteboard-canvas';
import { AvatarAnimated } from './avatar/avatar-animated';
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
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const { isPremium } = usePremium();
    const saveWhiteboard = trpc.meetings.updateWhiteboard.useMutation();
    const [isAIDemoActive, setIsAIDemoActive] = useState(false);
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);

    // Detect when AI agent is speaking (audio level detection)
    useEffect(() => {
        if (!call || !agentId || !participants) return;

        const agentParticipant = participants.find(p => p.userId === agentId || p.userId?.includes('agent'));
        
        if (!agentParticipant) return;

        // Monitor audio level to detect speech
        const checkAudio = () => {
            // Check if participant has audio track and is currently speaking
            const hasAudio = agentParticipant.isSpeaking || false;
            setIsAgentSpeaking(hasAudio);
        };

        const interval = setInterval(checkAudio, 100);
        return () => clearInterval(interval);
    }, [call, participants, agentId]);

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
        <div className="flex flex-col justify-between h-screen-mobile p-2 sm:p-4 text-white relative overflow-hidden w-full max-w-full">
            {/* Header - Responsive */}
            <div className="bg-[#101213] rounded-full flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sticky top-0 sm:top-[env(safe-area-inset-top)] z-20 w-full max-w-full flex-shrink-0">
               <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit min-w-[44px] min-h-[44px]">
                   <Image src="/logo.svg" alt="Logo" width={22} height={22} className="rounded-full" />
               </Link>
               <h4 className="text-sm sm:text-base truncate flex-1">{meetingName}</h4>
               {/* Premium features button */}
               {isPremium && (
                   <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => setShowWhiteboard(!showWhiteboard)}
                       className="text-white hover:bg-white/20 min-w-[44px] min-h-[44px]"
                       title={showWhiteboard ? "Close Whiteboard" : "Open Whiteboard"}
                   >
                       {showWhiteboard ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />}
                   </Button>
               )}
               {isPremium && (
                   <Button
                       variant="secondary"
                       size="sm"
                       onClick={triggerAIDemo}
                       className="min-w-[44px] min-h-[44px]"
                       title="AI Demonstration"
                   >
                       <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                   </Button>
               )}
            </div>

            {/* Speaker Layout with Avatar */}
            <div className="flex-1 relative min-h-0 w-full max-w-full overflow-hidden">
                <div className="w-full h-full">
                    <SpeakerLayout />
                </div>
                {/* Avatar Animation Overlay (Premium only) */}
                {isPremium && agentId && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                        <AvatarAnimated
                            name="AI Agent"
                            isPremium={isPremium}
                            isSpeaking={isAgentSpeaking || isAIDemoActive}
                        />
                    </div>
                )}
            </div>

            {/* Controls - Responsive */}
            <div className="bg-[#101213] rounded-full px-2 sm:px-4 py-2 flex items-center justify-center sticky bottom-0 sm:bottom-[env(safe-area-inset-bottom)] z-20 w-full max-w-full flex-shrink-0">
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
                            agentId={agentId}
                        />
                    </div>
                </div>
            )}

            {/* Premium Feature Indicator */}
            {!isPremium && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-center max-w-sm mx-4">
                    <p className="text-sm text-foreground mb-2">
                        <Sparkles className="h-4 w-4 inline mr-1" />
                        Upgrade to Premium for whiteboard and animated avatars
                    </p>
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
    );
};
