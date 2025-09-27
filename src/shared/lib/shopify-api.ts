// Shopify API client and utilities
// Reusable functions for Shopify integration

import { ShopifyProductsResponse, ShopifyApiErrorResponse, ShopifyApiConfig, ShopifyProduct } from '../types';

export class ShopifyApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ShopifyApiError';
  }
}

export class ShopifyApiClient {
  private config: ShopifyApiConfig;

  constructor(config: ShopifyApiConfig) {
    this.config = config;
  }

  private getHeaders(): Record<string, string> {
    return {
      'X-Shopify-Access-Token': this.config.accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `https://${this.config.shopDomain}/admin/api/2024-01${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData: ShopifyApiErrorResponse | null = null;
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, use the status text
        }

        throw new ShopifyApiError(
          errorData?.errors ? JSON.stringify(errorData.errors) : response.statusText,
          response.status,
          errorData?.errors
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ShopifyApiError) {
        throw error;
      }
      
      // Handle network or other errors
      throw new ShopifyApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0
      );
    }
  }

  async getProducts(params?: {
    limit?: number;
    page?: number;
    fields?: string;
    ids?: string;
    title?: string;
    vendor?: string;
    product_type?: string;
    collection_id?: string;
    created_at_min?: string;
    created_at_max?: string;
    updated_at_min?: string;
    updated_at_max?: string;
    published_at_min?: string;
    published_at_max?: string;
    published_status?: 'published' | 'unpublished' | 'any';
  }): Promise<ShopifyProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/products.json${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<ShopifyProductsResponse>(endpoint);
  }

  async getAllProducts(params?: {
    fields?: string;
    ids?: string;
    title?: string;
    vendor?: string;
    product_type?: string;
    collection_id?: string;
    created_at_min?: string;
    created_at_max?: string;
    updated_at_min?: string;
    updated_at_max?: string;
    published_at_min?: string;
    published_at_max?: string;
    published_status?: 'published' | 'unpublished' | 'any';
  }): Promise<ShopifyProductsResponse> {
    const allProducts: ShopifyProduct[] = [];
    let page = 1;
    const limit = 250; // Shopify's max limit per request
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.getProducts({
        ...params,
        limit,
        page,
      });

      allProducts.push(...response.products);

      // Check if we got less than the limit, which means we're on the last page
      hasNextPage = response.products.length === limit;
      page++;
    }

    return { products: allProducts };
  }

  async updateProduct(productId: number, productData: {
    title?: string;
    body_html?: string;
    vendor?: string;
    product_type?: string;
    tags?: string;
    status?: 'active' | 'archived' | 'draft';
  }): Promise<{ product: ShopifyProduct }> {
    const endpoint = `/products/${productId}.json`;
    
    return this.makeRequest<{ product: ShopifyProduct }>(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        product: productData
      }),
    });
  }

  async updateVariant(variantId: number, variantData: {
    price?: string;
    compare_at_price?: string;
    inventory_quantity?: number;
    sku?: string;
    barcode?: string;
    weight?: number;
    weight_unit?: string;
    requires_shipping?: boolean;
    taxable?: boolean;
  }): Promise<{ variant: ShopifyVariant }> {
    const endpoint = `/variants/${variantId}.json`;
    
    return this.makeRequest<{ variant: ShopifyVariant }>(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        variant: variantData
      }),
    });
  }

  async updateVariantInventory(variantId: number, quantity: number): Promise<{ variant: ShopifyVariant }> {
    // Use the inventory_levels endpoint for more reliable inventory updates
    const endpoint = `/variants/${variantId}.json`;
    
    return this.makeRequest<{ variant: ShopifyVariant }>(endpoint, {
      method: 'PUT',
      body: JSON.stringify({
        variant: {
          inventory_quantity: quantity
        }
      }),
    });
  }
}

export function createShopifyClient(): ShopifyApiClient {
  const config: ShopifyApiConfig = {
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN!,
    clientSecret: process.env.SHOPIFY_CLIENT_SECRET!,
    clientId: process.env.SHOPIFY_CLIENT_ID!,
    shopDomain: process.env.SHOPIFY_SHOP_DOMAIN || '1t0yf8-7e.myshopify.com',
  };

  // Validate required environment variables
  if (!config.accessToken || !config.clientSecret || !config.clientId) {
    throw new Error(
      'Missing required Shopify environment variables: SHOPIFY_ACCESS_TOKEN, SHOPIFY_CLIENT_SECRET, SHOPIFY_CLIENT_ID'
    );
  }

  return new ShopifyApiClient(config);
}
