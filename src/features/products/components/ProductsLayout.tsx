"use client";

import { useState } from "react";
import { ProductList } from "./ProductList";
import { ProductFilters } from "./ProductFilters";
import { BulkActions } from "./BulkActions";
import { Button, Badge, Switch, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { 
  Filter, 
  Grid, 
  List, 
  Download,
  Upload,
  Settings,
  Zap
} from "lucide-react";
import { Product, PricingRecommendation } from "../../pricing/types";

interface ProductsLayoutProps {
  products: Product[];
  recommendations?: PricingRecommendation[];
  globalSmartPricing: boolean;
  onPriceUpdate: (productId: string, newPrice: number) => void;
  onCostUpdate: (productId: string, newCost: number) => void;
  onBasePriceUpdate: (productId: string, newBasePrice: number) => void;
  onMaxPriceUpdate: (productId: string, newMaxPrice: number) => void;
  onSmartPricingToggle: (productId: string, enabled: boolean) => void;
  onGlobalSmartPricingToggle: (enabled: boolean) => void;
  onBulkUpdate: (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => void;
  onBulkPricingUpdate: (field: string, type: 'percentage' | 'fixed', value: number) => void;
  onBulkApplyRecommendations: (productIds: string[]) => void;
  isUpdating?: boolean;
}

export function ProductsLayout({ 
  products, 
  recommendations = [], 
  globalSmartPricing,
  onPriceUpdate, 
  onCostUpdate,
  onBasePriceUpdate,
  onMaxPriceUpdate,
  onSmartPricingToggle,
  onGlobalSmartPricingToggle,
  onBulkUpdate,
  onBulkPricingUpdate,
  onBulkApplyRecommendations,
  isUpdating = false
}: ProductsLayoutProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [inventoryRange, setInventoryRange] = useState<[number, number]>([0, 1000]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Get unique categories and tags
  const categories = Array.from(new Set(products.map(p => p.category)));
  const tags = Array.from(new Set(products.flatMap(p => p.tags)));

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
    const matchesPrice = product.currentPrice >= priceRange[0] && product.currentPrice <= priceRange[1];
    const matchesInventory = product.inventory >= inventoryRange[0] && product.inventory <= inventoryRange[1];
    const matchesLowStock = !showLowStock || product.inventory < 50;
    // Temporarily disable recommendations filter to show all products
    const matchesRecommendations = true;
    
    // Debug logging
    if (product.title === 'mugg') {
      console.log('Mugg product filtering:', {
        title: product.title,
        currentPrice: product.currentPrice,
        priceRange,
        matchesPrice,
        matchesCategory,
        matchesTags,
        matchesInventory,
        matchesLowStock,
        matchesRecommendations,
        finalMatch: matchesCategory && matchesTags && matchesPrice && matchesInventory && matchesLowStock && matchesRecommendations
      });
    }
    
    return matchesCategory && matchesTags && matchesPrice && matchesInventory && matchesLowStock && matchesRecommendations;
  });

  // Debug: Log product counts
  console.log('ProductsLayout - Total products:', products.length);
  console.log('ProductsLayout - Filtered products:', filteredProducts.length);
  console.log('ProductsLayout - Product titles:', products.map(p => p.title));

  // TODO: Use handleProductSelection when implementing product selection
  // const handleProductSelection = (productId: string, selected: boolean) => {
  //   if (selected) {
  //     setSelectedProducts(prev => [...prev, productId]);
  //   } else {
  //     setSelectedProducts(prev => prev.filter(id => id !== productId));
  //   }
  // };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange([0, 1000]);
    setInventoryRange([0, 1000]);
    setShowLowStock(false);
    setShowRecommendations(true);
  };

  const handleBulkPriceUpdate = (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => {
    onBulkUpdate(productIds, priceChange, type);
    setSelectedProducts([]);
  };

  const handleBulkApplyRecommendations = (productIds: string[]) => {
    onBulkApplyRecommendations(productIds);
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Products & Pricing
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Manage your product catalog and optimize pricing with AI-powered recommendations
            </p>
          </div>
          
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-xs">
              {filteredProducts.length} products
            </Badge>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Smart Pricing
              </span>
              <Switch
                checked={globalSmartPricing}
                onCheckedChange={onGlobalSmartPricingToggle}
                className="data-[state=checked]:bg-emerald-600"
                disabled={isUpdating}
              />
            </div>
            {isUpdating && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200 animate-pulse">
                Syncing to Shopify...
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <ProductFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                  tags={tags}
                  selectedTags={selectedTags}
                  onTagChange={setSelectedTags}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  inventoryRange={inventoryRange}
                  onInventoryRangeChange={setInventoryRange}
                  showLowStock={showLowStock}
                  onLowStockChange={setShowLowStock}
                  showRecommendations={showRecommendations}
                  onRecommendationsChange={setShowRecommendations}
                  onClearFilters={handleClearFilters}
                />
              </PopoverContent>
            </Popover>
          </div>

          {filteredProducts.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedProducts.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200">
                  {selectedProducts.length} selected
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mb-6">
            <BulkActions
              selectedProducts={selectedProducts}
              onBulkPriceUpdate={handleBulkPriceUpdate}
              onBulkPricingUpdate={onBulkPricingUpdate}
              onBulkApplyRecommendations={handleBulkApplyRecommendations}
              onClearSelection={() => setSelectedProducts([])}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Products List */}
          <div className="flex-1">
            <ProductList
              products={filteredProducts}
              recommendations={recommendations}
              onPriceUpdate={onPriceUpdate}
              onCostUpdate={onCostUpdate}
              onBasePriceUpdate={onBasePriceUpdate}
              onMaxPriceUpdate={onMaxPriceUpdate}
              onSmartPricingToggle={onSmartPricingToggle}
              onBulkUpdate={onBulkUpdate}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
