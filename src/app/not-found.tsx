"use client";
import Link from 'next/link';
import { motion, Variants, Transition } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function NotFound() {
  const [isDark, setIsDark] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeMediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  // Simplified animations for mobile performance
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const } as Transition,
    },
  };

  const imageVariants: Variants = {
    initial: { scale: 0.95 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' as const } as Transition,
    },
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* 404 Section */}
      <motion.section
        className="bg-gradient-to-br from-primary via-chart-2 to-chart-4 text-primary-foreground py-12 sm:py-16 md:py-24 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 sm:mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            404
          </motion.h1>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Oops! Page Not Found
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            It looks like you’ve wandered off the path. Let’s get you back to exploring the future of communication with Parle à Pam AI!
          </motion.p>
          <motion.div
            className="relative max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12"
            variants={imageVariants}
            initial="initial"
            whileHover={{ scale: 1.05 }}
          >
            {!isImageLoaded && (
              <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse" />
            )}
            <Image
              src="/home-not-found.png"
              alt="Illustration of a lost AI robot for 404 page"
              width={800}
              height={450}
              className={`w-full rounded-lg shadow-2xl border border-border ${isImageLoaded ? 'block' : 'hidden'}`}
              style={{ transformStyle: 'preserve-3d' }}
              unoptimized
              onLoadingComplete={() => setIsImageLoaded(true)}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg pointer-events-none" />
          </motion.div>
          <Link
            href="/"
            className="inline-block bg-secondary text-secondary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-secondary/80 transition shadow-xl"
          >
            Back to Home
          </Link>
        </div>
        <div className="absolute inset-0 z-0 opacity-20 sm:opacity-30">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
        </div>
      </motion.section>

    </div>
  );
}