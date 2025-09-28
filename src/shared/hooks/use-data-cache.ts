"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds (5 minutes)
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
}

/**
 * Custom hook for caching API data with TTL and stale-while-revalidate strategy
 * This reduces API calls and improves navigation performance
 */
export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    staleWhileRevalidate = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store cache to avoid re-initialization
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());

  const getCachedData = useCallback((cacheKey: string): T | null => {
    const entry = cacheRef.current.get(cacheKey);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired && !staleWhileRevalidate) {
      cacheRef.current.delete(cacheKey);
      return null;
    }

    return entry.data;
  }, [staleWhileRevalidate]);

  const setCachedData = useCallback((cacheKey: string, data: T, customTtl?: number) => {
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    });
  }, [ttl]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first unless forcing refresh
    if (!forceRefresh) {
      const cachedData = getCachedData(key);
      if (cachedData) {
        setData(cachedData);
        setError(null);
        
        // If data is stale, fetch in background if staleWhileRevalidate is enabled
        const entry = cacheRef.current.get(key);
        if (entry && staleWhileRevalidate) {
          const now = Date.now();
          const isStale = now - entry.timestamp > entry.ttl;
          if (isStale) {
            // Fetch fresh data in background without setting loading state
            fetcher().then(freshData => {
              setCachedData(key, freshData);
              setData(freshData);
            }).catch(err => {
              console.warn('Background refresh failed:', err);
            });
          }
        }
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await fetcher();
      setCachedData(key, result);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error(`Cache fetch error for ${key}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, getCachedData, setCachedData, staleWhileRevalidate]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cacheRef.current.delete(key);
    fetchData(true);
  }, [key, fetchData]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh,
    invalidate,
    isCached: !!getCachedData(key)
  };
}

/**
 * Hook for prefetching data that might be needed soon
 * Useful for preloading data on hover or route prefetch
 */
export function usePrefetchCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000 } = options;
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());

  const prefetch = useCallback(async () => {
    // Check if data is already cached and fresh
    const entry = cacheRef.current.get(key);
    if (entry) {
      const now = Date.now();
      const isFresh = now - entry.timestamp <= entry.ttl;
      if (isFresh) return; // Data is fresh, no need to prefetch
    }

    try {
      const result = await fetcher();
      cacheRef.current.set(key, {
        data: result,
        timestamp: Date.now(),
        ttl
      });
    } catch (err) {
      console.warn(`Prefetch failed for ${key}:`, err);
    }
  }, [key, fetcher, ttl]);

  return { prefetch };
}
