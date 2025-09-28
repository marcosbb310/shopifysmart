"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/features/navigation";
import { ProductsLayout } from "@/features/products";
import { Product } from "@/features/pricing/types";
import { mockProducts, mockRecommendations } from "@/shared/lib";

// Function to convert Shopify product to our Product interface
const convertShopifyProduct = (shopifyProduct: any): Product => {
  const primaryVariant = shopifyProduct.variants[0];
  const totalInventory = shopifyProduct.variants.reduce((sum: number, variant: any) => sum + variant.inventory_quantity, 0);
  const tags = shopifyProduct.tags ? shopifyProduct.tags.split(',').map((tag: string) => tag.trim()) : [];

  const variants = shopifyProduct.variants.map((variant: any) => ({
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

  const options = shopifyProduct.options.map((option: any) => ({
    id: option.id.toString(),
    name: option.name,
    position: option.position,
    values: option.values
  }));

  return {
    id: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    currentPrice: parseFloat(primaryVariant.price),
    costPrice: 0,
    compareAtPrice: primaryVariant.compare_at_price ? parseFloat(primaryVariant.compare_at_price) : undefined,
    basePrice: parseFloat(primaryVariant.price) * 0.8,
    maxPrice: parseFloat(primaryVariant.price) * 1.2,
    inventory: totalInventory,
    category: shopifyProduct.product_type || 'Uncategorized',
    tags,
    vendor: shopifyProduct.vendor,
    imageUrl: shopifyProduct.image?.src || '',
    smartPricingEnabled: true,
    variants,
    options,
    createdAt: new Date(shopifyProduct.created_at),
    updatedAt: new Date(shopifyProduct.updated_at)
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalSmartPricing, setGlobalSmartPricing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Shopify API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/shopify/products');
        const data = await response.json();
        
        if (data.success && data.data.products) {
          const convertedProducts = data.data.products.map(convertShopifyProduct);
          setProducts(convertedProducts);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        // Fallback to mock data if API fails
        console.log('Falling back to mock data due to error');
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show error state (with fallback to mock data)
  if (error) {
    console.warn('Using fallback mock data due to error:', error);
  }

  return (
    <AppLayout>
      <ProductsLayout
        products={products}
        recommendations={mockRecommendations}
        globalSmartPricing={globalSmartPricing}
        onPriceUpdate={() => {}}
        onCostUpdate={() => {}}
        onBasePriceUpdate={() => {}}
        onMaxPriceUpdate={() => {}}
        onSmartPricingToggle={() => {}}
        onGlobalSmartPricingToggle={() => setGlobalSmartPricing(!globalSmartPricing)}
        onBulkUpdate={() => {}}
        onBulkPricingUpdate={() => {}}
        onBulkApplyRecommendations={() => {}}
      />
    </AppLayout>
  );
}