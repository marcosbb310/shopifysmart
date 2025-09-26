"use client";

import { useState } from "react";
import { ProductList } from "./ProductList";
import { ProductFilters } from "./ProductFilters";
import { BulkActions } from "./BulkActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Filter, 
  Grid, 
  List, 
  Download,
  Upload,
  Settings
} from "lucide-react";
import { Product, PricingRecommendation } from "../../pricing/types";

interface ProductsLayoutProps {
  products: Product[];
  recommendations?: PricingRecommendation[];
  onPriceUpdate: (productId: string, newPrice: number) => void;
  onBulkUpdate: (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => void;
  onBulkApplyRecommendations: (productIds: string[]) => void;
}

export function ProductsLayout({ 
  products, 
  recommendations = [], 
  onPriceUpdate, 
  onBulkUpdate,
  onBulkApplyRecommendations 
}: ProductsLayoutProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
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
    const matchesRecommendations = !showRecommendations || recommendations.some(r => r.productId === product.id);
    
    return matchesCategory && matchesTags && matchesPrice && matchesInventory && matchesLowStock && matchesRecommendations;
  });

  const handleProductSelection = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

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
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Products & Pricing
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your product catalog and optimize pricing with AI-powered recommendations
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
              {filteredProducts.length} products
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
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
            <div className="flex items-center space-x-3">
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
              onBulkUpdate={onBulkUpdate}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
