import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { BarChart3 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  smartPrice: number;
  sales: number;
  revenue: number;
  priceChange: number;
  category: string;
}

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Top Performing Products
        </CardTitle>
        <CardDescription>
          Your best-selling products with smart pricing optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {product.category} • {product.sales} sales
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500 line-through">
                      ${product.currentPrice}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      ${product.smartPrice}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    +{product.priceChange}%
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    ${product.revenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500">revenue</p>
                </div>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
