"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Product, PricingRecommendation } from "../../pricing/types";
import { useState } from "react";

interface ProductListProps {
  products: Product[];
  recommendations?: PricingRecommendation[];
  onPriceUpdate: (productId: string, newPrice: number) => void;
  onBulkUpdate: (productIds: string[], priceChange: number, type: 'percentage' | 'fixed') => void;
  viewMode?: 'list' | 'grid';
}

export function ProductList({ products, recommendations = [], onPriceUpdate, onBulkUpdate, viewMode = 'list' }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [tagSortPriority, setTagSortPriority] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchTerm === "" || 
                           product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesTag = selectedTag === "all" || product.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      // If tag sort priority is set, sort by tag priority first
      if (tagSortPriority) {
        const aTagIndex = a.tags.indexOf(tagSortPriority);
        const bTagIndex = b.tags.indexOf(tagSortPriority);
        
        // Products with the tag come first
        if (aTagIndex !== -1 && bTagIndex === -1) return -1;
        if (aTagIndex === -1 && bTagIndex !== -1) return 1;
        
        // If both have the tag, sort by tag position (first tag = higher priority)
        if (aTagIndex !== -1 && bTagIndex !== -1) {
          if (aTagIndex !== bTagIndex) {
            return aTagIndex - bTagIndex;
          }
        }
        
        // If both don't have the tag, or same tag position, sort alphabetically
        return a.title.localeCompare(b.title);
      }
      
      // Default sorting
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "price":
          return a.currentPrice - b.currentPrice;
        case "inventory":
          return b.inventory - a.inventory;
        case "revenue":
          // This would need actual revenue data
          return 0;
        default:
          return 0;
      }
    });

  const getRecommendation = (productId: string) => {
    return recommendations.find(r => r.productId === productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-emerald-600 dark:text-emerald-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-slate-600 dark:text-slate-400";
  };

  const handleTagClick = (tag: string) => {
    // If clicking the same tag that's already active, clear it
    if (tagSortPriority === tag || selectedTag === tag) {
      clearActiveTag();
    } else {
      // Otherwise, set both sorting and filtering
      setTagSortPriority(tag);
      setSelectedTag(tag);
    }
  };

  const clearActiveTag = () => {
    setTagSortPriority(null);
    setSelectedTag("all");
  };


  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Products & Pricing
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your product catalog and optimize pricing strategies
          </p>
          {(tagSortPriority || selectedTag !== "all") && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Active tag: 
              </span>
              <Badge 
                variant="secondary" 
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              >
                {tagSortPriority || selectedTag}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearActiveTag}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="recommendations"
            checked={showRecommendations}
            onCheckedChange={setShowRecommendations}
          />
          <label htmlFor="recommendations" className="text-sm font-medium">
            Show AI Recommendations
          </label>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={(value) => {
              setSelectedTag(value);
              // When using dropdown, only filter (don't sort)
              if (value === "all") {
                setTagSortPriority(null);
              }
            }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {Array.from(new Set(products.flatMap(p => p.tags))).map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
        {filteredProducts.map((product) => {
          const recommendation = getRecommendation(product.id);
          const priceChange = recommendation 
            ? ((recommendation.recommendedPrice - product.currentPrice) / product.currentPrice) * 100
            : 0;

          if (viewMode === 'grid') {
            return (
              <Card key={product.id} className="border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Product Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                      <span className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {product.vendor}
                      </span>
                      <span>Stock: {product.inventory}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700">
                        {product.category}
                      </Badge>
                      {product.tags.slice(0, 2).map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className={`text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                            tagSortPriority === tag ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Current Price */}
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg mb-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Current Price</div>
                    <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {formatPrice(product.currentPrice)}
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  {showRecommendations && recommendation && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                          AI Recommendation
                        </h4>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs">
                          {Math.round(recommendation.confidence * 100)}%
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-emerald-700 dark:text-emerald-300">
                            Recommended:
                          </span>
                          <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                            {formatPrice(recommendation.recommendedPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-emerald-700 dark:text-emerald-300">
                            Impact:
                          </span>
                          <span className={`font-semibold text-sm ${getPriceChangeColor(priceChange)}`}>
                            {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {showRecommendations && recommendation && (
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => onPriceUpdate(product.id, recommendation.recommendedPrice)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Apply AI Price
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          }

          // List view (existing layout)
          return (
            <Card key={product.id} className="border-0 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {product.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            {product.vendor}
                          </span>
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700">
                            {product.category}
                          </Badge>
                          <span>Stock: {product.inventory}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {product.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className={`text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                              tagSortPriority === tag ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Current Pricing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Current Price</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {formatPrice(product.currentPrice)}
                        </div>
                      </div>
                      {product.costPrice && (
                        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                          <div className="text-sm text-slate-500 dark:text-slate-400">Cost Price</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {formatPrice(product.costPrice)}
                          </div>
                        </div>
                      )}
                      {product.compareAtPrice && (
                        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                          <div className="text-sm text-slate-500 dark:text-slate-400">Compare At</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {formatPrice(product.compareAtPrice)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Smart Pricing Controls */}
                  <div className="lg:w-80 space-y-4">
                    {showRecommendations && recommendation && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                            AI Recommendation
                          </h4>
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                            {Math.round(recommendation.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">
                              Recommended Price:
                            </span>
                            <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                              {formatPrice(recommendation.recommendedPrice)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">
                              Expected Impact:
                            </span>
                            <span className={`font-semibold ${getPriceChangeColor(priceChange)}`}>
                              {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {recommendation.reasoning}
                          </p>
                        </div>
                      </div>
                    )}


                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {showRecommendations && recommendation && (
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => onPriceUpdate(product.id, recommendation.recommendedPrice)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Apply AI Price
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Advanced
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
