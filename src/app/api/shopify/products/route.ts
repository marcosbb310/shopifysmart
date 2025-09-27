import { NextRequest, NextResponse } from 'next/server';
import { ShopifyAPI } from '@/shared/lib/shopify-api';

// GET - Fetch products
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/shopify/products - Starting request');
    
    // Check for required environment variables
    if (!process.env.SHOPIFY_STORE_URL || !process.env.SHOPIFY_ACCESS_TOKEN) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required environment variables' 
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params: any = {};
    if (searchParams.get('limit')) {
      params.limit = parseInt(searchParams.get('limit')!, 10);
    }
    if (searchParams.get('since_id')) {
      params.since_id = parseInt(searchParams.get('since_id')!, 10);
    }
    if (searchParams.get('fields')) {
      params.fields = searchParams.get('fields');
    }

    console.log('Fetching products with params:', params);
    
    // Initialize Shopify API
    const shopify = new ShopifyAPI();
    
    // Fetch all products
    const response = await shopify.getAllProducts(params);
    
    console.log(`Successfully fetched ${response.products.length} products`);
    
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
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/shopify/products - Starting request');
    
    // Check for required environment variables
    if (!process.env.SHOPIFY_STORE_URL || !process.env.SHOPIFY_ACCESS_TOKEN) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required environment variables' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Creating product with data:', body);
    
    // Initialize Shopify API
    const shopify = new ShopifyAPI();
    
    // Create the product
    const response = await shopify.createProduct(body);
    
    console.log('Successfully created product:', response.product.id);
    
    return NextResponse.json({
      success: true,
      data: {
        product: response.product
      },
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Error creating product:', error);
    
    // Return specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to create product: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}