"use client";
import { motion, Variants } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

const CHAPTERS = [
  {
    title: "Choose your AI partner",
    description: "Scroll the catalog and pick a tutor with gestures enabled.",
    cue: "00:05",
  },
  {
    title: "Explain your goal",
    description: "Describe the topic—Pam mirrors you on screen and opens the whiteboard.",
    cue: "00:22",
  },
  {
    title: "Collaborate in real time",
    description: "Watch diagrams appear while the avatar speaks, gestures, and teaches.",
    cue: "00:46",
  },
  {
    title: "Wrap with clarity",
    description: "Get transcripts, action items, and saved drawings the second the call ends.",
    cue: "01:08",
  },
];

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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
          <Play className="h-3 w-3" />
          Live product demo
        </div>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-2">
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.title}
              className="flex items-center justify-between rounded-2xl bg-black/55 px-4 py-2 text-sm text-white backdrop-blur"
            >
              <div>
                <p className="font-semibold">{chapter.title}</p>
                <p className="text-xs text-white/70">{chapter.description}</p>
              </div>
              <span className="rounded-full border border-white/20 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80">
                {chapter.cue}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 rounded-3xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-4 w-4" />
          What the demo covers
        </p>
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
