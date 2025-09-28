"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/features/navigation";
import { ProductEditForm } from "@/features/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components";
import { Button } from "@/shared/components";
import { Skeleton } from "@/shared/components";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components";
import { 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  ExternalLink,
  Package
} from "lucide-react";
import { ShopifyProduct } from "@/shared/types";
import { toast } from "sonner";

interface ProductEditFormData {
  title: string;
  body_html?: string | undefined;
  vendor?: string | undefined;
  product_type?: string | undefined;
  tags?: string | undefined;
  status: 'active' | 'archived' | 'draft';
  variants: Array<{
    id: number;
    title: string;
    price: string;
    compare_at_price?: string | undefined;
    inventory_quantity: number;
    sku?: string | undefined;
    barcode?: string | undefined;
    weight?: number | undefined;
    weight_unit?: string | undefined;
    requires_shipping: boolean;
    taxable: boolean;
  }>;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/shopify/products/${productId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch product');
      }
      
      setProduct(data.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: ProductEditFormData) => {
    try {
      const updateData = {
        product: {
          title: formData.title,
          body_html: formData.body_html && formData.body_html.trim() !== '' ? formData.body_html : undefined,
          vendor: formData.vendor && formData.vendor.trim() !== '' ? formData.vendor : undefined,
          product_type: formData.product_type && formData.product_type.trim() !== '' ? formData.product_type : undefined,
          tags: formData.tags && formData.tags.trim() !== '' ? formData.tags : undefined,
          status: formData.status,
        },
        variants: formData.variants.map(variant => ({
          id: variant.id,
          price: variant.price,
          compare_at_price: variant.compare_at_price && variant.compare_at_price.trim() !== '' ? variant.compare_at_price : undefined,
          inventory_quantity: variant.inventory_quantity,
          sku: variant.sku && variant.sku.trim() !== '' ? variant.sku : undefined,
          barcode: variant.barcode && variant.barcode.trim() !== '' ? variant.barcode : undefined,
          weight: variant.weight || undefined,
          weight_unit: variant.weight_unit,
          requires_shipping: variant.requires_shipping,
          taxable: variant.taxable,
        }))
      };

      const response = await fetch(`/api/shopify/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (!result.success) {
        console.error('API Error:', result);
        if (result.details && Array.isArray(result.details)) {
          const errorMessages = result.details.map((detail: { path: string; message: string }) => 
            `${detail.path}: ${detail.message}`
          ).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        }
        throw new Error(result.message || 'Failed to update product');
      }

      // Update local state with the response data
      if (result.data.product) {
        setProduct(result.data.product);
      }

      toast.success('Product updated successfully!');
      
    } catch (error) {
      console.error('Error saving product:', error);
      const message = error instanceof Error ? error.message : 'Failed to save product';
      toast.error(message);
      throw error; // Re-throw so the form can handle the error state
    }
  };

  const handleBack = () => {
    router.push('/products');
  };

  const handleViewInStore = () => {
    if (product) {
      const storeUrl = `https://1t0yf8-7e.myshopify.com/products/${product.handle}`;
      window.open(storeUrl, '_blank');
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                  <Skeleton className="h-24" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !product) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Product</AlertTitle>
            <AlertDescription>
              {error || 'Product not found'}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 flex space-x-2">
            <Button onClick={fetchProduct} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
              
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Product ID: {product.id}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleViewInStore}
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View in Store
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Edit Product
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Make changes to your product and variants. Changes will be reflected immediately in your Shopify store.
            </p>
          </div>
        </div>

        {/* Product Form */}
        <ProductEditForm
          product={product}
          onSave={handleSave}
          isLoading={loading}
        />
        
        {/* Quick Stats */}
        <Card className="mt-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm text-slate-600 dark:text-slate-400">
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-500 dark:text-slate-400">Variants</div>
                <div className="font-medium">{product.variants.length}</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Total Inventory</div>
                <div className="font-medium">
                  {product.variants.reduce((sum, v) => sum + v.inventory_quantity, 0)}
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Price Range</div>
                <div className="font-medium">
                  ${Math.min(...product.variants.map(v => parseFloat(v.price))).toFixed(2)} - 
                  ${Math.max(...product.variants.map(v => parseFloat(v.price))).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">Last Updated</div>
                <div className="font-medium">
                  {new Date(product.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}