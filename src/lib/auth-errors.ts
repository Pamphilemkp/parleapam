export enum AuthErrorCode {
  USER_CANCELLED = 'USER_CANCELLED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  OAUTH_ERROR = 'OAUTH_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  recoverable: boolean;
}

export function parseAuthError(error: unknown): AuthError {
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; code?: string; name?: string };

    // Check for user cancellation (iOS Safari)
    if (
      err.message?.includes('cancel') ||
      err.message?.includes('User cancelled') ||
      err.code === 'USER_CANCELLED'
    ) {
      return {
        code: AuthErrorCode.USER_CANCELLED,
        message: 'Sign-in was cancelled. Please try again.',
        recoverable: true,
      };
    }

    // Check for network errors
    if (
      err.message?.includes('network') ||
      err.message?.includes('fetch') ||
      err.name === 'NetworkError'
    ) {
      return {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again.',
        recoverable: true,
      };
    }

    // Check for token refresh errors
    if (err.message?.includes('token') || err.message?.includes('refresh')) {
      return {
        code: AuthErrorCode.TOKEN_REFRESH_FAILED,
        message: 'Session expired. Please sign in again.',
        recoverable: true,
      };
    }

    // Check for OAuth errors
    if (err.message?.includes('oauth') || err.code?.includes('oauth')) {
      return {
        code: AuthErrorCode.OAUTH_ERROR,
        message: 'Authentication error. Please try again or use a different sign-in method.',
        recoverable: true,
      };
    }
  }

  return {
    code: AuthErrorCode.UNKNOWN,
    message: 'An unexpected error occurred. Please try again.',
    recoverable: true,
  };
}

export function getAuthErrorUI(error: AuthError): {
  title: string;
  description: string;
  action: string;
} {
  switch (error.code) {
    case AuthErrorCode.USER_CANCELLED:
      return {
        title: 'Sign-in Cancelled',
        description: 'You cancelled the sign-in process.',
        action: 'Try Again',
      };
    case AuthErrorCode.NETWORK_ERROR:
      return {
        title: 'Connection Error',
        description: 'Unable to connect. Please check your internet connection.',
        action: 'Retry',
      };
    case AuthErrorCode.TOKEN_REFRESH_FAILED:
      return {
        title: 'Session Expired',
        description: 'Your session has expired. Please sign in again.',
        action: 'Sign In',
      };
    case AuthErrorCode.OAUTH_ERROR:
      return {
        title: 'Authentication Error',
        description: 'There was a problem signing you in. Please try again.',
        action: 'Retry',
      };
    default:
      return {
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
        action: 'Retry',
      };
  }
}

