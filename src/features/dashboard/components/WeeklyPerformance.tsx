import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyData {
  day: string;
  regular: number;
  smart: number;
}

interface WeeklyPerformanceProps {
  data: WeeklyData[];
}

export function WeeklyPerformance({ data }: WeeklyPerformanceProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Weekly Performance
        </CardTitle>
        <CardDescription>
          Daily revenue comparison for the current week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((day, index) => (
            <div key={day.day} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {day.day}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    ${day.regular.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Regular</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  ${day.smart.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-500">
                  Smart (+{Math.round(((day.smart - day.regular) / day.regular) * 100)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
