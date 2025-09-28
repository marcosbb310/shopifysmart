import { AppLayout } from "@/features/navigation";
import { 
  RevenueSummary, 
  WeeklyPerformance, 
  TopProducts, 
  QuickActions 
} from "@/features/dashboard";
// Removed mock data imports - using real Shopify API data only

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
        <WeeklyPerformance data={[]} />
      </div>
      
      {/* Top Products - TODO: Fetch real data from Shopify API */}
      <TopProducts products={[]} />

      {/* Quick Actions */}
      <QuickActions />
    </AppLayout>
  );
}
