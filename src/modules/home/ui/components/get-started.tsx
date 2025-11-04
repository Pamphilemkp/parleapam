"use client";

import Link from "next/link";
import { motion, easeInOut } from "framer-motion";
import { Bot, Video, BookOpen, LifeBuoy } from "lucide-react";
import { AgentCatalog } from "@/modules/agents/ui/components/agent-catalog";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

const whatsappNumber = "+905428805892"; // Replace with your actual WhatsApp number (international format, no + or 00)
const whatsappMessage = encodeURIComponent(
  "Hello, I am coming from Pam AI, and I need some support."
);
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

const steps = [
  {
    icon: <Bot className="text-primary size-7" />,
    title: "Create Your First AI Agent",
    description: "Set up custom AI agents that represent your style and needs.",
    href: "/agents",
  },
  {
    icon: <Video className="text-primary size-7" />,
    title: "Schedule a Meeting",
    description: "Book your AI-powered video calls and get real-time insights.",
    href: "/meetings",
  },
  {
    icon: <BookOpen className="text-primary size-7" />,
    title: "Explore Summaries & Transcripts",
    description: "Review detailed transcripts and summaries to save time.",
    href: "/meetings",
  },
  {
    icon: <LifeBuoy className="text-primary size-7" />,
    title: "Need Help? Chat on WhatsApp",
    description: "Chat with us on WhatsApp for quick help and support.",
    href: whatsappLink,
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      ease: easeInOut, // use imported easing function
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function GetStarted() {
  const router = useRouter();
  const createFromSample = trpc.agents.createFromSample.useMutation();
  const createMeeting = trpc.meetings.create.useMutation();

  // Check for selected agent from signup flow
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const selectedAgentId = sessionStorage.getItem('selectedAgentId');
    const selectedAgentIsPremium = sessionStorage.getItem('selectedAgentIsPremium') === 'true';

    if (selectedAgentId) {
      // Clear sessionStorage
      sessionStorage.removeItem('selectedAgentId');
      sessionStorage.removeItem('selectedAgentIsPremium');

      // Check premium access
      if (selectedAgentIsPremium) {
        // For premium agents, check subscription first
        // For now, just create the meeting - premium check happens in createFromSample
        toast.info('Setting up your meeting...');
      }

      // Create agent and start meeting
      createFromSample.mutate(
        { sampleAgentId: selectedAgentId },
        {
          onSuccess: (data) => {
            createMeeting.mutate(
              {
                name: `Meeting with ${data.agent.name}`,
                agentId: data.agentId,
              },
              {
                onSuccess: (meeting) => {
                  toast.success('Starting your meeting!');
                  router.push(`/call/${meeting.id}`);
                },
                onError: (error) => {
                  if (error.data?.code === 'FORBIDDEN') {
                    toast.error('Premium subscription required for this agent');
                    router.push('/upgrade');
                  } else {
                    toast.error('Failed to create meeting');
                  }
                },
              }
            );
          },
          onError: (error) => {
            if (error.data?.code === 'FORBIDDEN') {
              toast.error('Premium subscription required for this agent');
              router.push('/upgrade');
            } else {
              toast.error('Failed to set up agent');
            }
          },
        }
      );
    }
  }, [createFromSample, createMeeting, router]);

  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-8">
        Welcome Back to  Pam&apos;s AI
      </h1>
      <p className="text-center text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-muted-foreground">
        Here&apos;s how to get started quickly and make the most of your AI-powered communication experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {steps.map(({ icon, title, description, href }, idx) => (
          <motion.div
            key={idx}
            className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col items-start"
            variants={itemVariants}
          >
            <div className="mb-4">{icon}</div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-4">{description}</p>
            <Link
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="mt-auto inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              {title.includes("WhatsApp") ? "Get Support" : "Go"}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Sample Agents Section */}
      <motion.div
        className="mt-16"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Start a Meeting Instantly
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Choose from our ready-to-use AI agents and start having intelligent conversations right away.
          No setup required—just click and start talking.
        </p>
        <AgentCatalog />
      </motion.div>
    </motion.section>
  );
}
