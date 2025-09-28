// Server-side application initializer component
// Validates environment variables at application startup

import { initializeApp } from '../lib';

/**
 * Server-side application initializer
 * This component validates environment variables when the app starts
 * It should be imported and used in the root layout
 */
export async function AppInitializer() {
  try {
    const result = initializeApp();
    
    if (!result.success) {
      console.error('❌ Application initialization failed:', result.message);
      if (result.errors) {
        console.error('Errors:', result.errors);
      }
      
      // In production, you might want to return an error page
      // For now, we'll log the error and continue
      if (process.env.NODE_ENV === 'production') {
        console.error('🚨 Production environment initialization failed - check logs');
      }
    }
    
    // This component doesn't render anything visible
    // It just performs initialization
    return null;
  } catch (error) {
    console.error('❌ Unexpected error during app initialization:', error);
    return null;
  }
}

/**
 * Initialize the app synchronously for immediate validation
 * This can be called at the module level for immediate validation
 */
export function initializeAppSync(): boolean {
  try {
    const result = initializeApp();
    return result.success;
  } catch (error) {
    console.error('❌ Sync app initialization failed:', error);
    return false;
  }
}
