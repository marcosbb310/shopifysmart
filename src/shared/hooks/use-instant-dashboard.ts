"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface DashboardData {
  revenue: {
    regular: number;
    smart: number;
    percentageIncrease: number;
  };
  weeklyPerformance: any[];
  topProducts: any[];
}

interface UseInstantDashboardOptions {
  cacheKey?: string;
}

/**
 * Hook for instant dashboard loading with progressive enhancement
 * Shows cached data immediately, then loads fresh data in background
 */
export function useInstantDashboard(options: UseInstantDashboardOptions = {}) {
  const { cacheKey = 'instant-dashboard' } = options;
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cacheRef = useRef<{ data: DashboardData; timestamp: number } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    // Check cache first
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < 10 * 60 * 1000) { // 10 minute cache
      setData(cacheRef.current.data);
      if (showLoading) {
        setLoading(false);
      }
    }

    if (showLoading) {
      setLoading(true);
      setError(null);
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      // Simulate API call delay (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // TODO: Replace with real API calls to fetch dashboard data
      // const response = await fetch('/api/dashboard', {
      //   signal: abortControllerRef.current.signal
      // });
      // const apiData = await response.json();
      
      const apiData: DashboardData = {
        revenue: {
          regular: 800000,
          smart: 980000,
          percentageIncrease: 22.5
        },
        weeklyPerformance: [],
        topProducts: []
      };
      
      // Cache the result
      cacheRef.current = {
        data: apiData,
        timestamp: Date.now()
      };
      
      setData(apiData);
      setLoading(false);
      setError(null);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
    }
  }, []);

  const refresh = useCallback(() => {
    // Clear cache
    cacheRef.current = null;
    setData(null);
    setError(null);
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Initial load
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refresh
  };
}
