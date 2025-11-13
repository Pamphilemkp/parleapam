"use client";
import { Menu, X, LogOut, Crown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { usePremium } from '@/hooks/use-premium';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const { isPremium } = usePremium({ enabled: isAuthenticated });
  const [isSigningOut, setIsSigningOut] = useState(false);

  const menuVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeOut' as const } as Transition,
    },
  };

  const handleSignOut = () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
          setIsSigningOut(false);
        },
        onError: () => {
          setIsSigningOut(false);
        },
      },
    });
  };

  const renderDesktopActions = () => {
    if (isPending) {
      return null;
    }

    if (isAuthenticated) {
      return (
        <>
          <Link href="#features" className="text-foreground hover:text-primary transition font-medium">
            Features
          </Link>
          <Link href="/agents" className="text-foreground hover:text-primary transition font-medium">
            AI Dashboard
          </Link>
          {!isPremium && (
            <Link
              href="/upgrade"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/20"
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </Link>
          )}
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm font-semibold"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </>
      );
    }

    return (
      <>
        <Link href="#features" className="text-foreground hover:text-primary transition font-medium">
          Features
        </Link>
        <Link href="/sign-in" className="text-foreground hover:text-primary transition font-medium">
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
        >
          Get Started
        </Link>
      </>
    );
  };

  const renderMobileLinks = () => {
    if (isPending) return null;

    if (isAuthenticated) {
      return (
        <>
          <Link
            href="#features"
            className="text-foreground hover:text-primary transition font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/agents"
            className="text-foreground hover:text-primary transition font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            AI Dashboard
          </Link>
          {!isPremium && (
            <Link
              href="/upgrade"
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
              onClick={() => setIsMenuOpen(false)}
            >
              <Crown className="h-4 w-4" />
              Upgrade to Premium
            </Link>
          )}
          <Button
            variant="outline"
            className="justify-center"
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            disabled={isSigningOut}
          >
            Sign out
          </Button>
        </>
      );
    }

    return (
      <>
        <Link
          href="#features"
          className="text-foreground hover:text-primary transition font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Features
        </Link>
        <Link
          href="/sign-in"
          className="text-foreground hover:text-primary transition font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition shadow-md"
          onClick={() => setIsMenuOpen(false)}
        >
          Get Started
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">Parle à Pam AI</h1>
          </div>
          {/* Desktop Menu */}
          <div className="hidden items-center space-x-6 md:flex">{renderDesktopActions()}</div>
          {/* Mobile Menu Button */}
          <button
            className="text-foreground focus:outline-none md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Menu */}
        <motion.div
          className="overflow-hidden md:hidden"
          initial="hidden"
          animate={isMenuOpen ? 'visible' : 'hidden'}
          variants={menuVariants}
        >
          <div className="flex flex-col space-y-4 py-4">{renderMobileLinks()}</div>
        </motion.div>
      </div>
    </nav>
  );
}