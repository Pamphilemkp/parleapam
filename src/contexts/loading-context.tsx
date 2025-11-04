'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { setLoadingContext } from '@/trpc/client';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage?: string;
  startLoading: (id: string, message?: string) => void;
  stopLoading: (id: string) => void;
  clearLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
  debounceMs?: number;
}

export function LoadingProvider({ children, debounceMs = 300 }: LoadingProviderProps) {
  const [loadingRequests, setLoadingRequests] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoadingStateRef = useRef(false);

  const updateLoadingState = useCallback(() => {
    const hasRequests = loadingRequests.size > 0;
    
    // Debounce rapid state changes to prevent flicker
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (hasRequests !== lastLoadingStateRef.current) {
        setIsLoading(hasRequests);
        lastLoadingStateRef.current = hasRequests;
        
        // Set message from first request if available
        if (hasRequests && loadingRequests.size > 0) {
          const firstMessage = Array.from(loadingRequests.values())[0];
          setLoadingMessage(firstMessage);
        } else {
          setLoadingMessage(undefined);
        }
      }
    }, debounceMs);
  }, [loadingRequests, debounceMs]);

  useEffect(() => {
    updateLoadingState();
  }, [loadingRequests, updateLoadingState]);

  const startLoading = useCallback((id: string, message?: string) => {
    setLoadingRequests((prev) => {
      const next = new Map(prev);
      next.set(id, message || 'Loading...');
      return next;
    });
  }, []);

  const stopLoading = useCallback((id: string) => {
    setLoadingRequests((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearLoading = useCallback(() => {
    setLoadingRequests(new Map());
  }, []);

  // Expose loading functions to tRPC interceptor
  useEffect(() => {
    setLoadingContext({ startLoading, stopLoading });
    return () => {
      setLoadingContext(null);
    };
  }, [startLoading, stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
        clearLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

