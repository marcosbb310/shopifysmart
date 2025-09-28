// Application initialization and startup validation
// Ensures all required environment variables and configurations are valid

import { validateEnv, EnvironmentValidationError, isDevelopment } from './env-validation';

/**
 * Application initialization result
 */
interface AppInitResult {
  success: boolean;
  message: string;
  errors?: string[];
}

/**
 * Initialize the application with environment validation
 * This should be called at the start of the application lifecycle
 * 
 * @returns AppInitResult with initialization status
 */
export function initializeApp(): AppInitResult {
  try {
    console.log('🚀 Initializing Shopify Pricing App...');
    
    // Validate environment variables
    const env = validateEnv();
    
    // Log successful initialization
    console.log('✅ Environment validation passed');
    console.log(`📊 Running in ${env.NODE_ENV} mode`);
    
    if (isDevelopment()) {
      console.log('🔧 Development mode - Enhanced logging enabled');
    }
    
    // Log Shopify configuration status (without exposing secrets)
    console.log('🛍️ Shopify configuration:');
    console.log(`  - Shop Domain: ${env.SHOPIFY_SHOP_DOMAIN}`);
    console.log(`  - Access Token: ${env.SHOPIFY_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`  - Client ID: ${env.SHOPIFY_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`  - Client Secret: ${env.SHOPIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
    
    // Log optional service configurations
    if (env.SUPABASE_URL) {
      console.log('🗄️ Supabase: ✅ Configured');
    } else {
      console.log('🗄️ Supabase: ⚠️ Not configured (optional)');
    }
    
    if (env.TRIGGER_SECRET_KEY) {
      console.log('⚡ Trigger.dev: ✅ Configured');
    } else {
      console.log('⚡ Trigger.dev: ⚠️ Not configured (optional)');
    }
    
    console.log('✅ Application initialization completed successfully');
    
    return {
      success: true,
      message: 'Application initialized successfully'
    };
    
  } catch (error) {
    console.error('❌ Application initialization failed');
    
    if (error instanceof EnvironmentValidationError) {
      console.error('Environment validation errors:');
      error.getFormattedErrors().forEach(msg => {
        console.error(`  - ${msg}`);
      });
      
      const missingVars = error.getMissingVariables();
      if (missingVars.length > 0) {
        console.error('\n🔧 Required environment variables:');
        missingVars.forEach(varName => {
          console.error(`  - ${varName}`);
        });
        console.error('\n💡 Create a .env.local file in your project root with these variables.');
        console.error('📖 See README.md for setup instructions.');
      }
      
      return {
        success: false,
        message: 'Environment validation failed',
        errors: error.getFormattedErrors()
      };
    }
    
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    console.error('Unexpected error:', errorMessage);
    
    return {
      success: false,
      message: `Initialization failed: ${errorMessage}`,
      errors: [errorMessage]
    };
  }
}

/**
 * Check if the application is properly initialized
 * This can be used in middleware or route handlers
 */
export function isAppInitialized(): boolean {
  try {
    validateEnv();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get initialization status for health checks
 */
export function getInitStatus(): {
  initialized: boolean;
  timestamp: string;
  environment: string;
} {
  const isInitialized = isAppInitialized();
  const env = process.env.NODE_ENV || 'development';
  
  return {
    initialized: isInitialized,
    timestamp: new Date().toISOString(),
    environment: env
  };
}
