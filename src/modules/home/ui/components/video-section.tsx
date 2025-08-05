"use client";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function VideoSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const videoVariants: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      initial="initial"
      animate="visible"
      variants={videoVariants}
    >
      <div className="relative w-full aspect-video">
        {!isVideoLoaded && (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Please wait while we are loading Pam&apos;s AI... 🤖💬🧑‍💻
            </p>
          </div>
        )}

        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full rounded-lg shadow-2xl border border-border object-cover ${isVideoLoaded ? "block" : "hidden"}`}
          onLoadedData={() => setIsVideoLoaded(true)}
          aria-label="AI-themed animation"
        >
          <source src="/videos/home-banner-ai.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg pointer-events-none" />
      </div>
    </motion.section>
  );
}
