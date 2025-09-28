"use client";

import { useEffect } from 'react';
import { toast } from 'sonner';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default browser behavior
      event.preventDefault();
      
      // Show user-friendly error message
      const errorMessage = event.reason?.message || 'An unexpected error occurred';
      toast.error('Error', {
        description: errorMessage,
        duration: 5000,
      });
    };

    // Handle unhandled JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      
      // Show user-friendly error message
      const errorMessage = event.error?.message || 'An unexpected error occurred';
      toast.error('Error', {
        description: errorMessage,
        duration: 5000,
      });
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return <>{children}</>;
}

// Hook for manually triggering global error handling
export const useGlobalErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    toast.error('Error', {
      description: error.message,
      duration: 5000,
    });
  };

  return { handleError };
};
