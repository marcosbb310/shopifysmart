import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Slider, Checkbox } from "@/components/ui";
import { 
  Filter, 
  X, 
  Package,
  Tag,
  SlidersHorizontal
} from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  tags: string[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  inventoryRange: [number, number];
  onInventoryRangeChange: (range: [number, number]) => void;
  showLowStock: boolean;
  onLowStockChange: (show: boolean) => void;
  showRecommendations: boolean;
  onRecommendationsChange: (show: boolean) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  categories: _categories,
  selectedCategories: _selectedCategories,
  onCategoryChange: _onCategoryChange,
  tags,
  selectedTags,
  onTagChange,
  priceRange,
  onPriceRangeChange,
  inventoryRange,
  onInventoryRangeChange,
  showLowStock,
  onLowStockChange,
  showRecommendations,
  onRecommendationsChange,
  onClearFilters
}: ProductFiltersProps) {
  // TODO: Use handleCategoryToggle when implementing category filtering
  // const handleCategoryToggle = (category: string) => {
  //   if (selectedCategories.includes(category)) {
  //     onCategoryChange(selectedCategories.filter(c => c !== category));
  //   } else {
  //     onCategoryChange([...selectedCategories, category]);
  //   }
  // };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tags */}
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Tags
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {tags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <label
                  htmlFor={tag}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Price Range
          </h4>
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Inventory Range */}
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Inventory
          </h4>
          <div className="space-y-3">
            <Slider
              value={inventoryRange}
              onValueChange={(value) => onInventoryRangeChange([value[0], value[1]])}
              min={0}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{inventoryRange[0]} units</span>
              <span>{inventoryRange[1]} units</span>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
            Quick Filters
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="low-stock"
                checked={showLowStock}
                onCheckedChange={onLowStockChange}
              />
              <label
                htmlFor="low-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Low Stock Only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                checked={showRecommendations}
                onCheckedChange={onRecommendationsChange}
              />
              <label
                htmlFor="recommendations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Has AI Recommendations
              </label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedTags.length > 0 || showLowStock || showRecommendations) && (
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {showLowStock && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  Low Stock
                  <button
                    onClick={() => onLowStockChange(false)}
                    className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {showRecommendations && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  AI Recommendations
                  <button
                    onClick={() => onRecommendationsChange(false)}
                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
