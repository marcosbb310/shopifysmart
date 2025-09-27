"use client";

import { AppLayout } from "@/features/navigation";
import { 
  RevenueSummary, 
  WeeklyPerformance, 
  TopProducts, 
  QuickActions 
} from "@/features/dashboard";

// Mock data for demonstration
const topProducts = [
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

const weeklyData = [
  { day: "Mon", regular: 12000, smart: 12500 },
  { day: "Tue", regular: 11500, smart: 12000 },
  { day: "Wed", regular: 13000, smart: 13500 },
  { day: "Thu", regular: 12500, smart: 13000 },
  { day: "Fri", regular: 14000, smart: 15000 },
  { day: "Sat", regular: 16000, smart: 18000 },
  { day: "Sun", regular: 15000, smart: 17000 }
];

export default function DashboardPage() {
  return (
    <AppLayout>
      {/* Revenue and Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueSummary 
          regularRevenue={800000}
          smartRevenue={980000}
          percentageIncrease={22.5}
        />
        <WeeklyPerformance data={weeklyData} />
      </div>

      {/* Top Products */}
      <TopProducts products={topProducts} />

      {/* Quick Actions */}
      <QuickActions />
    </AppLayout>
  );
}
