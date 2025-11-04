'use client';

import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarAnimatedProps {
  name: string;
  image?: string;
  isPremium?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export function AvatarAnimated({ 
  name, 
  image, 
  isPremium = false, 
  isSpeaking = false,
  className 
}: AvatarAnimatedProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [handPosition, setHandPosition] = useState<'idle' | 'talking' | 'emphasizing'>('idle');
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const handAnimationRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking animation (random intervals)
  useEffect(() => {
    if (!isPremium) return;

    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds
      blinkIntervalRef.current = setTimeout(() => {
        triggerBlink();
        scheduleBlink();
      }, delay);
    };

    scheduleBlink();

    return () => {
      if (blinkIntervalRef.current) {
        clearTimeout(blinkIntervalRef.current);
      }
    };
  }, [isPremium]);

  // Hand movements synchronized with speech
  useEffect(() => {
    if (!isPremium) return;

    if (isSpeaking) {
      // Animate hands when speaking
      const animateHands = () => {
        const positions: Array<'idle' | 'talking' | 'emphasizing'> = ['talking', 'emphasizing', 'talking'];
        let index = 0;

        const cycle = () => {
          setHandPosition(positions[index % positions.length]);
          index++;
          handAnimationRef.current = setTimeout(cycle, 800 + Math.random() * 400);
        };

        cycle();
      };

      animateHands();
    } else {
      setHandPosition('idle');
      if (handAnimationRef.current) {
        clearTimeout(handAnimationRef.current);
      }
    }

    return () => {
      if (handAnimationRef.current) {
        clearTimeout(handAnimationRef.current);
      }
    };
  }, [isSpeaking, isPremium]);

  if (!isPremium) {
    // Static avatar for free users
    return (
      <Avatar className={cn("w-16 h-16", className)}>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Avatar 
        className={cn(
          "w-16 h-16 transition-all duration-300",
          isBlinking && "scale-95",
          isSpeaking && "scale-105",
        )}
      >
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      {/* Blinking animation overlay */}
      {isBlinking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-1 bg-primary/20 rounded-full animate-pulse" />
        </div>
      )}

      {/* Hand position indicators (visual feedback) */}
      {isPremium && isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div className={cn(
            "w-2 h-2 rounded-full transition-all",
            handPosition === 'talking' && "bg-blue-500 animate-pulse",
            handPosition === 'emphasizing' && "bg-green-500 scale-150",
            handPosition === 'idle' && "bg-gray-400"
          )} />
        </div>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping" />
      )}
    </div>
  );
}

