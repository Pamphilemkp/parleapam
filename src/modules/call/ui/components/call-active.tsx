'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WhiteboardCanvas } from './whiteboard/whiteboard-canvas';
import { AvatarAnimated } from './avatar/avatar-animated';
import { usePremium } from '@/hooks/use-premium';
import { PenTool, Sparkles } from 'lucide-react';
import { trpc } from '@/trpc/client';

interface Props {
    onLeave: () => void;
    meetingName: string;
    meetingId: string;
    agentId?: string;
}

export const CallActive = ({ onLeave, meetingName, meetingId, agentId }: Props) => {
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const { isPremium } = usePremium();
    const saveWhiteboard = trpc.meetings.updateWhiteboard.useMutation();

    const handleSaveWhiteboard = (data: unknown) => {
        saveWhiteboard.mutate({
            id: meetingId,
            whiteboardData: data,
        });
    };

    return (
        <div className="flex flex-col justify-between h-full p-2 sm:p-4 text-white relative">
            {/* Header - Responsive */}
            <div className="bg-[#101213] rounded-full flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2">
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
                       title="Toggle Whiteboard"
                   >
                       <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />
                   </Button>
               )}
            </div>

            {/* Speaker Layout with Avatar */}
            <div className="flex-1 relative">
                <SpeakerLayout />
                {/* Avatar Animation Overlay (Premium only) */}
                {isPremium && agentId && (
                    <div className="absolute top-4 right-4 z-10">
                        <AvatarAnimated
                            name="AI Agent"
                            isPremium={isPremium}
                            isSpeaking={false}
                        />
                    </div>
                )}
            </div>

            {/* Controls - Responsive */}
            <div className="bg-[#101213] rounded-full px-2 sm:px-4 py-2 flex items-center justify-center">
                <CallControls onLeave={onLeave} />
            </div>

            {/* Whiteboard Overlay */}
            {showWhiteboard && (
                <WhiteboardCanvas
                    meetingId={meetingId}
                    onClose={() => setShowWhiteboard(false)}
                    onSave={handleSaveWhiteboard}
                />
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
