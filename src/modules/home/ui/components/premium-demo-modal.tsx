'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle } from 'lucide-react';

interface PremiumDemoModalProps {
  triggerClassName?: string;
}

const DEMO_VIDEO_SRC = 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4';

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
            A real meeting walkthrough showcasing visual explanations, whiteboard support, and the human AI guide.
          </p>
        </DialogHeader>
        <div className="px-0 sm:px-6 pb-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=800&q=80"
              className="h-full w-full object-cover"
            >
              <source src={DEMO_VIDEO_SRC} type="video/mp4" />
              Your browser does not support the demo video.
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
              <PlayCircle className="h-3 w-3" />
              Premium Experience
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


