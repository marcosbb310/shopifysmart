"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Calculator,
  Banknote,
  Coins,
  CreditCard,
  Receipt
} from "lucide-react";
import { useState } from "react";

interface BulkActionsProps {
  selectedProducts: string[];
  onBulkPriceUpdate: (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => void;
  onBulkPricingUpdate: (field: string, type: 'percentage' | 'fixed', value: number) => void;
  onBulkApplyRecommendations: (productIds: string[]) => void;
  onClearSelection: () => void;
}

export function BulkActions({ 
  selectedProducts, 
  onBulkPriceUpdate: _onBulkPriceUpdate, 
  onBulkPricingUpdate,
  onBulkApplyRecommendations,
  onClearSelection 
}: BulkActionsProps) {
  const [priceChange, setPriceChange] = useState(0);
  const [changeType, setChangeType] = useState<'percentage' | 'fixed'>('percentage');
  const [fixedPrice, setFixedPrice] = useState(0);
  const [selectedField, setSelectedField] = useState('currentPrice');

  const pricingFields = [
    { value: 'currentPrice', label: 'Current Price', icon: Banknote },
    { value: 'basePrice', label: 'Base Price', icon: DollarSign },
    { value: 'maxPrice', label: 'Max Price', icon: Coins },
    { value: 'costPrice', label: 'Cost Price', icon: CreditCard },
  ];

  const handleApplyPriceChange = () => {
    const value = changeType === 'percentage' ? priceChange : fixedPrice;
    onBulkPricingUpdate(selectedField, changeType, value);
  };

  // TODO: Use formatPrice when implementing price display
  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD'
  //   }).format(price);
  // };

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
              Bulk Actions
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            Clear Selection
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
              Quick Actions
            </h4>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 text-xs px-2 py-1 h-7"
              onClick={() => onBulkApplyRecommendations(selectedProducts)}
            >
              <CheckCircle className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
              AI Apply
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 text-xs px-2 py-1 h-7"
              onClick={() => {
                setPriceChange(5);
                setChangeType('percentage');
                handleApplyPriceChange();
              }}
            >
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
              +5%
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 text-xs px-2 py-1 h-7"
              onClick={() => {
                setPriceChange(-5);
                setChangeType('percentage');
                handleApplyPriceChange();
              }}
            >
              <TrendingDown className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
              -5%
            </Button>
          </div>
        </div>

        {/* Custom Price Adjustment */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
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
          
          {/* Compact Layout */}
          <div className="flex items-end space-x-3">
            {/* Field Selection */}
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Field
              </label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pricingFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <SelectItem key={field.value} value={field.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{field.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Value Input */}
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                {changeType === 'percentage' ? 'Percentage' : 'Amount'}
              </label>
              {changeType === 'percentage' ? (
                <Input
                  type="number"
                  placeholder="0"
                  value={priceChange === 0 ? '' : priceChange}
                  onChange={(e) => setPriceChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full"
                  min={-100}
                  max={100}
                  step={0.1}
                />
              ) : (
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fixedPrice === 0 ? '' : fixedPrice}
                  onChange={(e) => setFixedPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full"
                  step={0.01}
                />
              )}
            </div>

            {/* Apply Button */}
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Action
              </label>
              <Button
                onClick={handleApplyPriceChange}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Impact Preview */}
        <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            Impact Preview
          </h4>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p>• {selectedProducts.length} products will be updated</p>
            <p>• Changes will be applied immediately</p>
            <p>• You can undo changes within 24 hours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
