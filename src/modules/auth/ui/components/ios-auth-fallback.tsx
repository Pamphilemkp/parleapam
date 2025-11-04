'use client';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { parseAuthError, getAuthErrorUI } from '@/lib/auth-errors';

interface IOSAuthFallbackProps {
  error: unknown;
  onRetry: () => void;
  onCancel?: () => void;
}

export function IOSAuthFallback({ error, onRetry, onCancel }: IOSAuthFallbackProps) {
  const authError = parseAuthError(error);
  const errorUI = getAuthErrorUI(authError);

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorUI.title}</AlertTitle>
      <AlertDescription className="mt-2">
        {errorUI.description}
      </AlertDescription>
      <div className="mt-4 flex gap-2">
        <Button onClick={onRetry} size="sm">
          {errorUI.action}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" size="sm">
            Cancel
          </Button>
        )}
      </div>
    </Alert>
  );
}

