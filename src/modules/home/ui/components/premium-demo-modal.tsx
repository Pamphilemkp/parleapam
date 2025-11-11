'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, ListChecks } from 'lucide-react';

interface PremiumDemoModalProps {
  triggerClassName?: string;
}

const DEMO_VIDEO_SRC = '/videos/home-banner-ai.mp4';

export function PremiumDemoModal({ triggerClassName }: PremiumDemoModalProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (open) {
      video.currentTime = 0;
      void video.play().catch(() => {
        /* ignore autoplay restrictions */
      });
    } else {
      video.pause();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className={triggerClassName ?? 'text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 shadow-lg'}>
          <Sparkles className="h-4 w-4 mr-2" />
          Watch Premium Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-hidden p-0 sm:p-6">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold">See the AI assistant in action</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Watch a real flow—from picking an agent to receiving the post-call summary—so visitors know exactly what happens.
          </p>
        </DialogHeader>
        <div className="px-0 sm:px-6 pb-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-2xl">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                poster="/ai-video-call-fallback.png"
                className="h-full w-full object-cover"
              >
                <source src={DEMO_VIDEO_SRC} type="video/mp4" />
                Your browser does not support the demo video.
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                <PlayCircle className="h-3 w-3" />
                Product walkthrough • 1:12
              </div>
            </div>

            <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-lg backdrop-blur">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <ListChecks className="h-4 w-4" />
                What you will see
              </div>
              <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <li>
                  <span className="font-semibold text-foreground">Intro:</span> Browse the agent gallery and choose a
                  premium tutor.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Live call:</span> See gestures, whiteboard drawings,
                  and transcript streaming in real time.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Wrap-up:</span> Review the instant summary,
                  highlighted actions, and saved visuals.
                </li>
              </ol>
              <p className="text-xs text-muted-foreground">
                The demo is hosted locally—no buffering, no waiting. It mirrors the product experience the moment someone
                clicks “Start a meeting.”
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


