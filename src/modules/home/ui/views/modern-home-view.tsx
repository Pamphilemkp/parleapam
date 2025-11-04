'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Zap, MessageSquare, Video, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
// import Image from 'next/image';
import { PublicAgentCatalog } from '../components/public-agent-catalog';

export default function ModernHomeView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Sparkles className="h-4 w-4" />
                AI-Powered Video Meetings
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Talk to AI Agents
                <span className="block text-primary mt-2">Like Real People</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Have intelligent video conversations with AI agents. Perfect for tutoring, coaching, 
                language practice, and more. Start instantly—no setup required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/sign-up">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="#demo">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free tier available
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for AI Conversations
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features built for seamless AI interactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Video className="h-6 w-6" />,
                title: 'HD Video Calls',
                description: 'Crystal-clear video quality with AI agents that feel natural and responsive.',
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: 'Smart Transcripts',
                description: 'Automatic transcription and summaries of every conversation for easy review.',
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: 'Interactive Whiteboard',
                description: 'Draw, annotate, and collaborate in real-time with premium agents.',
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Real-Time Gestures',
                description: 'Watch AI agents blink, gesture, and respond naturally to conversations.',
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Meeting Analytics',
                description: 'Track your conversations, review insights, and improve over time.',
              },
              {
                icon: <Play className="h-6 w-6" />,
                title: 'Replay & Review',
                description: 'Revisit past meetings with full video playback and transcripts.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Agents - Available for Everyone */}
      <section className="py-20 sm:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Start Talking Instantly
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Choose from our ready-to-use AI agents. No setup required—just click and start your conversation.
              </p>
              <p className="text-sm text-muted-foreground">
                Free agents available immediately. Premium agents unlock after signup.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <PublicAgentCatalog />
          </motion.div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              Sign up free to start unlimited conversations with AI agents
            </p>
            <Button asChild size="lg">
              <Link href="/sign-up">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Talking?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Join thousands of users having intelligent conversations with AI agents.
                No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link href="/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

