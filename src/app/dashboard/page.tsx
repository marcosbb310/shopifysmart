"use client";

import { memo } from "react";
import { AppLayout } from "@/features/navigation";
import { 
  RevenueSummary, 
  WeeklyPerformance, 
  TopProducts, 
  QuickActions 
} from "@/features/dashboard";
import { DashboardSkeleton } from "@/shared/components";
import { useInstantDashboard } from "@/shared/hooks";

function DashboardPageComponent() {
  // Use instant dashboard hook for fast loading
  const { data, loading: isLoading, error, refresh } = useInstantDashboard();

  if (isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Dashboard</h2>
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

  const dashboardData = data || {
    revenue: { regular: 800000, smart: 980000, percentageIncrease: 22.5 },
    weeklyPerformance: [],
    topProducts: []
  };

  return (
    <AppLayout>
      {/* Revenue and Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueSummary 
          regularRevenue={dashboardData.revenue.regular}
          smartRevenue={dashboardData.revenue.smart}
          percentageIncrease={dashboardData.revenue.percentageIncrease}
        />
        <WeeklyPerformance data={dashboardData.weeklyPerformance} />
      </div>
      
      {/* Top Products - TODO: Fetch real data from Shopify API */}
      <TopProducts products={dashboardData.topProducts} />

      {/* Quick Actions */}
      <QuickActions />
    </AppLayout>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(DashboardPageComponent);
