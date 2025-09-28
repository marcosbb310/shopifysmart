// Centralized mock data management
// Provides consistent mock data across all components for development and fallback scenarios

import { Product, PricingRecommendation } from '@/features/pricing/types';

// ============================================================================
// DASHBOARD MOCK DATA
// ============================================================================

export interface TopProduct {
  id: string;
  name: string;
  currentPrice: number;
  smartPrice: number;
  sales: number;
  revenue: number;
  priceChange: number;
  category: string;
}

export interface WeeklyData {
  day: string;
  regular: number;
  smart: number;
}

export const mockTopProducts: TopProduct[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    currentPrice: 199.99,
    smartPrice: 219.99,
    sales: 156,
    revenue: 34319.44,
    priceChange: 10.0,
    category: "Electronics"
  },
  {
    id: "2", 
    name: "Organic Cotton T-Shirt",
    currentPrice: 29.99,
    smartPrice: 34.99,
    sales: 89,
    revenue: 3114.11,
    priceChange: 16.7,
    category: "Clothing"
  },
  {
    id: "3",
    name: "Stainless Steel Water Bottle",
    currentPrice: 24.99,
    smartPrice: 27.99,
    sales: 67,
    revenue: 1875.33,
    priceChange: 12.0,
    category: "Accessories"
  }
];

export const mockWeeklyData: WeeklyData[] = [
  { day: "Mon", regular: 12000, smart: 12500 },
  { day: "Tue", regular: 11500, smart: 12000 },
  { day: "Wed", regular: 13000, smart: 13500 },
  { day: "Thu", regular: 12500, smart: 13000 },
  { day: "Fri", regular: 14000, smart: 15000 },
  { day: "Sat", regular: 13500, smart: 14500 },
  { day: "Sun", regular: 11000, smart: 11800 }
];

// ============================================================================
// PERFORMANCE MOCK DATA
// ============================================================================

export interface PerformanceMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}

export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    title: "Total Revenue",
    value: "$124,589",
    change: "+12.5%",
    trend: "up",
    description: "vs last month"
  },
  {
    title: "Average Order Value",
    value: "$89.42",
    change: "+8.2%",
    trend: "up",
    description: "vs last month"
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-2.1%",
    trend: "down",
    description: "vs last month"
  },
  {
    title: "Smart Pricing Impact",
    value: "+$18,420",
    change: "+15.8%",
    trend: "up",
    description: "additional revenue"
  }
];

// ============================================================================
// HISTORY MOCK DATA
// ============================================================================

export interface ReportMetrics {
  revenue: string;
  orders: string;
  conversion: string;
}

export interface RecentReport {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  description: string;
  metrics: ReportMetrics;
}

export const mockRecentReports: RecentReport[] = [
  {
    id: "1",
    title: "Monthly Performance Report",
    type: "Performance",
    date: "2024-01-15",
    status: "completed",
    description: "Comprehensive analysis of pricing performance for December 2023",
    metrics: {
      revenue: "+$18,420",
      orders: "+156",
      conversion: "+2.3%"
    }
  },
  {
    id: "2", 
    title: "Product Price Optimization",
    type: "Optimization",
    date: "2024-01-12",
    status: "completed",
    description: "AI recommendations applied to top 20 products",
    metrics: {
      revenue: "+$8,950",
      orders: "+89",
      conversion: "+1.8%"
    }
  },
  {
    id: "3",
    title: "Competitive Analysis Report",
    type: "Analysis",
    date: "2024-01-10",
    status: "completed",
    description: "Market positioning analysis for electronics category",
    metrics: {
      revenue: "+$12,340",
      orders: "+234",
      conversion: "+3.1%"
    }
  },
  {
    id: "4",
    title: "Weekly Revenue Summary",
    type: "Summary",
    date: "2024-01-08",
    status: "completed",
    description: "Weekly performance summary and trend analysis",
    metrics: {
      revenue: "+$5,670",
      orders: "+67",
      conversion: "+1.2%"
    }
  }
];

// ============================================================================
// PRODUCTS MOCK DATA
// ============================================================================

export const mockProducts: Product[] = [
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
    updatedAt: new Date("2024-01-15")
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
    smartPricingEnabled: true,
    variants: [
      {
        id: "2-1",
        title: "Small - Black",
        price: 29.99,
        compareAtPrice: 39.99,
        inventory: 30,
        sku: "OCT-S-BLK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Small",
        option2: "Black"
      }
    ],
    options: [
      {
        id: "2-size",
        name: "Size",
        position: 1,
        values: ["Small", "Medium", "Large"]
      },
      {
        id: "2-color",
        name: "Color",
        position: 2,
        values: ["Black", "White", "Navy"]
      }
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "3",
    title: "Smart Fitness Tracker",
    handle: "smart-fitness-tracker",
    currentPrice: 149.99,
    costPrice: 65.99,
    compareAtPrice: 199.99,
    basePrice: 129.99,
    maxPrice: 179.99,
    inventory: 78,
    category: "Electronics",
    tags: ["fitness", "smart", "health"],
    vendor: "FitTech",
    imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    variants: [
      {
        id: "3-1",
        title: "Black",
        price: 149.99,
        compareAtPrice: 199.99,
        inventory: 45,
        sku: "SFT-BLK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Black"
      },
      {
        id: "3-2",
        title: "Pink",
        price: 149.99,
        compareAtPrice: 199.99,
        inventory: 33,
        sku: "SFT-PNK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Pink"
      }
    ],
    options: [
      {
        id: "3-color",
        name: "Color",
        position: 1,
        values: ["Black", "Pink", "Blue"]
      }
    ],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-14")
  },
  {
    id: "4",
    title: "Artisan Coffee Beans",
    handle: "artisan-coffee-beans",
    currentPrice: 24.99,
    costPrice: 8.99,
    compareAtPrice: 32.99,
    basePrice: 19.99,
    maxPrice: 29.99,
    inventory: 200,
    category: "Food & Beverage",
    tags: ["coffee", "artisan", "organic"],
    vendor: "BeanCraft",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    smartPricingEnabled: false,
    variants: [
      {
        id: "4-1",
        title: "Light Roast",
        price: 24.99,
        compareAtPrice: 32.99,
        inventory: 100,
        sku: "ACB-LR-001",
        requiresShipping: true,
        taxable: true,
        option1: "Light Roast"
      },
      {
        id: "4-2",
        title: "Dark Roast",
        price: 24.99,
        compareAtPrice: 32.99,
        inventory: 100,
        sku: "ACB-DR-001",
        requiresShipping: true,
        taxable: true,
        option1: "Dark Roast"
      }
    ],
    options: [
      {
        id: "4-roast",
        name: "Roast Level",
        position: 1,
        values: ["Light Roast", "Dark Roast"]
      }
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-13")
  },
  {
    id: "5",
    title: "Minimalist Desk Lamp",
    handle: "minimalist-desk-lamp",
    currentPrice: 89.99,
    costPrice: 35.99,
    compareAtPrice: 119.99,
    basePrice: 79.99,
    maxPrice: 109.99,
    inventory: 56,
    category: "Home & Office",
    tags: ["minimalist", "desk", "lighting"],
    vendor: "ModernHome",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    variants: [
      {
        id: "5-1",
        title: "White",
        price: 89.99,
        compareAtPrice: 119.99,
        inventory: 28,
        sku: "MDL-WHT-001",
        requiresShipping: true,
        taxable: true,
        option1: "White"
      },
      {
        id: "5-2",
        title: "Black",
        price: 89.99,
        compareAtPrice: 119.99,
        inventory: 28,
        sku: "MDL-BLK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Black"
      }
    ],
    options: [
      {
        id: "5-color",
        name: "Color",
        position: 1,
        values: ["White", "Black"]
      }
    ],
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-11")
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
    category: "Fitness",
    tags: ["yoga", "mat", "fitness"],
    vendor: "FlexFit",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    variants: [
      {
        id: "6-1",
        title: "Purple",
        price: 79.99,
        compareAtPrice: 99.99,
        inventory: 45,
        sku: "YMP-PUR-001",
        requiresShipping: true,
        taxable: true,
        option1: "Purple"
      },
      {
        id: "6-2",
        title: "Blue",
        price: 79.99,
        compareAtPrice: 99.99,
        inventory: 44,
        sku: "YMP-BLU-001",
        requiresShipping: true,
        taxable: true,
        option1: "Blue"
      }
    ],
    options: [
      {
        id: "6-color",
        name: "Color",
        position: 1,
        values: ["Purple", "Blue", "Green"]
      }
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-09")
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
    inventory: 67,
    category: "Accessories",
    tags: ["vintage", "leather", "wallet"],
    vendor: "LeatherCraft",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    variants: [
      {
        id: "7-1",
        title: "Brown",
        price: 59.99,
        compareAtPrice: 79.99,
        inventory: 35,
        sku: "VLW-BRN-001",
        requiresShipping: true,
        taxable: true,
        option1: "Brown"
      },
      {
        id: "7-2",
        title: "Black",
        price: 59.99,
        compareAtPrice: 79.99,
        inventory: 32,
        sku: "VLW-BLK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Black"
      }
    ],
    options: [
      {
        id: "7-color",
        name: "Color",
        position: 1,
        values: ["Brown", "Black"]
      }
    ],
    createdAt: new Date("2023-12-28"),
    updatedAt: new Date("2024-01-07")
  },
  {
    id: "8",
    title: "Bluetooth Speaker",
    handle: "bluetooth-speaker",
    currentPrice: 129.99,
    costPrice: 45.99,
    compareAtPrice: 169.99,
    basePrice: 109.99,
    maxPrice: 149.99,
    inventory: 34,
    category: "Electronics",
    tags: ["bluetooth", "speaker", "audio"],
    vendor: "SoundWave",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    smartPricingEnabled: true,
    variants: [
      {
        id: "8-1",
        title: "Black",
        price: 129.99,
        compareAtPrice: 169.99,
        inventory: 18,
        sku: "BTS-BLK-001",
        requiresShipping: true,
        taxable: true,
        option1: "Black"
      },
      {
        id: "8-2",
        title: "White",
        price: 129.99,
        compareAtPrice: 169.99,
        inventory: 16,
        sku: "BTS-WHT-001",
        requiresShipping: true,
        taxable: true,
        option1: "White"
      }
    ],
    options: [
      {
        id: "8-color",
        name: "Color",
        position: 1,
        values: ["Black", "White"]
      }
    ],
    createdAt: new Date("2023-12-25"),
    updatedAt: new Date("2024-01-05")
  }
];

export const mockRecommendations: PricingRecommendation[] = [
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
    recommendedPrice: 159.99,
    confidence: 0.81,
    reasoning: "New product launch pricing strategy, premium positioning",
    expectedImpact: {
      revenueChange: 6.7,
      salesChange: -5.1,
      marginChange: 12.3
    },
    algorithm: "premium_positioning",
    createdAt: new Date()
  },
  {
    productId: "5",
    currentPrice: 89.99,
    recommendedPrice: 94.99,
    confidence: 0.76,
    reasoning: "Material cost increase, competitor analysis shows room for price adjustment",
    expectedImpact: {
      revenueChange: 5.6,
      salesChange: -2.8,
      marginChange: 7.9
    },
    algorithm: "cost_competitor_analysis",
    createdAt: new Date()
  },
  {
    productId: "6",
    currentPrice: 79.99,
    recommendedPrice: 74.99,
    confidence: 0.68,
    reasoning: "End of season clearance, prepare for new inventory",
    expectedImpact: {
      revenueChange: -6.3,
      salesChange: 22.1,
      marginChange: -1.8
    },
    algorithm: "seasonal_clearance",
    createdAt: new Date()
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get mock data by type with optional filtering
 */
export function getMockData<T>(dataType: 'topProducts' | 'weeklyData' | 'performanceMetrics' | 'recentReports' | 'products' | 'recommendations'): T[] {
  switch (dataType) {
    case 'topProducts':
      return mockTopProducts as T[];
    case 'weeklyData':
      return mockWeeklyData as T[];
    case 'performanceMetrics':
      return mockPerformanceMetrics as T[];
    case 'recentReports':
      return mockRecentReports as T[];
    case 'products':
      return mockProducts as T[];
    case 'recommendations':
      return mockRecommendations as T[];
    default:
      return [] as T[];
  }
}

/**
 * Get a specific mock product by ID
 */
export function getMockProduct(productId: string): Product | undefined {
  return mockProducts.find(product => product.id === productId);
}

/**
 * Get mock recommendations for a specific product
 */
export function getMockRecommendationsForProduct(productId: string): PricingRecommendation[] {
  return mockRecommendations.filter(rec => rec.productId === productId);
}

/**
 * Check if mock data should be used (development mode or API failure)
 */
export function shouldUseMockData(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
}
