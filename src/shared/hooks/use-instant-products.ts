"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/features/pricing/types';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total?: number;
}

interface UseInstantProductsOptions {
  pageSize?: number;
  cacheKey?: string;
}

/**
 * Hook for instant product loading with progressive enhancement
 * Shows cached data immediately, then loads fresh data in background
 */
export function useInstantProducts(options: UseInstantProductsOptions = {}) {
  const { pageSize = 50, cacheKey = 'instant-products' } = options;
  
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: false,
    error: null,
    hasMore: true
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const cacheRef = useRef<Map<string, { data: ProductsState; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Convert Shopify product to our Product interface (same as in products page)
  const convertShopifyProduct = useCallback((shopifyProduct: Record<string, unknown>): Product => {
    const shopifyProductTyped = shopifyProduct as {
      id: number;
      title: string;
      handle: string;
      variants: Array<{
        id: number;
        title: string;
        price: string;
        compare_at_price?: string;
        inventory_quantity: number;
        sku?: string;
        requires_shipping: boolean;
        taxable: boolean;
        option1?: string;
        option2?: string;
        option3?: string;
      }>;
      options: Array<{
        id: number;
        name: string;
        position: number;
        values: string[];
      }>;
      product_type?: string;
      tags?: string;
      vendor?: string;
      image?: { src: string };
      created_at: string;
      updated_at: string;
    };

    const primaryVariant = shopifyProductTyped.variants[0];
    const totalInventory = shopifyProductTyped.variants.reduce((sum: number, variant) => sum + variant.inventory_quantity, 0);
    const tags = shopifyProductTyped.tags ? shopifyProductTyped.tags.split(',').map((tag: string) => tag.trim()) : [];

    const variants = shopifyProductTyped.variants.map((variant) => ({
      id: variant.id.toString(),
      title: variant.title,
      price: parseFloat(variant.price),
      compareAtPrice: variant.compare_at_price ? parseFloat(variant.compare_at_price) : undefined,
      inventory: variant.inventory_quantity,
      sku: variant.sku || '',
      requiresShipping: variant.requires_shipping,
      taxable: variant.taxable,
      option1: variant.option1 || undefined,
      option2: variant.option2 || undefined,
      option3: variant.option3 || undefined
    }));

    const options = shopifyProductTyped.options.map((option) => ({
      id: option.id.toString(),
      name: option.name,
      position: option.position,
      values: option.values
    }));

    return {
      id: shopifyProductTyped.id.toString(),
      title: shopifyProductTyped.title,
      handle: shopifyProductTyped.handle,
      currentPrice: parseFloat(primaryVariant.price),
      costPrice: 0,
      compareAtPrice: primaryVariant.compare_at_price ? parseFloat(primaryVariant.compare_at_price) : undefined,
      basePrice: parseFloat(primaryVariant.price) * 0.8,
      maxPrice: parseFloat(primaryVariant.price) * 1.2,
      inventory: totalInventory,
      category: shopifyProductTyped.product_type || 'Uncategorized',
      tags,
      vendor: shopifyProductTyped.vendor || 'Unknown',
      imageUrl: shopifyProductTyped.image?.src || '',
      smartPricingEnabled: true,
      variants,
      options,
      createdAt: new Date(shopifyProductTyped.created_at),
      updatedAt: new Date(shopifyProductTyped.updated_at)
    };
  }, []);

  const fetchProducts = useCallback(async (page: number, showLoading = true) => {
    const cacheKeyForPage = `${cacheKey}-page-${page}`;
    
    // Check cache first
    const cached = cacheRef.current.get(cacheKeyForPage);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minute cache
      if (page === 1) {
        setState(prev => ({ ...prev, products: cached.data.products }));
      }
      // Don't show loading if we have cached data
      if (showLoading && page === 1) {
        setState(prev => ({ ...prev, loading: false }));
      }
    }

    if (showLoading) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`/api/shopify/products?limit=${pageSize}&page=${page}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data.products) {
        const products = data.data.products.map(convertShopifyProduct);
        
        // Cache the result
        cacheRef.current.set(cacheKeyForPage, {
          data: {
            products,
            loading: false,
            error: null,
            hasMore: data.data.hasMore || false,
            total: data.data.total
          },
          timestamp: Date.now()
        });
        
        if (page === 1) {
          setState({
            products,
            loading: false,
            error: null,
            hasMore: data.data.hasMore || false,
            total: data.data.total
          });
        } else {
          setState(prev => ({
            ...prev,
            products: [...prev.products, ...products],
            loading: false,
            hasMore: data.data.hasMore || false
          }));
        }
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      console.error('Error fetching products:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      }));
    }
  }, [pageSize, cacheKey, convertShopifyProduct]);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage, false); // Don't show loading for load more
    }
  }, [state.hasMore, state.loading, currentPage, fetchProducts]);

  const refresh = useCallback(() => {
    // Clear cache
    cacheRef.current.clear();
    setCurrentPage(1);
    setState(prev => ({ ...prev, products: [], error: null }));
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    total: state.total,
    loadMore,
    refresh,
    currentPage
  };
}
