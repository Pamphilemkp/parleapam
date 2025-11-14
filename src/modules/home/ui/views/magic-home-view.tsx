'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, MessageSquare, Video, BarChart3, Brain, Wand2, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PublicAgentCatalog } from '../components/public-agent-catalog';
import { PremiumDemoModal } from '../components/premium-demo-modal';
import { PremiumUpsellBanner } from '../components/premium-upsell-banner';
import { useEffect, useRef, useState } from 'react';

export default function MagicHomeView() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20"
          style={{
            backgroundPosition: `${mousePosition.x / 50}px ${mousePosition.y / 50}px`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.15), transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.15), transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.15), transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Hero Section - Magical */}
      <section ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            style={{ opacity, scale }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-primary/30 text-primary text-sm font-semibold mb-8 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                <span>AI-Powered Video Meetings • Revolutionary Technology</span>
              </motion.div>
              
              {/* Main heading with gradient text */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
              >
                <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                  Talk to AI Agents
                </span>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                  className="block text-foreground mt-2"
                >
                  Like Real People
                </motion.span>
              </motion.h1>
              
              {/* Animated description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Experience the future of AI communication. Have intelligent, natural conversations with 
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-primary font-semibold"
                >
                  {' '}realistic AI avatars{' '}
                </motion.span>
                that teach, explain, and demonstrate visually.
              </motion.p>
              
              {/* CTA Buttons with hover effects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl shadow-primary/50">
                    <Link href="/sign-up" className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PremiumDemoModal />
                </motion.div>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Free tier available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span>Start instantly</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>

      <PremiumUpsellBanner />

      {/* Features Grid - Enhanced */}
      <section className="py-20 sm:py-32 bg-background/80 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Everything You Need for AI Conversations
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features built for seamless, magical AI interactions
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: <Video className="h-7 w-7" />,
                title: 'HD Video Calls',
                description: 'Crystal-clear video quality with AI agents that feel natural and responsive.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: <Brain className="h-7 w-7" />,
                title: 'Smart AI Avatars',
                description: 'Realistic human-like avatars with expressions, gestures, and natural movements.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: <Wand2 className="h-7 w-7" />,
                title: 'Interactive Whiteboard',
                description: 'AI automatically draws, demonstrates, and teaches on the whiteboard in real-time.',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: <MessageSquare className="h-7 w-7" />,
                title: 'Smart Transcripts',
                description: 'Automatic transcription and AI-powered summaries of every conversation.',
                gradient: 'from-orange-500 to-red-500',
              },
              {
                icon: <Zap className="h-7 w-7" />,
                title: 'Real-Time Gestures',
                description: 'Watch AI agents blink, smile, laugh, and gesture naturally during conversations.',
                gradient: 'from-yellow-500 to-amber-500',
              },
              {
                icon: <BarChart3 className="h-7 w-7" />,
                title: 'Meeting Analytics',
                description: 'Track conversations, review insights, and improve your learning over time.',
                gradient: 'from-indigo-500 to-blue-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Agents - Enhanced */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-grid-pattern opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Start Talking Instantly
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              Choose from our ready-to-use AI agents. No setup required—just click and start your conversation.
            </p>
            <p className="text-sm text-muted-foreground">
              Free agents available immediately. Premium agents unlock after signup.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <PublicAgentCatalog />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 shadow-xl">
                <Link href="/sign-up" className="flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Magical */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-primary via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1), transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1), transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1), transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Ready to Start Talking?
              </motion.h2>
              <p className="text-xl sm:text-2xl mb-10 text-white/90">
                Join thousands of users having intelligent conversations with AI agents.
                <br />
                <span className="font-semibold">No credit card required.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-primary hover:bg-white/90 shadow-2xl">
                    <Link href="/sign-up" className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" variant="outline" className="text-lg px-10 py-7 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

