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
      {/* Branded stylized SVG avatar with head/body/hands - Parle à Pam style */}
      <div className={cn("w-24 h-24 sm:w-28 sm:h-28 relative drop-shadow-lg")}
        aria-label={name}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Body - gradient styled */}
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#0284c7', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="headGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#38bdf8', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          <rect x="30" y="55" width="60" height="50" rx="12" fill="url(#bodyGrad)" />
          {/* Head */}
          <g className={cn("origin-[60px_40px] transition-transform", isSpeaking && "animate-[headBob_1.6s_ease-in-out_infinite]")}> 
            <circle cx="60" cy="40" r="22" fill="url(#headGrad)" />
            {/* Eyes with more expression */}
            <g className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-150")}>
              <circle cx="52" cy="38" r="3.5" className="fill-white" />
              <circle cx="68" cy="38" r="3.5" className="fill-white" />
              <circle cx="52" cy="38" r="1.5" className="fill-gray-800" />
              <circle cx="68" cy="38" r="1.5" className="fill-gray-800" />
            </g>
            {/* Smile */}
            {isSpeaking && (
              <path d="M 50 45 Q 60 50 70 45" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </g>
          {/* Left hand - more detailed */}
          <g className={cn(
            "origin-[30px_80px]",
            handPosition === 'talking' && "animate-[handTalk_1s_ease-in-out_infinite]",
            handPosition === 'emphasizing' && "animate-[handEmphasize_1.2s_ease-in-out_infinite]"
          )}>
            <circle cx="30" cy="80" r="10" fill="url(#bodyGrad)" />
            <circle cx="25" cy="82" r="3" fill="url(#headGrad)" />
            <circle cx="35" cy="82" r="3" fill="url(#headGrad)" />
          </g>
          {/* Right hand - more detailed */}
          <g className={cn(
            "origin-[90px_80px]",
            handPosition === 'talking' && "animate-[handTalk_1s_ease-in-out_infinite]",
            handPosition === 'emphasizing' && "animate-[handEmphasize_1.2s_ease-in-out_infinite]"
          )}>
            <circle cx="90" cy="80" r="10" fill="url(#bodyGrad)" />
            <circle cx="85" cy="82" r="3" fill="url(#headGrad)" />
            <circle cx="95" cy="82" r="3" fill="url(#headGrad)" />
          </g>
        </svg>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping" />
      )}

      {/* Keyframe utilities */}
      <style jsx>{`
        @keyframes headBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes handTalk {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes handEmphasize {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-10deg) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

