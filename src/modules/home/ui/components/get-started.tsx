"use client";

import Link from "next/link";
import { motion, easeInOut } from "framer-motion";
import { Bot, Video, BookOpen, LifeBuoy } from "lucide-react";

const whatsappNumber = "+9054288005892"; // Replace with your actual WhatsApp number (international format, no + or 00)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
    </motion.section>
  );
}
