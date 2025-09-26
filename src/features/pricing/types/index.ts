// Core pricing types for the pricing optimization feature

export interface Product {
  id: string;
  title: string;
  handle: string;
  currentPrice: number;
  costPrice?: number;
  compareAtPrice?: number;
  inventory: number;
  category: string;
  tags: string[];
  vendor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingRule {
  id: string;
  name: string;
  description: string;
  type: PricingRuleType;
  conditions: PricingCondition[];
  actions: PricingAction[];
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PricingRuleType = 
  | 'demand_based'
  | 'competitor_based'
  | 'inventory_based'
  | 'seasonal'
  | 'custom';

export interface PricingCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: string | number | boolean;
  value2?: string | number | boolean; // For 'between' operator
}

export interface PricingAction {
  type: 'adjust_percentage' | 'adjust_fixed' | 'set_price' | 'min_price' | 'max_price';
  value: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PricingRecommendation {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  confidence: number; // 0-1
  reasoning: string;
  expectedImpact: {
    revenueChange: number;
    salesChange: number;
    marginChange: number;
  };
  algorithm: string;
  createdAt: Date;
}

export interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  parameters: Record<string, string | number | boolean>;
  isActive: boolean;
  performance: {
    totalRevenue: number;
    revenueIncrease: number;
    productsOptimized: number;
    averageConfidence: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketData {
  productId: string;
  competitorPrices: CompetitorPrice[];
  marketTrend: 'increasing' | 'decreasing' | 'stable';
  demandLevel: 'low' | 'medium' | 'high';
  seasonality: number; // 0-1 multiplier
  lastUpdated: Date;
}

export interface CompetitorPrice {
  competitor: string;
  price: number;
  url?: string;
  lastChecked: Date;
}

export interface PricingAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalRevenue: number;
    revenueChange: number;
    averagePrice: number;
    priceChange: number;
    productsOptimized: number;
    recommendationsApplied: number;
    averageConfidence: number;
  };
  topPerformers: {
    productId: string;
    revenueIncrease: number;
    priceChange: number;
  }[];
  underperformers: {
    productId: string;
    revenueDecrease: number;
    priceChange: number;
  }[];
}

export interface PricingCalculationInput {
  product: Product;
  marketData?: MarketData;
  strategy: PricingStrategy;
  rules: PricingRule[];
  constraints: {
    minPrice?: number;
    maxPrice?: number;
    minMargin?: number;
    maxChange?: number; // Max percentage change
  };
}

export interface PricingCalculationResult {
  recommendedPrice: number;
  confidence: number;
  reasoning: string;
  factors: {
    demand: number;
    competition: number;
    inventory: number;
    seasonality: number;
    margin: number;
  };
  warnings: string[];
  alternatives: {
    price: number;
    confidence: number;
    reasoning: string;
  }[];
}
