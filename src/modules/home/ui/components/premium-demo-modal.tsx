'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, PenTool } from 'lucide-react';

interface PremiumDemoModalProps {
  triggerClassName?: string;
}

export function PremiumDemoModal({ triggerClassName }: PremiumDemoModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    const timeouts = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2600),
      setTimeout(() => setStep(4), 3600),
      setTimeout(() => setStep(5), 5200),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className={triggerClassName}>
          <Sparkles className="h-4 w-4 mr-2" />
          Watch Premium Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Talk to AI like a real person</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Avatar & Chat */}
          <div className="bg-muted rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/80" />
              <div className="text-sm">
                <div className="font-medium">Pam (AI)</div>
                <div className="text-muted-foreground">Premium Agent</div>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 10 }} className="bg-background rounded-md p-3 text-sm">
              Hi! I’ll walk you through this concept visually.
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : 10 }} className="bg-background rounded-md p-3 text-sm">
              I’ll open the whiteboard and draw it for you in real time.
            </motion.div>
          </div>

          {/* Whiteboard Preview */}
          <div className="bg-background rounded-lg border relative overflow-hidden">
            <div className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded flex items-center gap-1">
              <PenTool className="h-3 w-3" /> Whiteboard
            </div>
            <svg viewBox="0 0 420 280" className="w-full h-[220px]">
              {/* Title */}
              {step >= 2 && (
                <motion.text x="20" y="40" fill="#0ea5e9" fontSize="16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Explaining Concepts
                </motion.text>
              )}
              {/* Rectangle */}
              {step >= 3 && (
                <motion.rect x="20" y="60" width="280" height="110" stroke="#10b981" strokeWidth="3" fill="transparent" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              )}
              {/* Arrow */}
              {step >= 4 && (
                <motion.line x1="320" y1="30" x2="300" y2="70" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              )}
              {/* Scribble */}
              {step >= 5 && (
                <motion.polyline
                  points="40,90 60,100 80,95 100,110 120,100 140,108 160,96 180,106 200,98 220,105 240,100 260,108"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
              )}
            </svg>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


