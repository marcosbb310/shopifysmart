"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Package,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

interface BulkActionsProps {
  selectedProducts: string[];
  onBulkPriceUpdate: (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => void;
  onBulkApplyRecommendations: (productIds: string[]) => void;
  onClearSelection: () => void;
}

export function BulkActions({ 
  selectedProducts, 
  onBulkPriceUpdate, 
  onBulkApplyRecommendations,
  onClearSelection 
}: BulkActionsProps) {
  const [priceChange, setPriceChange] = useState(0);
  const [changeType, setChangeType] = useState<'percentage' | 'fixed'>('percentage');
  const [fixedPrice, setFixedPrice] = useState(0);

  const handleApplyPriceChange = () => {
    if (changeType === 'percentage') {
      onBulkPriceUpdate(selectedProducts, priceChange, 'percentage');
    } else {
      onBulkPriceUpdate(selectedProducts, fixedPrice, 'fixed');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Bulk Actions
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Clear Selection
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div>
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
            Quick Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
              onClick={() => onBulkApplyRecommendations(selectedProducts)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply AI Recommendations
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
              onClick={() => {
                setPriceChange(5);
                setChangeType('percentage');
                handleApplyPriceChange();
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              +5% Price Increase
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
              onClick={() => {
                setPriceChange(-5);
                setChangeType('percentage');
                handleApplyPriceChange();
              }}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              -5% Price Decrease
            </Button>
          </div>
        </div>

        {/* Custom Price Adjustment */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-green-900 dark:text-green-100">
              Custom Price Adjustment
            </h4>
            <Select value={changeType} onValueChange={(value: 'percentage' | 'fixed') => setChangeType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="fixed">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {changeType === 'percentage' ? (
              <div className="space-y-2">
                <Slider
                  value={[priceChange]}
                  onValueChange={(value) => setPriceChange(value[0])}
                  min={-50}
                  max={50}
                  step={1}
                  className="w-full"
                />
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>-50%</span>
                  <span className="font-medium">{priceChange}%</span>
                  <span>+50%</span>
                </div>
              </div>
            ) : (
              <Input
                type="number"
                placeholder="0.00"
                value={fixedPrice}
                onChange={(e) => setFixedPrice(Number(e.target.value))}
                className="w-full"
              />
            )}

            <Button
              onClick={handleApplyPriceChange}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Apply {changeType === 'percentage' ? `${priceChange}%` : formatPrice(fixedPrice)} Change
            </Button>
          </div>
        </div>

        {/* Impact Preview */}
        <div className="bg-white/50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Impact Preview
          </h4>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <p>• {selectedProducts.length} products will be updated</p>
            <p>• Changes will be applied immediately</p>
            <p>• You can undo changes within 24 hours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
