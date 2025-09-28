import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/components/ui";
import { Target, Calendar, BarChart3 } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks to optimize your pricing strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Target className="w-6 h-6" />
            <span>Create Pricing Rule</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <Calendar className="w-6 h-6" />
            <span>Schedule Optimization</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <BarChart3 className="w-6 h-6" />
            <span>View Analytics</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
