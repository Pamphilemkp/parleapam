import { httpBatchLink } from '@trpc/client';

// This will be used to intercept tRPC requests and manage loading state
// The actual integration happens in the TRPCProvider component
export function createTRPCClientWithLoading(
  getLoadingContext: () => { startLoading: (id: string) => void; stopLoading: (id: string) => void }
) {
  const requestIdMap = new Map<string, string>();

  return httpBatchLink({
    url: '/api/trpc',
    headers: async () => {
      return {};
    },
    // Intercept requests to manage loading state
    fetch: async (url, options) => {
      const requestId = crypto.randomUUID();
      const loadingContext = getLoadingContext();
      
      loadingContext.startLoading(requestId);
      requestIdMap.set(requestId, requestId);

      try {
        const response = await fetch(url, options);
        return response;
      } finally {
        loadingContext.stopLoading(requestId);
        requestIdMap.delete(requestId);
      }
    },
  });
}

