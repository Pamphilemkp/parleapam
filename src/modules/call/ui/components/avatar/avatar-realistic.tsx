'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AvatarRealisticProps {
  name: string;
  isPremium?: boolean;
  isSpeaking?: boolean;
  expression?: 'neutral' | 'smile' | 'laugh' | 'talk' | 'explain';
  className?: string;
}

export function AvatarRealistic({ 
  name, 
  isPremium = false, 
  isSpeaking = false,
  expression: controlledExpression,
  className 
}: AvatarRealisticProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [expression, setExpression] = useState<'neutral' | 'smile' | 'laugh' | 'talk' | 'explain'>('neutral');
  const [eyeMovement, setEyeMovement] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(0);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eyeMovementRef = useRef<NodeJS.Timeout | null>(null);
  const expressionRef = useRef<NodeJS.Timeout | null>(null);
  const mouthAnimationRef = useRef<number | null>(null);

  // Use controlled expression if provided, otherwise auto-manage
  const currentExpression = controlledExpression || expression;

  // Blinking animation (natural intervals)
  useEffect(() => {
    if (!isPremium) return;

    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 100 + Math.random() * 150);
    };

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 5000;
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
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 2,
      });
      eyeMovementRef.current = setTimeout(moveEyes, 2000 + Math.random() * 3000);
    };

    moveEyes();

    return () => {
      if (eyeMovementRef.current) {
        clearTimeout(eyeMovementRef.current);
      }
    };
  }, [isPremium]);

  // Head movement (subtle)
  useEffect(() => {
    if (!isPremium) return;

    const moveHead = () => {
      setHeadTilt((Math.random() - 0.5) * 4);
      setTimeout(() => setHeadTilt(0), 1000 + Math.random() * 2000);
      setTimeout(moveHead, 3000 + Math.random() * 4000);
    };

    moveHead();
  }, [isPremium]);

  // Expression changes based on speaking state
  useEffect(() => {
    if (!isPremium) return;

    if (isSpeaking) {
      // Cycle through expressions while speaking
      const expressions: Array<'neutral' | 'smile' | 'laugh' | 'talk' | 'explain'> = ['talk', 'smile', 'explain', 'talk'];
      let index = 0;

      const cycle = () => {
        if (!controlledExpression) {
          setExpression(expressions[index % expressions.length]);
        }
        index++;
        expressionRef.current = setTimeout(cycle, 1500 + Math.random() * 2000);
      };

      cycle();
    } else {
      if (!controlledExpression) {
        setExpression('neutral');
      }
      if (expressionRef.current) {
        clearTimeout(expressionRef.current);
      }
    }

    return () => {
      if (expressionRef.current) {
        clearTimeout(expressionRef.current);
      }
    };
  }, [isSpeaking, isPremium, controlledExpression]);

  // Mouth animation while speaking
  useEffect(() => {
    if (!isPremium || !isSpeaking) {
      setMouthOpen(0);
      return;
    }

    const animateMouth = () => {
      // Oscillate mouth opening while speaking
      const open = Math.sin(Date.now() / 200) * 0.3 + 0.3;
      setMouthOpen(open);
      mouthAnimationRef.current = requestAnimationFrame(animateMouth);
    };

    mouthAnimationRef.current = requestAnimationFrame(animateMouth);

    return () => {
      if (mouthAnimationRef.current !== null) {
        cancelAnimationFrame(mouthAnimationRef.current);
      }
    };
  }, [isSpeaking, isPremium]);

  if (!isPremium) {
    return null;
  }

  // Calculate mouth shape based on expression
  const getMouthShape = () => {
    const baseY = 85;
    const baseWidth = 24;
    const open = mouthOpen * 8;

    if (currentExpression === 'laugh') {
      // Wide open laugh with teeth visible
      return {
        path: `M ${100 - baseWidth - 5} ${baseY} Q 100 ${baseY + 15 + open}, ${100 + baseWidth + 5} ${baseY}`,
        fill: true,
        showTeeth: true,
      };
    } else if (currentExpression === 'smile') {
      // Smile with slight teeth
      return {
        path: `M ${100 - baseWidth} ${baseY} Q 100 ${baseY + 8}, ${100 + baseWidth} ${baseY}`,
        fill: false,
        showTeeth: true,
      };
    } else if (currentExpression === 'talk' || currentExpression === 'explain') {
      // Talking mouth (oval)
      return {
        path: `M ${100 - baseWidth/2} ${baseY - open/2} Q 100 ${baseY}, ${100 + baseWidth/2} ${baseY - open/2} Q 100 ${baseY + open}, ${100 - baseWidth/2} ${baseY - open/2}`,
        fill: true,
        showTeeth: true,
      };
    } else {
      // Neutral
      return {
        path: `M ${100 - baseWidth/2} ${baseY} Q 100 ${baseY + 2}, ${100 + baseWidth/2} ${baseY}`,
        fill: false,
        showTeeth: false,
      };
    }
  };

  const mouthShape = getMouthShape();

  return (
    <div className={cn("relative", className)}>
      {/* Ultra-realistic human face avatar */}
      <div className={cn("w-48 h-48 sm:w-64 sm:h-64 relative drop-shadow-2xl")}
        aria-label={name}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            {/* Realistic skin gradient */}
            <linearGradient id="skinGradRealistic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#fdbcb4', stopOpacity: 1}} />
              <stop offset="30%" style={{stopColor: '#fca5a5', stopOpacity: 1}} />
              <stop offset="70%" style={{stopColor: '#f87171', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#ef4444', stopOpacity: 0.9}} />
            </linearGradient>
            {/* Hair gradient - natural brown/black */}
            <linearGradient id="hairGradRealistic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#1e293b', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#0f172a', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#020617', stopOpacity: 1}} />
            </linearGradient>
            {/* Shirt gradient */}
            <linearGradient id="shirtGradRealistic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#0284c7', stopOpacity: 1}} />
            </linearGradient>
            {/* Eye highlight */}
            <radialGradient id="eyeHighlightRealistic" cx="50%" cy="40%">
              <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.9}} />
              <stop offset="70%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
              <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
            </radialGradient>
            {/* Teeth gradient */}
            <linearGradient id="teethGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#f1f5f9', stopOpacity: 1}} />
            </linearGradient>
          </defs>

          {/* Body/Shirt */}
          <ellipse cx="100" cy="160" rx="50" ry="55" fill="url(#shirtGradRealistic)" />
          
          {/* Neck */}
          <ellipse cx="100" cy="125" rx="20" ry="22" fill="url(#skinGradRealistic)" />
          
          {/* Head */}
          <g 
            className={cn("origin-[100px_80px] transition-transform duration-300")}
            style={{ transform: `rotate(${headTilt}deg)` }}
          >
            {/* Face shape - realistic oval */}
            <ellipse cx="100" cy="80" rx="55" ry="60" fill="url(#skinGradRealistic)" />
            
            {/* Hair - more realistic */}
            <path 
              d="M 45 50 Q 45 25, 65 30 Q 85 35, 100 28 Q 115 35, 135 30 Q 155 25, 155 50 Q 155 60, 150 70 Q 145 65, 140 60 Q 135 55, 100 55 Q 65 55, 60 60 Q 55 65, 50 70 Q 45 60, 45 50 Z" 
              fill="url(#hairGradRealistic)" 
            />
            
            {/* Left eyebrow */}
            <path 
              d="M 75 55 Q 85 53, 92 55" 
              stroke="#0f172a" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
            />
            {/* Right eyebrow */}
            <path 
              d="M 108 55 Q 115 53, 125 55" 
              stroke="#0f172a" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Left eye - detailed */}
            <g transform={`translate(${eyeMovement.x}, ${eyeMovement.y})`}>
              {/* Eye white */}
              <ellipse cx="82" cy="70" rx="10" ry="7" fill="white" />
              {/* Iris */}
              <circle cx="82" cy="70" r="6" fill="#1e40af" />
              {/* Pupil */}
              <circle cx="82" cy="70" r="3.5" fill="#0f172a" />
              {/* Eye highlight */}
              <ellipse cx="83.5" cy="68.5" rx="3" ry="2.5" fill="url(#eyeHighlightRealistic)" 
                className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-100")} 
              />
              {/* Eyelid */}
              <ellipse cx="82" cy="70" rx="10" ry="3.5" fill="url(#skinGradRealistic)" 
                className={cn(isBlinking ? "opacity-100" : "opacity-0", "transition-opacity duration-100")} 
              />
              {/* Eyelashes */}
              {!isBlinking && (
                <>
                  <path d="M 72 68 L 72 66" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 75 67 L 75 65" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 89 68 L 89 66" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 92 67 L 92 65" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </g>
            
            {/* Right eye - detailed */}
            <g transform={`translate(${eyeMovement.x}, ${eyeMovement.y})`}>
              {/* Eye white */}
              <ellipse cx="118" cy="70" rx="10" ry="7" fill="white" />
              {/* Iris */}
              <circle cx="118" cy="70" r="6" fill="#1e40af" />
              {/* Pupil */}
              <circle cx="118" cy="70" r="3.5" fill="#0f172a" />
              {/* Eye highlight */}
              <ellipse cx="119.5" cy="68.5" rx="3" ry="2.5" fill="url(#eyeHighlightRealistic)" 
                className={cn(isBlinking ? "opacity-0" : "opacity-100", "transition-opacity duration-100")} 
              />
              {/* Eyelid */}
              <ellipse cx="118" cy="70" rx="10" ry="3.5" fill="url(#skinGradRealistic)" 
                className={cn(isBlinking ? "opacity-100" : "opacity-0", "transition-opacity duration-100")} 
              />
              {/* Eyelashes */}
              {!isBlinking && (
                <>
                  <path d="M 108 68 L 108 66" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 111 67 L 111 65" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 125 68 L 125 66" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 128 67 L 128 65" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </g>
            
            {/* Nose - more detailed */}
            <ellipse cx="100" cy="78" rx="5" ry="7" fill="#fca5a5" opacity="0.4" />
            <path d="M 95 78 Q 100 75, 105 78" stroke="#f87171" strokeWidth="1.5" fill="none" />
            
            {/* Cheeks (when smiling/laughing) */}
            {(currentExpression === 'smile' || currentExpression === 'laugh') && (
              <>
                <circle cx="72" cy="78" r="8" fill="#fca5a5" opacity="0.5" className="animate-pulse" />
                <circle cx="128" cy="78" r="8" fill="#fca5a5" opacity="0.5" className="animate-pulse" />
              </>
            )}
            
            {/* Mouth - animated with expressions */}
            <g>
              {/* Mouth outline */}
              <path 
                d={mouthShape.path} 
                stroke="#c2410c" 
                strokeWidth={currentExpression === 'laugh' ? "3" : "2.5"} 
                fill={mouthShape.fill ? "#c2410c" : "none"} 
                strokeLinecap="round"
                className={isSpeaking ? "animate-[mouthTalk_0.4s_ease-in-out_infinite]" : ""}
              />
              
              {/* Teeth - visible when smiling/laughing/talking */}
              {mouthShape.showTeeth && (
                <g>
                  {/* Top teeth */}
                  <rect x="88" y={85 - mouthOpen * 4} width="24" height={mouthOpen * 5} rx="2" fill="url(#teethGrad)" />
                  {/* Individual teeth */}
                  <line x1="94" y1={85 - mouthOpen * 4} x2="94" y2={85 + mouthOpen} stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1="100" y1={85 - mouthOpen * 4} x2="100" y2={85 + mouthOpen} stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1="106" y1={85 - mouthOpen * 4} x2="106" y2={85 + mouthOpen} stroke="#e2e8f0" strokeWidth="0.5" />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping shadow-lg" />
      )}

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes mouthTalk {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.15); }
        }
      `}</style>
    </div>
  );
}

