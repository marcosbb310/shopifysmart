"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
  retryCount: number;
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  showNetworkStatus?: boolean;
}

export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = async () => {
    const { maxRetries = 3, retryDelay = 1000, onRetry } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({ isRetrying: true });

    // Call custom retry handler if provided
    if (onRetry) {
      try {
        await onRetry();
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }

    // Wait for retry delay
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
        retryCount: retryCount + 1,
      });
    }, retryDelay);
  };

  isNetworkError = (error: Error): boolean => {
    const networkErrorMessages = [
      'network error',
      'fetch failed',
      'connection refused',
      'timeout',
      'offline',
      'no internet',
    ];
    
    return networkErrorMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  };

  getErrorIcon = (error: Error) => {
    if (this.isNetworkError(error)) {
      return <WifiOff className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  getErrorTitle = (error: Error) => {
    if (this.isNetworkError(error)) {
      return 'Connection Error';
    }
    return 'Something went wrong';
  };

  getErrorDescription = (error: Error) => {
    if (this.isNetworkError(error)) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return 'We encountered an unexpected error. This has been logged and we\'re working to fix it.';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, isRetrying, retryCount } = this.state;
      const { maxRetries = 3, showNetworkStatus = true } = this.props;

      if (!error) return null;

      const canRetry = retryCount < maxRetries;
      const isNetworkError = this.isNetworkError(error);

      return (
        <div className="p-4">
          <Alert variant="destructive">
            {this.getErrorIcon(error)}
            <AlertTitle>{this.getErrorTitle(error)}</AlertTitle>
            <AlertDescription className="mt-2">
              {this.getErrorDescription(error)}
            </AlertDescription>
            
            {showNetworkStatus && isNetworkError && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Wifi className="h-3 w-3" />
                <span>Check your connection</span>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry} 
                  size="sm" 
                  variant="outline"
                  disabled={isRetrying}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              )}
              
              {retryCount >= maxRetries && (
                <div className="text-sm text-muted-foreground">
                  Maximum retry attempts reached
                </div>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="text-sm cursor-pointer text-muted-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors in functional components
export const useAsyncError = () => {
  return (error: Error) => {
    // This will be caught by the nearest AsyncErrorBoundary
    throw error;
  };
};
