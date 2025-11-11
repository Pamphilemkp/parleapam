"use client";
import { motion, Variants } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoSection() {
  const videoVariants: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="relative mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:px-8"
      initial="initial"
      animate="visible"
      variants={videoVariants}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-2xl">
        <video
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-label="Product walk-through of Parle à Pam AI"
          poster="/ai-video-call-fallback.png"
        >
          <source src="/videos/home-banner-ai.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          <Play className="h-3 w-3" />
          Live product demo
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 rounded-3xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">How it works</p>
        <h3 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          Launch a meeting with an AI guide in under a minute.
        </h3>
        <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <li>
            <span className="font-semibold text-foreground">1. Pick your agent.</span> Choose a tutor,
            coach, or assistant right from the catalog.
          </li>
          <li>
            <span className="font-semibold text-foreground">2. Share your goal.</span> Describe what you
            need and start the video call—Pam stays on screen with gestures and visual aids.
          </li>
          <li>
            <span className="font-semibold text-foreground">3. Get instant recaps.</span> Review transcripts,
            whiteboard drawings, and action items the moment you wrap up.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          No loading screens—the demo shows the real interface so visitors immediately understand what happens
          after they click “Start a meeting.”
        </p>
      </div>
    </motion.section>
  );
}
