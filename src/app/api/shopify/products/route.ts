import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient, ShopifyApiError, validateEnv } from '@/shared/lib';

// GET - Fetch products
export async function GET(_request: NextRequest) {
  try {
    console.log('GET /api/shopify/products - Starting request');
    
    // Validate environment variables
    try {
      console.log('Validating environment variables...');
      validateEnv();
      console.log('✅ Environment validation passed');
    } catch (error) {
      console.error('❌ Environment validation failed:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Environment configuration error. Please check your environment variables.' 
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(_request.url);
    
    // Parse query parameters with optimized defaults
    const params: Record<string, string | number> = {
      limit: parseInt(searchParams.get('limit') || '50', 10), // Default to 50 for faster loading
      fields: searchParams.get('fields') || 'id,title,handle,variants,options,product_type,vendor,tags,image,created_at,updated_at', // Only fetch essential fields
    };
    
    if (searchParams.get('since_id')) {
      params.since_id = parseInt(searchParams.get('since_id')!, 10);
    }
    if (searchParams.get('vendor')) {
      params.vendor = searchParams.get('vendor')!;
    }
    if (searchParams.get('product_type')) {
      params.product_type = searchParams.get('product_type')!;
    }

    console.log('Fetching products with optimized params:', params);
    
    // Initialize Shopify API
    console.log('Creating Shopify client...');
    const shopify = createShopifyClient();
    console.log('✅ Shopify client created');
    
    // Use fast single-page fetch instead of getAllProducts for better performance
    console.log('Making API call to Shopify...');
    const response = await shopify.getProducts(params);
    console.log(`✅ Successfully fetched ${response.products.length} products`);
    
    return NextResponse.json({
      success: true,
      data: {
        products: response.products,
        count: response.products.length
      },
      message: 'Products retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    
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
    
    // Return specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to fetch products: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new product
// Note: Product creation is not implemented in this pricing-focused app
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Product creation is not supported in this pricing app. Use Shopify admin to create products.' 
    },
    { status: 501 } // Not Implemented
  );
}