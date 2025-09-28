/**
 * Standardized error handling utilities for the Shopify Pricing App
 * 
 * This module provides comprehensive error handling capabilities including:
 * - Custom error classes for different error types
 * - Standardized error messages and codes
 * - Error logging and reporting utilities
 * - Retry mechanisms for transient failures
 * - Validation helpers for common scenarios
 * 
 * @module ErrorHandling
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * Custom error types for better error categorization
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly isRetryable: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    options: {
      statusCode?: number;
      isRetryable?: boolean;
      context?: Record<string, unknown>;
    } = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    if (options.statusCode !== undefined) {
      this.statusCode = options.statusCode;
    }
    this.isRetryable = options.isRetryable ?? false;
    if (options.context !== undefined) {
      this.context = options.context;
    }
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed', context?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', {
      statusCode: 0,
      isRetryable: true,
      ...(context && { context }),
    });
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', {
      statusCode: 400,
      isRetryable: false,
      ...(context && { context }),
    });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, context?: Record<string, unknown>) {
    super(`${resource} not found`, 'NOT_FOUND', {
      statusCode: 404,
      isRetryable: false,
      ...(context && { context }),
    });
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', context?: Record<string, unknown>) {
    super(message, 'UNAUTHORIZED', {
      statusCode: 401,
      isRetryable: false,
      ...(context && { context }),
    });
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, unknown>) {
    super(message, 'RATE_LIMIT', {
      statusCode: 429,
      isRetryable: true,
      ...(context && { context }),
    });
    this.name = 'RateLimitError';
  }
}

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT: 'RATE_LIMIT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SHOPIFY_API_ERROR: 'SHOPIFY_API_ERROR',
  PRICING_CALCULATION_ERROR: 'PRICING_CALCULATION_ERROR',
} as const;

/**
 * Standard error messages for user-facing errors
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  SHOPIFY_API_ERROR: 'Unable to connect to Shopify. Please check your connection and try again.',
  PRICING_CALCULATION_ERROR: 'Unable to calculate pricing. Please check your product data.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isRetryable;
  }
  
  if (error instanceof Error) {
    // Network-related errors are generally retryable
    const networkErrorMessages = [
      'network error',
      'fetch failed',
      'connection refused',
      'timeout',
      'offline',
      'no internet',
      'network request failed',
    ];
    
    return networkErrorMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }
  
  return false;
}

/**
 * Gets user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Map common error messages to user-friendly ones
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return ERROR_MESSAGES.NOT_FOUND;
    }
    
    if (message.includes('rate limit') || message.includes('429')) {
      return ERROR_MESSAGES.RATE_LIMIT;
    }
    
    if (message.includes('validation') || message.includes('400')) {
      return ERROR_MESSAGES.VALIDATION_ERROR;
    }
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
}

/**
 * Logs error with context for debugging
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    code: error instanceof AppError ? error.code : undefined,
    statusCode: error instanceof AppError ? error.statusCode : undefined,
    isRetryable: isRetryableError(error),
    context,
    timestamp: new Date().toISOString(),
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }
  
  // In production, you would send this to an error reporting service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

/**
 * Wraps async functions with standardized error handling
 */
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T> {
  try {
    return await asyncFn();
  } catch (error) {
    logError(error, context);
    throw error;
  }
}

/**
 * Creates a retry mechanism for failed operations
 */
export async function withRetry<T>(
  asyncFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoffMultiplier?: number;
    retryCondition?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoffMultiplier = 2,
    retryCondition = isRetryableError,
  } = options;
  
  let lastError: unknown;
  let currentDelay = delay;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt or error is not retryable
      if (attempt === maxRetries || !retryCondition(error)) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }
  
  throw lastError;
}

/**
 * Validates and throws appropriate errors for common validation scenarios
 */
export function validateRequired(value: unknown, fieldName: string): asserts value is NonNullable<unknown> {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

export function validateNumber(value: unknown, fieldName: string, min?: number, max?: number): asserts value is number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }
  if (min !== undefined && num < min) {
    throw new ValidationError(`${fieldName} must be at least ${min}`);
  }
  if (max !== undefined && num > max) {
    throw new ValidationError(`${fieldName} must be at most ${max}`);
  }
}

export function validateString(value: unknown, fieldName: string, minLength?: number, maxLength?: number): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }
  if (minLength !== undefined && value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`);
  }
  if (maxLength !== undefined && value.length > maxLength) {
    throw new ValidationError(`${fieldName} must be at most ${maxLength} characters long`);
  }
}
