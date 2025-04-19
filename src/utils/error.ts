/**
 * Utility functions for error handling
 */

export const isEmptyError = (error: unknown): boolean => {
  if (!error) return true;
  if (typeof error === 'object' && Object.keys(error).length === 0) return true;
  if (error instanceof Error && !error.message && !error.stack) return true;
  return false;
};

export const isValidError = (error: unknown): error is Error => {
  if (isEmptyError(error)) return false;
  
  if (error instanceof Error) return true;
  
  if (typeof error === 'object') {
    const errorLike = error as { message?: unknown; name?: unknown };
    return typeof errorLike.message === 'string' && 
           typeof errorLike.name === 'string';
  }
  
  return false;
};

export const formatErrorMessage = (error: unknown): string => {
  if (isValidError(error)) {
    return error.message || 'Une erreur inattendue est survenue';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Une erreur inattendue est survenue';
};

export const logError = (context: string, error: unknown, extra?: Record<string, unknown>) => {
  if (isEmptyError(error)) return;

  const errorDetails = {
    context,
    error: isValidError(error) ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    ...extra,
    timestamp: new Date().toISOString()
  };

  // Only log if there's meaningful error information
  if (errorDetails.error || extra) {
    console.error(`Error in ${context}:`, errorDetails);
  }
};

// Custom error class for application-specific errors
export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}