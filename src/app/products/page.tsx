"use client";

import { AppLayout } from "@/features/navigation";
import { ProductsLayout } from "@/features/products";
import { Product, PricingRecommendation } from "@/features/pricing/types";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    handle: "premium-wireless-headphones",
    currentPrice: 199.99,
    costPrice: 89.99,
    compareAtPrice: 249.99,
    inventory: 45,
    category: "Electronics",
    tags: ["wireless", "premium", "audio"],
    vendor: "TechCorp",
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
    inventory: 120,
    category: "Clothing",
    tags: ["organic", "cotton", "sustainable"],
    vendor: "EcoWear",
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
    inventory: 23,
    category: "Electronics",
    tags: ["fitness", "smart", "health"],
    vendor: "FitTech",
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
    inventory: 67,
    category: "Food & Beverage",
    tags: ["artisan", "coffee", "premium"],
    vendor: "CoffeeCo",
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
    inventory: 34,
    category: "Home & Garden",
    tags: ["minimalist", "desk", "lighting"],
    vendor: "HomeDesign",
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
    inventory: 89,
    category: "Sports & Fitness",
    tags: ["yoga", "fitness", "premium"],
    vendor: "FitLife",
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
    inventory: 15,
    category: "Accessories",
    tags: ["vintage", "leather", "handmade"],
    vendor: "LeatherCraft",
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
    inventory: 56,
    category: "Electronics",
    tags: ["bluetooth", "speaker", "portable"],
    vendor: "AudioTech",
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
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    console.log(`Updating product ${productId} price to ${newPrice}`);
    // TODO: Implement actual price update logic
  };

  const handleBulkUpdate = (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => {
    console.log(`Bulk updating products ${productIds.join(', ')} with ${priceChange} ${type} change`);
    // TODO: Implement actual bulk update logic
  };

  const handleBulkApplyRecommendations = (productIds: string[]) => {
    console.log(`Applying AI recommendations to products ${productIds.join(', ')}`);
    // TODO: Implement actual recommendation application logic
  };

  return (
    <AppLayout>
      <ProductsLayout
        products={mockProducts}
        recommendations={mockRecommendations}
        onPriceUpdate={handlePriceUpdate}
        onBulkUpdate={handleBulkUpdate}
        onBulkApplyRecommendations={handleBulkApplyRecommendations}
      />
    </AppLayout>
  );
}
