'use client';

import { useLoading } from '@/contexts/loading-context';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function GlobalLoader() {
  const { isLoading, loadingMessage } = useLoading();
  const [showLoader, setShowLoader] = useState(false);

  // Delay showing loader slightly to prevent flicker on fast requests
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoader(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={loadingMessage || 'Loading'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {loadingMessage && (
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        )}
      </div>
      <span className="sr-only">{loadingMessage || 'Loading content'}</span>
    </div>
  );
}

