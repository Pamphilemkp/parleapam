"use client";
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import {  useState } from 'react';
import { motion, Variants, Transition } from 'framer-motion';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeOut' as const } as Transition,
    },
  };

    
    return(
              <nav className="bg-card shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                        Parle à Pam AI
                      </h1>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                      <Link href="#features" className="text-foreground hover:text-primary transition font-medium">
                        Features
                      </Link>
                      <Link
                        href="/sign-up"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
                      >
                        Get Started
                      </Link>
                    </div>
                    {/* Mobile Menu Button */}
                    <button
                      className="md:hidden text-foreground focus:outline-none"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                  {/* Mobile Menu */}
                  <motion.div
                    className="md:hidden overflow-hidden"
                    initial="hidden"
                    animate={isMenuOpen ? 'visible' : 'hidden'}
                    variants={menuVariants}
                  >
                    <div className="flex flex-col space-y-4 py-4">
                      <Link
                        href="#features"
                        className="text-foreground hover:text-primary transition font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Features
                      </Link>
                      <Link
                        href="/sign-up"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
                        onClick={() =>setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </nav>

    )
}