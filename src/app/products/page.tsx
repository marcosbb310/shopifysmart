"use client";

import { useState, memo } from "react";
import { AppLayout } from "@/features/navigation";
import { ProductsLayout } from "@/features/products";
import { Product } from "@/features/pricing/types";
import { useInstantProducts } from "@/shared/hooks";
// Removed mock data imports - using real Shopify API data only

// Function to convert Shopify product to our Product interface
const convertShopifyProduct = (shopifyProduct: Record<string, unknown>): Product => {
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
};

// Fast products data fetcher with pagination and caching
const fetchProductsData = async (page = 1, limit = 50): Promise<{products: Product[], hasMore: boolean, total?: number}> => {
  const response = await fetch(`/api/shopify/products?limit=${limit}&page=${page}`);
  const data = await response.json();
  
  if (data.success && data.data.products) {
    const products = data.data.products.map(convertShopifyProduct);
    return {
      products,
      hasMore: data.data.hasMore || false,
      total: data.data.total
    };
  } else {
    throw new Error(data.message || 'Failed to fetch products');
  }
};

function ProductsPageComponent() {
  const [globalSmartPricing, setGlobalSmartPricing] = useState(true);

  // Use instant products hook for fast loading
  const { products, loading, error, hasMore, loadMore, refresh } = useInstantProducts({
    pageSize: 50
  });

  // Note: Loading state is now handled by ProductsLayout component

  // Show error state
  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Products</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={refresh} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ProductsLayout
        products={products}
        recommendations={[]} // No mock recommendations - will be generated from real data
        globalSmartPricing={globalSmartPricing}
        onPriceUpdate={async () => {}}
        onCostUpdate={async () => {}}
        onBasePriceUpdate={async () => {}}
        onMaxPriceUpdate={async () => {}}
        onSmartPricingToggle={() => {}}
        onGlobalSmartPricingToggle={() => setGlobalSmartPricing(!globalSmartPricing)}
        onBulkUpdate={async () => {}}
        onBulkPricingUpdate={async () => {}}
        onBulkApplyRecommendations={async () => {}}
        isLoading={loading}
      />
    </AppLayout>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductsPageComponent);