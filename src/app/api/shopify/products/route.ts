import { NextRequest, NextResponse } from 'next/server';
import { createShopifyClient, ShopifyApiError } from '@/shared/lib';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const params: Record<string, string | number> = {};
    
    // Parse common query parameters
    if (searchParams.get('limit')) {
      params.limit = parseInt(searchParams.get('limit')!, 10);
    }
    if (searchParams.get('page')) {
      params.page = parseInt(searchParams.get('page')!, 10);
    }
    if (searchParams.get('fields')) {
      params.fields = searchParams.get('fields')!;
    }
    if (searchParams.get('ids')) {
      params.ids = searchParams.get('ids')!;
    }
    if (searchParams.get('title')) {
      params.title = searchParams.get('title')!;
    }
    if (searchParams.get('vendor')) {
      params.vendor = searchParams.get('vendor')!;
    }
    if (searchParams.get('product_type')) {
      params.product_type = searchParams.get('product_type')!;
    }
    if (searchParams.get('collection_id')) {
      params.collection_id = searchParams.get('collection_id')!;
    }
    if (searchParams.get('created_at_min')) {
      params.created_at_min = searchParams.get('created_at_min')!;
    }
    if (searchParams.get('created_at_max')) {
      params.created_at_max = searchParams.get('created_at_max')!;
    }
    if (searchParams.get('updated_at_min')) {
      params.updated_at_min = searchParams.get('updated_at_min')!;
    }
    if (searchParams.get('updated_at_max')) {
      params.updated_at_max = searchParams.get('updated_at_max')!;
    }
    if (searchParams.get('published_at_min')) {
      params.published_at_min = searchParams.get('published_at_min')!;
    }
    if (searchParams.get('published_at_max')) {
      params.published_at_max = searchParams.get('published_at_max')!;
    }
    if (searchParams.get('published_status')) {
      params.published_status = searchParams.get('published_status')! as 'published' | 'unpublished' | 'any';
    }

    // Check if we should get all products (when no limit is specified or limit is very high)
    const getAll = !params.limit || (typeof params.limit === 'number' && params.limit >= 1000);
    
    // Create Shopify client
    const shopifyClient = createShopifyClient();
    
    // Fetch products
    const productsResponse = getAll 
      ? await shopifyClient.getAllProducts(params)
      : await shopifyClient.getProducts(params);

    // Return successful response
    return NextResponse.json({
      success: true,
      data: productsResponse,
      count: productsResponse.products.length,
      message: 'Products retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching Shopify products:', error);

    // Handle Shopify API errors
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

    // Handle other errors
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
