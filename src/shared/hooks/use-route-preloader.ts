"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface RoutePreloaderOptions {
  delay?: number; // Delay before preloading (ms)
  priority?: 'high' | 'low'; // Preload priority
}

/**
 * Hook for preloading routes and their data
 * Improves navigation performance by loading routes before they're needed
 */
export function useRoutePreloader() {
  const router = useRouter();

  const preloadRoute = useCallback((
    href: string, 
    options: RoutePreloaderOptions = {}
  ) => {
    const { delay = 0, priority = 'low' } = options;

    const preload = () => {
      // Preload the route
      router.prefetch(href);
      
      // Also prefetch common API endpoints that might be needed
      if (href === '/dashboard') {
        // Preload dashboard data
        fetch('/api/dashboard', { priority: priority === 'high' ? 'high' : 'low' })
          .catch(() => {}); // Silently fail if API doesn't exist yet
      } else if (href === '/products') {
        // Preload products data
        fetch('/api/shopify/products', { priority: priority === 'high' ? 'high' : 'low' })
          .catch(() => {}); // Silently fail if API doesn't exist yet
      } else if (href === '/performance') {
        // Preload performance data
        fetch('/api/performance', { priority: priority === 'high' ? 'high' : 'low' })
          .catch(() => {}); // Silently fail if API doesn't exist yet
      }
    };

    if (delay > 0) {
      setTimeout(preload, delay);
    } else {
      preload();
    }
  }, [router]);

  const preloadOnHover = useCallback((href: string) => {
    // Immediate preload on hover
    preloadRoute(href, { priority: 'high' });
  }, [preloadRoute]);

  const preloadOnVisible = useCallback((href: string) => {
    // Preload when navigation item becomes visible
    preloadRoute(href, { delay: 100, priority: 'low' });
  }, [preloadRoute]);

  return {
    preloadRoute,
    preloadOnHover,
    preloadOnVisible
  };
}

/**
 * Hook for preloading all main navigation routes
 * Should be used in the main layout to preload common routes
 */
export function useNavigationPreloader() {
  const { preloadRoute } = useRoutePreloader();

  useEffect(() => {
    // Preload main routes after a short delay
    const routes = ['/dashboard', '/products', '/performance', '/history'];
    
    const preloadRoutes = () => {
      routes.forEach(route => {
        preloadRoute(route, { delay: Math.random() * 1000, priority: 'low' });
      });
    };

    // Preload routes after 2 seconds
    const timeoutId = setTimeout(preloadRoutes, 2000);

    return () => clearTimeout(timeoutId);
  }, [preloadRoute]);

  return { preloadRoute };
}
