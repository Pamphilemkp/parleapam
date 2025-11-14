import { trpc } from '@/trpc/client';

interface UsePremiumOptions {
  enabled?: boolean;
}

export function usePremium(options?: UsePremiumOptions) {
  const enabled = options?.enabled ?? true;
  const { data: subscription, isLoading } = trpc.premium.getCurrentSubscription.useQuery(undefined, {
    enabled,
  });
  const isPremium = !!subscription;

  return {
    isPremium,
    subscription,
    isLoading,
  };
}