"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Save, 
  RefreshCw, 
  AlertCircle, 
  Package, 
  DollarSign,
  Tag,
  Warehouse,
  Weight,
  Info
} from "lucide-react";
import { ShopifyProduct, ShopifyVariant } from "@/shared/types";

// Validation schemas
const productEditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body_html: z.string().optional(),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['active', 'archived', 'draft']),
  variants: z.array(z.object({
    id: z.number(),
    title: z.string(),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    compare_at_price: z.string().optional().refine(
      (val) => !val || /^\d+(\.\d{1,2})?$/.test(val), 
      "Invalid compare price format"
    ),
    inventory_quantity: z.number().min(0, "Inventory cannot be negative"),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    weight: z.number().min(0, "Weight cannot be negative").optional(),
    weight_unit: z.string().optional(),
    requires_shipping: z.boolean(),
    taxable: z.boolean(),
  }))
});

type ProductEditFormData = z.infer<typeof productEditSchema>;

interface ProductEditFormProps {
  product: ShopifyProduct;
  onSave: (data: ProductEditFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProductEditForm({ product, onSave, isLoading = false }: ProductEditFormProps) {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: product.title,
      body_html: product.body_html || "",
      vendor: product.vendor,
      product_type: product.product_type || "",
      tags: product.tags,
      status: product.status,
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        compare_at_price: variant.compare_at_price || "",
        inventory_quantity: variant.inventory_quantity,
        sku: variant.sku || "",
        barcode: variant.barcode || "",
        weight: variant.weight || 0,
        weight_unit: variant.weight_unit,
        requires_shipping: variant.requires_shipping,
        taxable: variant.taxable,
      }))
    }
  });

  const { fields: variantFields } = useFieldArray({
    control,
    name: "variants"
  });

  // Watch for changes
  const watchedValues = watch();
  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty, watchedValues]);

  const handleFormSubmit = async (data: ProductEditFormData) => {
    try {
      setSaving(true);
      await onSave(data);
      setHasChanges(false);
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    reset();
    setHasChanges(false);
    toast.info("Changes have been reset");
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return isNaN(num) ? "$0.00" : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(watchedValues.status)}>
            {watchedValues.status}
          </Badge>
          {hasChanges && (
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || saving || isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            type="submit"
            disabled={!hasChanges || saving || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                {...register("title")}
                disabled={saving || isLoading}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                {...register("vendor")}
                disabled={saving || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type">Product Type</Label>
              <Input
                id="product_type"
                {...register("product_type")}
                disabled={saving || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={saving || isLoading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="e.g. summer, cotton, sale"
              disabled={saving || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body_html">Description</Label>
            <Textarea
              id="body_html"
              {...register("body_html")}
              rows={4}
              disabled={saving || isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Variants ({variantFields.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {variantFields.map((variant, index) => (
              <div key={variant.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium">{variant.title}</h4>
                  <Badge variant="outline">ID: {variant.id}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Price *
                    </Label>
                    <Input
                      {...register(`variants.${index}.price`)}
                      disabled={saving || isLoading}
                      className={errors.variants?.[index]?.price ? "border-red-500" : ""}
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.variants?.[index]?.price?.message}
                      </p>
                    )}
                    <p className="text-sm text-slate-500">
                      Display: {formatPrice(watchedValues.variants[index]?.price || "0")}
                    </p>
                  </div>

                  {/* Compare At Price */}
                  <div className="space-y-2">
                    <Label>Compare At Price</Label>
                    <Input
                      {...register(`variants.${index}.compare_at_price`)}
                      disabled={saving || isLoading}
                      placeholder="0.00"
                    />
                    {watchedValues.variants[index]?.compare_at_price && (
                      <p className="text-sm text-slate-500">
                        Display: {formatPrice(watchedValues.variants[index]?.compare_at_price || "0")}
                      </p>
                    )}
                  </div>

                  {/* Inventory */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Warehouse className="w-4 h-4 mr-1" />
                      Inventory
                    </Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.inventory_quantity`, { valueAsNumber: true })}
                      disabled={saving || isLoading}
                      className={errors.variants?.[index]?.inventory_quantity ? "border-red-500" : ""}
                    />
                    {errors.variants?.[index]?.inventory_quantity && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.variants?.[index]?.inventory_quantity?.message}
                      </p>
                    )}
                  </div>

                  {/* SKU */}
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      {...register(`variants.${index}.sku`)}
                      disabled={saving || isLoading}
                      placeholder="Optional"
                    />
                  </div>

                  {/* Barcode */}
                  <div className="space-y-2">
                    <Label>Barcode</Label>
                    <Input
                      {...register(`variants.${index}.barcode`)}
                      disabled={saving || isLoading}
                      placeholder="Optional"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Weight className="w-4 h-4 mr-1" />
                      Weight
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.weight`, { valueAsNumber: true })}
                        disabled={saving || isLoading}
                        placeholder="0"
                        className="flex-1"
                      />
                      <Select 
                        value={watchedValues.variants[index]?.weight_unit || "lb"}
                        onValueChange={(value) => {
                          // This would need custom handling for updating the weight_unit
                          // For now, it's read-only
                        }}
                        disabled={true}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lb">lb</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Boolean Options */}
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name={`variants.${index}.requires_shipping`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={saving || isLoading}
                        />
                      )}
                    />
                    <Label>Requires Shipping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name={`variants.${index}.taxable`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={saving || isLoading}
                        />
                      )}
                    />
                    <Label>Taxable</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>Changes will be reflected immediately in your Shopify store</li>
                <li>Price changes may affect ongoing promotions and discounts</li>
                <li>Inventory updates will sync across all sales channels</li>
                <li>Always review changes before saving</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
