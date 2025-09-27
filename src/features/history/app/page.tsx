"use client";

import { AppLayout } from "@/features/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  Filter,
  Download,
  Search,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mock data for demonstration
const recentReports = [
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

const reportCategories = [
  { name: "All Reports", count: 24, active: true },
  { name: "Performance", count: 8, active: false },
  { name: "Optimization", count: 6, active: false },
  { name: "Analysis", count: 5, active: false },
  { name: "Summary", count: 5, active: false }
];

export default function HistoryPage() {
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">History & Reports</h1>
          <p className="text-muted-foreground mt-2">
            View detailed performance reports and historical data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Report Categories */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Report Categories</CardTitle>
            <CardDescription>Filter reports by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={category.active ? "default" : "ghost"}
                  className="w-full justify-between"
                  size="sm"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Reports List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Reports</span>
                </div>
                <p className="text-2xl font-bold mt-2">24</p>
                <p className="text-xs text-muted-foreground">Generated this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Revenue Impact</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-green-600">+$45,380</p>
                <p className="text-xs text-muted-foreground">From smart pricing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <p className="text-2xl font-bold mt-2">94%</p>
                <p className="text-xs text-muted-foreground">Positive impact</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Reports</span>
              </CardTitle>
              <CardDescription>
                Latest performance reports and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {report.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {report.date}
                          </span>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <p className="text-sm font-medium text-green-600">{report.metrics.revenue}</p>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{report.metrics.orders}</p>
                            <p className="text-xs text-muted-foreground">Orders</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-green-600">{report.metrics.conversion}</p>
                            <p className="text-xs text-muted-foreground">Conversion</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
