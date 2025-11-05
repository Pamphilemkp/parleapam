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
  const [eyeMovement, setEyeMovement] = useState({ x: 0, y: 0 });
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const handAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const eyeMovementRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking animation (random intervals, more natural)
  useEffect(() => {
    if (!isPremium) return;

    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 100 + Math.random() * 100);
    };

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000; // 2-6 seconds
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

  // Natural eye movement
  useEffect(() => {
    if (!isPremium) return;

    const moveEyes = () => {
      setEyeMovement({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      });
      eyeMovementRef.current = setTimeout(moveEyes, 3000 + Math.random() * 2000);
    };

    moveEyes();

    return () => {
      if (eyeMovementRef.current) {
        clearTimeout(eyeMovementRef.current);
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
          handAnimationRef.current = setTimeout(cycle, 600 + Math.random() * 500);
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
      {/* Realistic human-like avatar with professional animations */}
      <div className={cn("w-32 h-32 sm:w-40 sm:h-40 relative drop-shadow-2xl")}
        aria-label={name}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            {/* Realistic skin gradient */}
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#fdbcb4', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#fca5a5', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#f87171', stopOpacity: 1}} />
            </linearGradient>
            {/* Hair gradient */}
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#1e40af', stopOpacity: 1}} />
            </linearGradient>
            {/* Shirt gradient */}
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#0284c7', stopOpacity: 1}} />
            </linearGradient>
            {/* Eye highlight */}
            <radialGradient id="eyeHighlight">
              <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.8}} />
              <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
            </radialGradient>
          </defs>

          {/* Body/Shirt */}
          <ellipse cx="100" cy="140" rx="45" ry="50" fill="url(#shirtGrad)" />
          
          {/* Neck */}
          <ellipse cx="100" cy="110" rx="18" ry="20" fill="url(#skinGrad)" />
          
          {/* Head */}
          <g className={cn("origin-[100px_70px] transition-transform", isSpeaking && "animate-[headBob_1.6s_ease-in-out_infinite]")}>
            {/* Face shape */}
            <ellipse cx="100" cy="70" rx="50" ry="55" fill="url(#skinGrad)" />
            
            {/* Hair */}
            <path d="M 50 40 Q 50 20, 70 25 Q 90 30, 100 25 Q 110 30, 130 25 Q 150 20, 150 40 Q 150 50, 145 60 Q 140 55, 135 50 Q 130 45, 100 45 Q 70 45, 65 50 Q 60 55, 55 60 Q 50 50, 50 40 Z" 
                  fill="url(#hairGrad)" 
                  className={isSpeaking ? "animate-[hairMove_2s_ease-in-out_infinite]" : ""} />
            
            {/* Left eyebrow */}
            <path d="M 75 50 Q 85 48, 92 50" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Right eyebrow */}
            <path d="M 108 50 Q 115 48, 125 50" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            
            {/* Left eye */}
            <g transform={`translate(${eyeMovement.x}, ${eyeMovement.y})`}>
              <ellipse cx="82" cy="62" rx="8" ry="6" fill="white" />
              <circle cx="82" cy="62" r="5" fill="#1e293b" />
              <circle cx="83.5" cy="61" r="2" fill="white" className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-100")} />
              <ellipse cx="82" cy="60" rx="6" ry="4" fill="url(#eyeHighlight)" className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-100")} />
              {/* Eyelid */}
              <ellipse cx="82" cy="62" rx="8" ry="3" fill="url(#skinGrad)" className={cn(isBlinking ? "opacity-100" : "opacity-0", "transition-opacity duration-100")} />
            </g>
            
            {/* Right eye */}
            <g transform={`translate(${eyeMovement.x}, ${eyeMovement.y})`}>
              <ellipse cx="118" cy="62" rx="8" ry="6" fill="white" />
              <circle cx="118" cy="62" r="5" fill="#1e293b" />
              <circle cx="119.5" cy="61" r="2" fill="white" className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-100")} />
              <ellipse cx="118" cy="60" rx="6" ry="4" fill="url(#eyeHighlight)" className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-100")} />
              {/* Eyelid */}
              <ellipse cx="118" cy="62" rx="8" ry="3" fill="url(#skinGrad)" className={cn(isBlinking ? "opacity-100" : "opacity-0", "transition-opacity duration-100")} />
            </g>
            
            {/* Nose */}
            <ellipse cx="100" cy="75" rx="4" ry="6" fill="#fca5a5" opacity="0.6" />
            
            {/* Mouth - animated when speaking */}
            {isSpeaking ? (
              <path d="M 88 85 Q 100 90, 112 85 Q 100 88, 88 85" 
                    stroke="#c2410c" 
                    strokeWidth="2.5" 
                    fill="#f87171" 
                    strokeLinecap="round"
                    className="animate-[mouthTalk_0.5s_ease-in-out_infinite]" />
            ) : (
              <path d="M 88 85 Q 100 88, 112 85" 
                    stroke="#c2410c" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round" />
            )}
            
            {/* Cheeks (when speaking) */}
            {isSpeaking && (
              <>
                <circle cx="72" cy="75" r="6" fill="#fca5a5" opacity="0.4" className="animate-[cheekGlow_1.5s_ease-in-out_infinite]" />
                <circle cx="128" cy="75" r="6" fill="#fca5a5" opacity="0.4" className="animate-[cheekGlow_1.5s_ease-in-out_infinite]" />
              </>
            )}
          </g>
          
          {/* Left shoulder/arm */}
          <g className={cn(
            "origin-[55px_130px]",
            handPosition === 'talking' && "animate-[armTalk_1s_ease-in-out_infinite]",
            handPosition === 'emphasizing' && "animate-[armEmphasize_1.2s_ease-in-out_infinite]"
          )}>
            <ellipse cx="55" cy="130" rx="12" ry="25" fill="url(#shirtGrad)" />
            {/* Hand */}
            <ellipse cx="50" cy="155" rx="8" ry="10" fill="url(#skinGrad)" />
            <circle cx="48" cy="158" r="2" fill="url(#skinGrad)" />
            <circle cx="52" cy="158" r="2" fill="url(#skinGrad)" />
          </g>
          
          {/* Right shoulder/arm */}
          <g className={cn(
            "origin-[145px_130px]",
            handPosition === 'talking' && "animate-[armTalk_1s_ease-in-out_infinite]",
            handPosition === 'emphasizing' && "animate-[armEmphasize_1.2s_ease-in-out_infinite]"
          )}>
            <ellipse cx="145" cy="130" rx="12" ry="25" fill="url(#shirtGrad)" />
            {/* Hand */}
            <ellipse cx="150" cy="155" rx="8" ry="10" fill="url(#skinGrad)" />
            <circle cx="148" cy="158" r="2" fill="url(#skinGrad)" />
            <circle cx="152" cy="158" r="2" fill="url(#skinGrad)" />
          </g>
        </svg>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full animate-ping shadow-lg" />
      )}

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes headBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }
        @keyframes hairMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        @keyframes armTalk {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(12deg) translateY(-2px); }
        }
        @keyframes armEmphasize {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-15deg) scale(1.1); }
        }
        @keyframes mouthTalk {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.2); }
        }
        @keyframes cheekGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

