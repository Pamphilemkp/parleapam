import { trpc } from '@/trpc/client';

export function usePremium() {
  const { data: subscription, isLoading } = trpc.premium.getCurrentSubscription.useQuery();
  const isPremium = !!subscription;

  return {
    isPremium,
    subscription,
    isLoading,
  };
}

