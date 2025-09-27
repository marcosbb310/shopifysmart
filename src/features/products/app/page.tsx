"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/features/navigation";
import { ProductsLayout } from "@/features/products";
import { Product, PricingRecommendation } from "@/features/pricing/types";
import { ShopifyProduct, ShopifyVariant } from "@/shared/types";

// Function to convert Shopify product to our Product interface
const convertShopifyProduct = (shopifyProduct: ShopifyProduct): Product => {
  // Get the first variant as the primary variant for pricing
  const primaryVariant = shopifyProduct.variants[0];
  
  // Calculate total inventory across all variants
  const totalInventory = shopifyProduct.variants.reduce((sum, variant) => sum + variant.inventory_quantity, 0);
  
  // Parse tags from comma-separated string to array
  const tags = shopifyProduct.tags ? shopifyProduct.tags.split(',').map(tag => tag.trim()) : [];
  
  // Convert Shopify variants to our ProductVariant interface
  const variants = shopifyProduct.variants.map((variant: ShopifyVariant) => ({
    id: variant.id.toString(),
    title: variant.title,
    price: parseFloat(variant.price),
    compareAtPrice: variant.compare_at_price ? parseFloat(variant.compare_at_price) : undefined,
    inventory: variant.inventory_quantity,
    sku: variant.sku || undefined,
    barcode: variant.barcode || undefined,
    weight: variant.weight || undefined,
    weightUnit: variant.weight_unit || undefined,
    requiresShipping: variant.requires_shipping,
    taxable: variant.taxable,
    option1: variant.option1 || undefined,
    option2: variant.option2 || undefined,
    option3: variant.option3 || undefined,
  }));
  
  // Convert Shopify options to our ProductOption interface
  const options = shopifyProduct.options?.map((option) => ({
    id: option.id.toString(),
    name: option.name,
    position: option.position,
    values: option.values,
  })) || [];
  
  return {
    id: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    currentPrice: parseFloat(primaryVariant?.price || '0'),
    costPrice: undefined, // Shopify doesn't provide cost price in standard API
    compareAtPrice: primaryVariant?.compare_at_price ? parseFloat(primaryVariant.compare_at_price) : undefined,
    basePrice: parseFloat(primaryVariant?.price || '0'), // Use current price as base
    maxPrice: parseFloat(primaryVariant?.price || '0') * 1.5, // Set max as 150% of current
    inventory: totalInventory,
    category: shopifyProduct.product_type || 'Uncategorized',
    tags,
    vendor: shopifyProduct.vendor,
    imageUrl: shopifyProduct.image?.src,
    smartPricingEnabled: false, // Default to false, can be enabled per product
    variants,
    options,
    createdAt: new Date(shopifyProduct.created_at),
    updatedAt: new Date(shopifyProduct.updated_at)
  };
};

// Mock data for demonstration (fallback)
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    handle: "premium-wireless-headphones",
    currentPrice: 199.99,
    costPrice: 89.99,
    compareAtPrice: 249.99,
    basePrice: 179.99,
    maxPrice: 229.99,
    inventory: 45,
    category: "Electronics",
    tags: ["wireless", "premium", "audio"],
    vendor: "TechCorp",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    variants: [
      {
        id: "1-1",
        title: "Black",
        price: 199.99,
        compareAtPrice: 249.99,
        inventory: 25,
        sku: "PWH-BLK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Black"
      },
      {
        id: "1-2", 
        title: "White",
        price: 199.99,
        compareAtPrice: 249.99,
        inventory: 20,
        sku: "PWH-WHT-001",
        requiresShipping: true,
        taxable: true,
        option1: "White"
      }
    ],
    options: [
      {
        id: "1-color",
        name: "Color",
        position: 1,
        values: ["Black", "White"]
      }
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "2",
    title: "Organic Cotton T-Shirt",
    handle: "organic-cotton-tshirt",
    currentPrice: 29.99,
    costPrice: 12.99,
    compareAtPrice: 39.99,
    basePrice: 24.99,
    maxPrice: 34.99,
    inventory: 120,
    category: "Clothing",
    tags: ["organic", "cotton", "sustainable"],
    vendor: "EcoWear",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    smartPricingEnabled: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "3",
    title: "Smart Fitness Tracker",
    handle: "smart-fitness-tracker",
    currentPrice: 149.99,
    costPrice: 65.99,
    compareAtPrice: 179.99,
    basePrice: 129.99,
    maxPrice: 169.99,
    inventory: 23,
    category: "Electronics",
    tags: ["fitness", "smart", "health"],
    vendor: "FitTech",
    imageUrl: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19")
  },
  {
    id: "4",
    title: "Artisan Coffee Beans",
    handle: "artisan-coffee-beans",
    currentPrice: 24.99,
    costPrice: 8.99,
    compareAtPrice: 29.99,
    basePrice: 19.99,
    maxPrice: 27.99,
    inventory: 67,
    category: "Food & Beverage",
    tags: ["artisan", "coffee", "premium"],
    vendor: "CoffeeCo",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-17")
  },
  {
    id: "5",
    title: "Minimalist Desk Lamp",
    handle: "minimalist-desk-lamp",
    currentPrice: 89.99,
    costPrice: 35.99,
    compareAtPrice: 109.99,
    basePrice: 79.99,
    maxPrice: 99.99,
    inventory: 34,
    category: "Home & Garden",
    tags: ["minimalist", "desk", "lighting"],
    vendor: "HomeDesign",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    smartPricingEnabled: false,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21")
  },
  {
    id: "6",
    title: "Yoga Mat Pro",
    handle: "yoga-mat-pro",
    currentPrice: 79.99,
    costPrice: 28.99,
    compareAtPrice: 99.99,
    basePrice: 69.99,
    maxPrice: 89.99,
    inventory: 89,
    category: "Sports & Fitness",
    tags: ["yoga", "fitness", "premium"],
    vendor: "FitLife",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-16")
  },
  {
    id: "7",
    title: "Vintage Leather Wallet",
    handle: "vintage-leather-wallet",
    currentPrice: 59.99,
    costPrice: 22.99,
    compareAtPrice: 79.99,
    basePrice: 49.99,
    maxPrice: 69.99,
    inventory: 15,
    category: "Accessories",
    tags: ["vintage", "leather", "handmade"],
    vendor: "LeatherCraft",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    smartPricingEnabled: false,
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-22")
  },
  {
    id: "8",
    title: "Bluetooth Speaker",
    handle: "bluetooth-speaker",
    currentPrice: 129.99,
    costPrice: 45.99,
    compareAtPrice: 159.99,
    basePrice: 119.99,
    maxPrice: 149.99,
    inventory: 56,
    category: "Electronics",
    tags: ["bluetooth", "speaker", "portable"],
    vendor: "AudioTech",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-20")
  }
];

const mockRecommendations: PricingRecommendation[] = [
  {
    productId: "1",
    currentPrice: 199.99,
    recommendedPrice: 219.99,
    confidence: 0.87,
    reasoning: "High demand during holiday season, competitor prices increased by 15%",
    expectedImpact: {
      revenueChange: 12.5,
      salesChange: -3.2,
      marginChange: 8.7
    },
    algorithm: "demand_competitor_hybrid",
    createdAt: new Date()
  },
  {
    productId: "2",
    currentPrice: 29.99,
    recommendedPrice: 27.99,
    confidence: 0.72,
    reasoning: "Seasonal discount to boost sales, inventory levels high",
    expectedImpact: {
      revenueChange: -6.7,
      salesChange: 18.3,
      marginChange: -2.1
    },
    algorithm: "inventory_seasonal",
    createdAt: new Date()
  },
  {
    productId: "3",
    currentPrice: 149.99,
    recommendedPrice: 139.99,
    confidence: 0.65,
    reasoning: "Competitor launched similar product at lower price point",
    expectedImpact: {
      revenueChange: -6.7,
      salesChange: 22.1,
      marginChange: -4.2
    },
    algorithm: "competitor_analysis",
    createdAt: new Date()
  },
  {
    productId: "4",
    currentPrice: 24.99,
    recommendedPrice: 26.99,
    confidence: 0.81,
    reasoning: "Coffee bean prices increased globally, maintain margin",
    expectedImpact: {
      revenueChange: 8.0,
      salesChange: -5.2,
      marginChange: 12.3
    },
    algorithm: "cost_based",
    createdAt: new Date()
  },
  {
    productId: "5",
    currentPrice: 89.99,
    recommendedPrice: 94.99,
    confidence: 0.76,
    reasoning: "Home office trend continues, premium positioning justified",
    expectedImpact: {
      revenueChange: 5.6,
      salesChange: -2.8,
      marginChange: 7.1
    },
    algorithm: "trend_analysis",
    createdAt: new Date()
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalSmartPricing, setGlobalSmartPricing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real Shopify products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch real Shopify products
        console.log('Attempting to fetch Shopify products...');
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('/api/shopify/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch products');
        }
        
        console.log('Products count:', data.data.products.length);
        
        // Convert Shopify products to our Product interface
        const convertedProducts = data.data.products.map((shopifyProduct: ShopifyProduct) => 
          convertShopifyProduct(shopifyProduct)
        );
        
        console.log('Converted products:', convertedProducts);
        setProducts(convertedProducts);
      } catch (err) {
        console.error('Error fetching Shopify products:', err);
        let errorMessage = 'Failed to fetch products';
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request timed out - using mock data';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        // Fallback to mock data if API fails
        console.log('Falling back to mock data due to error:', errorMessage);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    console.log(`Updating product ${productId} price to ${newPrice}`);
    updateProduct(productId, { currentPrice: newPrice });
  };

  const handleCostUpdate = (productId: string, newCost: number) => {
    console.log(`Updating product ${productId} cost to ${newCost}`);
    updateProduct(productId, { costPrice: newCost });
  };

  const handleBasePriceUpdate = (productId: string, newBasePrice: number) => {
    console.log(`Updating product ${productId} base price to ${newBasePrice}`);
    updateProduct(productId, { basePrice: newBasePrice });
  };

  const handleMaxPriceUpdate = (productId: string, newMaxPrice: number) => {
    console.log(`Updating product ${productId} max price to ${newMaxPrice}`);
    updateProduct(productId, { maxPrice: newMaxPrice });
  };

  const handleSmartPricingToggle = (productId: string, enabled: boolean) => {
    console.log(`Toggling smart pricing for product ${productId} to ${enabled}`);
    updateProduct(productId, { smartPricingEnabled: enabled });
  };

  const handleGlobalSmartPricingToggle = (enabled: boolean) => {
    console.log(`Toggling global smart pricing to ${enabled}`);
    setGlobalSmartPricing(enabled);
    // Update all products to match global setting
    setProducts(prevProducts => 
      prevProducts.map(product => ({
        ...product,
        smartPricingEnabled: enabled,
        updatedAt: new Date()
      }))
    );
  };

  const handleBulkUpdate = (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => {
    console.log(`Bulk updating products ${productIds.join(', ')} with ${priceChange} ${type} change`);
    // TODO: Implement actual bulk update logic
  };

  const handleBulkPricingUpdate = (field: string, type: 'percentage' | 'fixed', value: number) => {
    console.log(`Bulk updating ${field} for all products with ${value} ${type} change`);
    
    setProducts(prevProducts => 
      prevProducts.map(product => {
        let newValue: number;
        const currentValue = product[field as keyof Product] as number;
        
        if (type === 'percentage') {
          newValue = currentValue * (1 + value / 100);
        } else {
          newValue = currentValue + value;
        }
        
        // Ensure the new value is not negative
        newValue = Math.max(0, newValue);
        
        return {
          ...product,
          [field]: newValue,
          updatedAt: new Date()
        };
      })
    );
  };

  const handleBulkApplyRecommendations = (productIds: string[]) => {
    console.log(`Applying AI recommendations to products ${productIds.join(', ')}`);
    // TODO: Implement actual recommendation application logic
  };

  // Show loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading your Shopify products...</p>
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
        onPriceUpdate={handlePriceUpdate}
        onCostUpdate={handleCostUpdate}
        onBasePriceUpdate={handleBasePriceUpdate}
        onMaxPriceUpdate={handleMaxPriceUpdate}
        onSmartPricingToggle={handleSmartPricingToggle}
        onGlobalSmartPricingToggle={handleGlobalSmartPricingToggle}
        onBulkUpdate={handleBulkUpdate}
        onBulkPricingUpdate={handleBulkPricingUpdate}
        onBulkApplyRecommendations={handleBulkApplyRecommendations}
      />
    </AppLayout>
  );
}
