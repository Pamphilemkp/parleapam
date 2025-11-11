"use client";
import Link from 'next/link';
import { motion, Variants, Transition } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import VideoSection from '../components/video-section';


export default function HomeViews() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeMediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  // Simplified animations for mobile to improve performance
  const heroVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const } as Transition,
    },
  };

  const gifVariants: Variants = {
    initial: { scale: 0.95 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' as const } as Transition,
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' as const } as Transition,
    },
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-primary via-chart-2 to-chart-4 text-primary-foreground py-12 sm:py-16 md:py-24 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Revolutionize Communication with Parle à Pam AI
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Experience the future of video calls with AI-driven insights, smart summaries, and seamless interactions.
          </motion.p>
          <motion.div
            className="relative max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12"
            variants={gifVariants}
            initial="initial"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/ai-video-call-fallback.png"
              alt="Human interacting with AI in a video call on Parle à Pam AI"
              width={1280}
              height={720}
              className="w-full rounded-lg shadow-2xl border border-border"
              style={{ transformStyle: 'preserve-3d' }}
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg pointer-events-none" />
          </motion.div>
          <Link
            href="/signup"
            className="inline-block bg-secondary text-secondary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-secondary/80 transition shadow-xl"
          >
            Start Your Free Trial Now
          </Link>
        </div>
        <div className="absolute inset-0 z-0 opacity-20 sm:opacity-30">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground mb-8 sm:mb-12 md:mb-16">
            Unbelievable Features Await
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: '📹',
                title: 'AI-Powered Video Calls',
                description: 'Engage with custom AI agents that provide real-time insights, making every call smarter and more productive.',
              },
              {
                icon: '📝',
                title: 'Smart Summaries & Transcripts',
                description: 'Instantly generate concise summaries and accurate transcripts, saving you time and effort.',
              },
              {
                icon: '🔄',
                title: 'Replay Past Meetings',
                description: 'Revisit your discussions with ease, ensuring no detail is ever lost.',
              },
              {
                icon: '📱',
                title: 'Seamless Mobile Experience',
                description: 'Access Parle à Pam AI anywhere, anytime, with a flawless mobile-friendly interface.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 bg-gradient-to-br from-card to-muted/20"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="text-primary text-3xl sm:text-4xl mb-4 sm:mb-6">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-card-foreground mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      <VideoSection />

      {/* CTA Section */}
      <section className="bg-sidebar text-sidebar-foreground py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Transform Your Communication Today
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join the revolution of intelligent communication. Experience Parle à Pam AI and elevate your video calls to the next level.
          </motion.p>
          <Link
            href="/sign-up"
            className="inline-block bg-sidebar-primary text-sidebar-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-sidebar-primary/80 transition shadow-xl"
          >
            Try It Free
          </Link>
        </div>
      </section>

    </div>
  );
}