'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CallControls, SpeakerLayout, useCall, useParticipants } from '@stream-io/video-react-sdk';
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
    const participants = useParticipants();
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const { isPremium } = usePremium();
    const saveWhiteboard = trpc.meetings.updateWhiteboard.useMutation();
    const [isAIDemoActive, setIsAIDemoActive] = useState(false);
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);

    // Detect when AI agent is speaking (audio level detection)
    useEffect(() => {
        if (!call || !agentId) return;

        const agentParticipant = participants.find(p => p.userId === agentId || p.userId?.includes('agent'));
        
        if (!agentParticipant) return;

        // Monitor audio level to detect speech
        const checkAudio = () => {
            const hasAudio = agentParticipant.audioStream && agentParticipant.isSpeaking;
            setIsAgentSpeaking(hasAudio || false);
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

    // Simple AI demo: auto-open whiteboard and show avatar gesturing
    const triggerAIDemo = () => {
        setIsAIDemoActive(true);
        if (!showWhiteboard) setShowWhiteboard(true);
        // Stop demo after 12s
        window.setTimeout(() => setIsAIDemoActive(false), 12000);
    };

    return (
        <div className="flex flex-col justify-between h-dvh sm:h-full p-2 sm:p-4 text-white relative">
            {/* Header - Responsive */}
            <div className="bg-[#101213] rounded-full flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2 sticky top-[env(safe-area-inset-top)] z-20">
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
            <div className="flex-1 relative min-h-0">
                <SpeakerLayout />
                {/* Avatar Animation Overlay (Premium only) */}
                {isPremium && agentId && (
                    <div className="absolute top-4 right-4 z-10">
                        <AvatarAnimated
                            name="AI Agent"
                            isPremium={isPremium}
                            isSpeaking={isAgentSpeaking || isAIDemoActive}
                        />
                    </div>
                )}
            </div>

            {/* Controls - Responsive */}
            <div className="bg-[#101213] rounded-full px-2 sm:px-4 py-2 flex items-center justify-center sticky bottom-[env(safe-area-inset-bottom)]">
                <CallControls onLeave={onLeave} />
            </div>

            {/* Whiteboard Overlay */}
            {showWhiteboard && (
                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex">
                    <div className="relative m-auto w-[98vw] sm:w-[90vw] h-[70vh] sm:h-[75vh] bg-background rounded-xl shadow-2xl overflow-hidden">
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <Button size="sm" variant="ghost" onClick={() => setShowWhiteboard(false)} title="Close Whiteboard" className="min-w-[44px] min-h-[44px]">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <WhiteboardCanvas
                            meetingId={meetingId}
                            onClose={() => setShowWhiteboard(false)}
                            onSave={handleSaveWhiteboard}
                            demo={isAIDemoActive}
                            call={call}
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
