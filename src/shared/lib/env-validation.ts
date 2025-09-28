// Environment variable validation with Zod
// Prevents runtime failures by validating required environment variables at startup

import { z } from 'zod';

/**
 * Environment variables schema with Zod validation
 * Validates all required and optional environment variables
 */
export const envSchema = z.object({
  // Shopify API Configuration (Required)
  SHOPIFY_ACCESS_TOKEN: z
    .string()
    .min(1, 'SHOPIFY_ACCESS_TOKEN is required and cannot be empty')
    .describe('Shopify API access token for authentication'),

  SHOPIFY_CLIENT_SECRET: z
    .string()
    .min(1, 'SHOPIFY_CLIENT_SECRET is required and cannot be empty')
    .describe('Shopify app client secret for API authentication'),

  SHOPIFY_CLIENT_ID: z
    .string()
    .min(1, 'SHOPIFY_CLIENT_ID is required and cannot be empty')
    .describe('Shopify app client ID for API authentication'),

  // Shopify Shop Configuration (Optional with default)
  SHOPIFY_SHOP_DOMAIN: z
    .string()
    .optional()
    .default('1t0yf8-7e.myshopify.com')
    .describe('Shopify shop domain (defaults to development shop)'),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development')
    .describe('Node.js environment mode'),

  // Optional: Database Configuration (for future Supabase integration)
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid URL')
    .optional()
    .describe('Database connection URL for Supabase'),

  SUPABASE_URL: z
    .string()
    .url('SUPABASE_URL must be a valid URL')
    .optional()
    .describe('Supabase project URL'),

  SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'SUPABASE_ANON_KEY cannot be empty if provided')
    .optional()
    .describe('Supabase anonymous key for client-side operations'),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY cannot be empty if provided')
    .optional()
    .describe('Supabase service role key for server-side operations'),

  // Optional: Trigger.dev Configuration (for background jobs)
  TRIGGER_SECRET_KEY: z
    .string()
    .min(1, 'TRIGGER_SECRET_KEY cannot be empty if provided')
    .optional()
    .describe('Trigger.dev secret key for background job processing'),

  // Optional: Application Configuration
  APP_URL: z
    .string()
    .url('APP_URL must be a valid URL')
    .optional()
    .describe('Application base URL for webhooks and redirects'),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .optional()
    .describe('Public application URL for client-side operations'),
});

/**
 * Validated environment variables type
 * Use this type throughout the application for type safety
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Environment validation error with detailed information
 */
export class EnvironmentValidationError extends Error {
  constructor(
    message: string,
    public validationErrors: z.ZodError
  ) {
    super(message);
    this.name = 'EnvironmentValidationError';
  }

  /**
   * Get formatted error messages for logging
   */
  getFormattedErrors(): string[] {
    return this.validationErrors.issues.map(error => {
      const path = error.path.join('.');
      return `${path}: ${error.message}`;
    });
  }

  /**
   * Get missing environment variables
   */
  getMissingVariables(): string[] {
    return this.validationErrors.issues
      .filter(error => error.code === 'invalid_type' && (error as { received?: unknown }).received === 'undefined')
      .map(error => error.path.join('.'));
  }
}

/**
 * Validates and returns environment variables
 * Throws EnvironmentValidationError if validation fails
 * 
 * @returns Validated environment variables
 * @throws EnvironmentValidationError if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = new EnvironmentValidationError(
        'Environment variable validation failed',
        error
      );
      
      // Log detailed error information
      console.error('❌ Environment validation failed:');
      console.error('Missing or invalid environment variables:');
      validationError.getFormattedErrors().forEach(msg => {
        console.error(`  - ${msg}`);
      });
      
      const missingVars = validationError.getMissingVariables();
      if (missingVars.length > 0) {
        console.error('\n🔧 Required environment variables:');
        missingVars.forEach(varName => {
          console.error(`  - ${varName}`);
        });
        console.error('\n💡 Create a .env.local file in your project root with these variables.');
      }
      
      throw validationError;
    }
    
    // Re-throw unexpected errors
    throw error;
  }
}

/**
 * Safely get environment variables with validation
 * Returns validated environment variables or throws descriptive error
 * 
 * @returns Validated environment variables
 */
export function getEnv(): Env {
  return validateEnv();
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get Shopify configuration from validated environment
 */
export function getShopifyConfig(): {
  accessToken: string;
  clientSecret: string;
  clientId: string;
  shopDomain: string;
} {
  const env = getEnv();
  
  return {
    accessToken: env.SHOPIFY_ACCESS_TOKEN,
    clientSecret: env.SHOPIFY_CLIENT_SECRET,
    clientId: env.SHOPIFY_CLIENT_ID,
    shopDomain: env.SHOPIFY_SHOP_DOMAIN,
  };
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  const env = getEnv();
  return !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

/**
 * Check if Trigger.dev is configured
 */
export function isTriggerDevConfigured(): boolean {
  const env = getEnv();
  return !!env.TRIGGER_SECRET_KEY;
}
