import React, { Component, ErrorInfo } from 'react';
import { toast } from 'sonner';
import { isEmptyError, formatErrorMessage, logError } from '@/utils/error';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    if (isEmptyError(error)) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    if (isEmptyError(error)) {
      return;
    }

    logError('ErrorBoundary', error, {
      componentStack: errorInfo.componentStack
    });

    const message = formatErrorMessage(error);
    toast.error(message, {
      className: 'bg-background/95 border-border/50 text-foreground',
      duration: 5000
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Oops! Quelque chose s'est mal passé
            </h1>
            <p className="text-foreground/70 mb-6">
              {this.state.error?.message || 'Une erreur inattendue est survenue'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}