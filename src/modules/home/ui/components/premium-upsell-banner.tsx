"use client";
import { authClient } from '@/lib/auth-client';
import { usePremium } from '@/hooks/use-premium';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';

export function PremiumUpsellBanner() {
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const { isPremium, isLoading } = usePremium({ enabled: isAuthenticated });

  const userName = useMemo(() => session?.user?.name?.split(' ')?.[0] ?? 'there', [session?.user?.name]);

  if (!isAuthenticated || isPending || isLoading || isPremium) {
    return null;
  }

  return (
    <section className="relative mx-auto mt-12 w-full max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-transparent p-6 shadow-2xl sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3 text-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            Premium unlocked
          </div>
          <h3 className="text-2xl font-bold sm:text-3xl">
            {userName}, keep Pam on screen with whiteboard and gesture mode.
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Upgrade to unlock unlimited meetings, animated avatars, and AI-generated recaps that land in your inbox
            seconds after every call.
          </p>
          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Visual explanations saved automatically to your library.
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Invite your team and share premium agents instantly.
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-6 text-lg font-semibold text-primary-foreground shadow-xl hover:bg-primary/90"
            onClick={() => window.open('/upgrade', '_self')}
          >
            Upgrade now
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-dashed border-primary/40 text-sm text-muted-foreground hover:bg-primary/10"
            onClick={() => window.open('/agents', '_self')}
          >
            Peek at the dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}

