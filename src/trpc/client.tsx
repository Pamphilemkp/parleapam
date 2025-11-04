'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState, useRef, useCallback } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const trpc = createTRPCReact<AppRouter>();
let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return process.env.NEXT_PUBLIC_APP_URL;
  })();
  return `${base}/api/trpc`;
}

// Create a context to pass loading functions to tRPC interceptor
let loadingContextRef: { startLoading: (id: string, msg?: string) => void; stopLoading: (id: string) => void } | null = null;

export function setLoadingContext(context: typeof loadingContextRef) {
  loadingContextRef = context;
}

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const queryClient = getQueryClient();
  const requestMapRef = useRef<Map<string, string>>(new Map());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          // Intercept requests to manage loading state
          fetch: async (url, options) => {
            const requestId = crypto.randomUUID();
            requestMapRef.current.set(requestId, requestId);
            
            // Use loading context if available
            if (loadingContextRef) {
              loadingContextRef.startLoading(requestId, 'Loading...');
            }

            try {
              const response = await fetch(url, options);
              return response;
            } catch (error) {
              throw error;
            } finally {
              if (loadingContextRef) {
                loadingContextRef.stopLoading(requestId);
              }
              requestMapRef.current.delete(requestId);
            }
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}