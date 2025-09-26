import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RevenueSummaryProps {
  regularRevenue: number;
  smartRevenue: number;
  percentageIncrease: number;
}

export function RevenueSummary({ regularRevenue, smartRevenue, percentageIncrease }: RevenueSummaryProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Revenue Growth
        </CardTitle>
        <CardDescription>
          Smart pricing vs regular pricing over the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Regular Pricing</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${regularRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Last 12 months</p>
              <p className="text-sm text-slate-500">Baseline</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Smart Pricing</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                ${smartRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Last 12 months</p>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                +{percentageIncrease}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
