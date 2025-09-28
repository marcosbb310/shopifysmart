import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient, ShopifyApiError } from '@/shared/lib';
import { z } from 'zod';

// Validation schemas
const updateProductSchema = z.object({
  title: z.string().optional(),
  body_html: z.string().optional(),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
});

const updateVariantSchema = z.object({
  id: z.number(),
  price: z.string().optional(),
  compare_at_price: z.string().optional(),
  inventory_quantity: z.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  weight_unit: z.string().optional(),
  requires_shipping: z.boolean().optional(),
  taxable: z.boolean().optional(),
});

const updateProductRequestSchema = z.object({
  product: updateProductSchema.optional(),
  variants: z.array(updateVariantSchema).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing product ID',
          message: 'Product ID is required'
        },
        { status: 400 }
      );
    }

    const shopifyClient = createShopifyClient();
    
    // Get single product
    const response = await shopifyClient.getProducts({ ids: productId });
    
    if (response.products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: `Product with ID ${productId} not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.products[0],
      message: 'Product retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching product:', error);

    if (error instanceof ShopifyApiError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Shopify API Error',
          message: error.message,
          status: error.status,
          errors: error.errors
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing product ID',
          message: 'Product ID is required'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = updateProductRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation failed:', JSON.stringify(validationResult.error.issues, null, 2));
      console.error('Request body:', JSON.stringify(body, null, 2));
      
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid request data',
          details: validationResult.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
            ...(('received' in issue) && { received: (issue as { received: unknown }).received })
          }))
        },
        { status: 400 }
      );
    }

    const { product, variants } = validationResult.data;
    const shopifyClient = createShopifyClient();
    
    const results: {
      product?: unknown;
      variants?: unknown[];
    } = {};

    // Update product if provided
    if (product) {
      // Filter out undefined values to satisfy exactOptionalPropertyTypes
      const cleanProduct = Object.fromEntries(
        Object.entries(product).filter(([_, value]) => value !== undefined)
      );
      
      const productUpdateResponse = await shopifyClient.updateProduct(
        parseInt(productId),
        cleanProduct
      );
      results.product = productUpdateResponse.product;
    }

    // Update variants if provided
    if (variants && variants.length > 0) {
      results.variants = [];
      
      for (const variant of variants) {
        // Filter out undefined values to satisfy exactOptionalPropertyTypes
        const cleanVariant = Object.fromEntries(
          Object.entries(variant).filter(([_, value]) => value !== undefined)
        );
        
        const variantUpdateResponse = await shopifyClient.updateVariant(
          variant.id,
          cleanVariant
        );
        results.variants.push(variantUpdateResponse.variant);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);

    if (error instanceof ShopifyApiError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Shopify API Error',
          message: error.message,
          status: error.status,
          errors: error.errors
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
