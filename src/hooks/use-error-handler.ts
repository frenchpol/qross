import { useCallback } from 'react';
import { toast } from 'sonner';
import { isEmptyError, formatErrorMessage, logError } from '@/utils/error';

export const useErrorHandler = (context: string) => {
  const handleError = useCallback((error: unknown, silent = false) => {
    // Skip empty errors
    if (isEmptyError(error)) {
      return;
    }

    // Log error with context
    logError(context, error);

    // Show toast unless silent is true
    if (!silent) {
      const message = formatErrorMessage(error);
      toast.error(message, {
        className: 'bg-background/95 border-border/50 text-foreground'
      });
    }
  }, [context]);

  return handleError;
};