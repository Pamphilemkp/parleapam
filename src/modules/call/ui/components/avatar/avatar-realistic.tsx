'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AvatarRealisticProps {
  name: string;
  isPremium?: boolean;
  isSpeaking?: boolean;
  expression?: 'neutral' | 'smile' | 'laugh' | 'talk' | 'explain';
  className?: string;
}

const HUMAN_GUIDE_IMAGE =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80';

type AvatarExpression = NonNullable<AvatarRealisticProps['expression']>;

const EXPRESSION_FILTERS: Record<AvatarExpression, string> = {
  neutral: 'brightness-100 contrast-105',
  smile: 'brightness-110 contrast-110',
  laugh: 'brightness-115 contrast-115',
  talk: 'brightness-105 contrast-110',
  explain: 'brightness-108 contrast-112',
};

export function AvatarRealistic({
  name,
  isPremium = false,
  isSpeaking = false,
  expression = 'neutral',
  className,
}: AvatarRealisticProps) {
  const [microMovement, setMicroMovement] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!isPremium) return;

    const movementInterval = setInterval(() => {
      setMicroMovement({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 6,
      });
    }, 2500);

    return () => clearInterval(movementInterval);
  }, [isPremium]);

  useEffect(() => {
    if (!isPremium) return;

    const blinkNow = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    };

    const blinkInterval = setInterval(() => {
      blinkNow();
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, [isPremium]);

  if (!isPremium) {
    return null;
  }

  return (
    <motion.div
      className={cn('relative', className)}
      animate={{
        scale: isSpeaking ? [1, 1.03, 1] : 1,
        rotate: isSpeaking ? [0, 0.5, 0] : microMovement.x * 0.1,
      }}
      transition={{ duration: 1.4, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-gradient-to-br from-white/20 to-black/10"
        animate={{
          x: microMovement.x,
          y: microMovement.y,
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ width: '100%', aspectRatio: '1/1.25' }}
      >
        <Image
          src={HUMAN_GUIDE_IMAGE}
          alt={name}
          fill
          priority
          className={cn(
            'object-cover transition-all duration-500',
            EXPRESSION_FILTERS[expression],
            isSpeaking ? 'scale-[1.02]' : 'scale-100'
          )}
        />

        {/* Soft overlay for warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Blink overlay */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-background/40"
          animate={{ scaleY: blink ? 1 : 0 }}
          transition={{ duration: 0.12 }}
          style={{ transformOrigin: 'top center' }}
        />

        {/* Friendly glow */}
        <div className="absolute -inset-1 rounded-[28px] border border-white/10 pointer-events-none" />
      </motion.div>

      {/* Speaking pulse indicator */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 backdrop-blur-lg bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1"
        animate={{ opacity: isSpeaking ? 1 : 0.7, y: isSpeaking ? [0, -2, 0] : 0 }}
        transition={{ duration: 1.2, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
        {isSpeaking ? 'Explaining...' : 'Here to help'}
      </motion.div>
    </motion.div>
  );
}

