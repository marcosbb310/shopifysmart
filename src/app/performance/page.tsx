import { AppLayout } from "@/features/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "@/shared/components";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  // DollarSign, // TODO: Use when implementing revenue indicators
  Target,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { mockPerformanceMetrics } from "@/shared/lib";

const topPerformingProducts = [
  {
    name: "Premium Wireless Headphones",
    revenue: "$24,580",
    unitsSold: 156,
    priceChange: "+10.0%",
    impact: "+$2,458"
  },
  {
    name: "Organic Cotton T-Shirt",
    revenue: "$8,420",
    unitsSold: 89,
    priceChange: "+16.7%",
    impact: "+$1,206"
  },
  {
    name: "Stainless Steel Water Bottle",
    revenue: "$4,890",
    unitsSold: 67,
    priceChange: "+12.0%",
    impact: "+$587"
  }
];

// TODO: Use revenueData when implementing revenue charts
// const revenueData = [
//   { month: "Jan", regular: 45000, smart: 52000 },
//   { month: "Feb", regular: 52000, smart: 61000 },
//   { month: "Mar", regular: 48000, smart: 58000 },
//   { month: "Apr", regular: 61000, smart: 72000 },
//   { month: "May", regular: 58000, smart: 69000 },
//   { month: "Jun", regular: 67000, smart: 81000 }
// ];

export default function PerformancePage() {
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your pricing performance and revenue impact
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockPerformanceMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="flex items-center space-x-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.change}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Revenue Comparison</span>
          </CardTitle>
          <CardDescription>
            Regular pricing vs Smart pricing revenue over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chart visualization would go here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Integration with chart library needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Top Performing Products</span>
          </CardTitle>
          <CardDescription>
            Products with highest revenue impact from smart pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.unitsSold} units sold
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {product.priceChange}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Price Change</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{product.impact}</p>
                    <p className="text-sm text-muted-foreground">Impact</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
