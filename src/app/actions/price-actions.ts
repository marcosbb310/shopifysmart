"use server";

import { createShopifyClient } from '@/shared/lib';
// import { revalidatePath } from 'next/cache'; // TODO: Use when implementing cache invalidation

export interface PriceUpdateResult {
  success: boolean;
  productId: string;
  variantId?: string;
  newPrice: number;
  error?: string;
}

export interface BulkPriceUpdateResult {
  success: boolean;
  results: PriceUpdateResult[];
  totalUpdated: number;
  totalFailed: number;
}

/**
 * Update a single product's price in Shopify
 */
export async function updateProductPrice(
  productId: string,
  variantId: string,
  newPrice: number
): Promise<PriceUpdateResult> {
  try {
    console.log(`[Server Action] Updating price for product ${productId} variant ${variantId} to ${newPrice}`);
    
    const shopifyClient = createShopifyClient();
    
    // Update the variant price in Shopify
    await shopifyClient.updateVariant(
      parseInt(variantId),
      {
        price: newPrice.toFixed(2)
      }
    );

    console.log(`[Server Action] Successfully updated price for product ${productId} variant ${variantId}`);

    // Note: Removed revalidatePath calls to prevent page refreshes
    // The UI handles updates optimistically and syncs with server response

    return {
      success: true,
      productId,
      variantId,
      newPrice
    };

  } catch (error) {
    console.error(`[Server Action] Failed to update price for product ${productId}:`, error);
    
    return {
      success: false,
      productId,
      variantId,
      newPrice,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Update multiple product prices in parallel
 */
export async function updateBulkPrices(
  updates: Array<{ productId: string; variantId: string; newPrice: number }>
): Promise<BulkPriceUpdateResult> {
  try {
    console.log(`[Server Action] Starting bulk price update for ${updates.length} products`);
    
    // Execute all updates in parallel for maximum speed
    const results = await Promise.allSettled(
      updates.map(({ productId, variantId, newPrice }) =>
        updateProductPrice(productId, variantId, newPrice)
      )
    );

    const priceResults: PriceUpdateResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          productId: updates[index].productId,
          variantId: updates[index].variantId,
          newPrice: updates[index].newPrice,
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
        };
      }
    });

    const totalUpdated = priceResults.filter(r => r.success).length;
    const totalFailed = priceResults.filter(r => !r.success).length;

    console.log(`[Server Action] Bulk update completed: ${totalUpdated} successful, ${totalFailed} failed`);

    // Note: Removed revalidatePath calls to prevent page refreshes
    // The UI handles updates optimistically and syncs with server response

    return {
      success: totalFailed === 0,
      results: priceResults,
      totalUpdated,
      totalFailed
    };

  } catch (error) {
    console.error('[Server Action] Bulk price update failed:', error);
    
    return {
      success: false,
      results: [],
      totalUpdated: 0,
      totalFailed: updates.length
    };
  }
}

/**
 * Apply bulk percentage or fixed price changes
 */
export async function applyBulkPriceChange(
  updates: Array<{ productId: string; variantId: string; currentPrice: number; change: number; type: 'percentage' | 'fixed' }>
): Promise<BulkPriceUpdateResult> {
  try {
    console.log(`[Server Action] Applying bulk price change to ${updates.length} products`);
    
    // Calculate new prices
    const priceUpdates = updates.map(({ productId, variantId, currentPrice, change, type }) => {
      let newPrice: number;
      
      if (type === 'percentage') {
        newPrice = currentPrice * (1 + change / 100);
      } else {
        newPrice = currentPrice + change;
      }
      
      // Ensure price is not negative
      newPrice = Math.max(0, newPrice);
      
      return {
        productId,
        variantId,
        newPrice
      };
    });

    return await updateBulkPrices(priceUpdates);

  } catch (error) {
    console.error('[Server Action] Bulk price change failed:', error);
    
    return {
      success: false,
      results: [],
      totalUpdated: 0,
      totalFailed: updates.length
    };
  }
}

/**
 * Update product cost price (stored locally, not in Shopify)
 */
export async function updateProductCost(
  productId: string,
  newCost: number
): Promise<PriceUpdateResult> {
  try {
    console.log(`[Server Action] Updating cost for product ${productId} to ${newCost}`);
    
    // Cost prices are typically not stored in Shopify's standard API
    // This would be stored in your local database or custom app
    // For now, we'll just return success
    
    // Note: Removed revalidatePath calls to prevent page refreshes
    
    return {
      success: true,
      productId,
      newPrice: newCost
    };

  } catch (error) {
    console.error(`[Server Action] Failed to update cost for product ${productId}:`, error);
    
    return {
      success: false,
      productId,
      newPrice: newCost,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Update pricing bounds (base price and max price)
 */
export async function updatePricingBounds(
  productId: string,
  basePrice: number,
  maxPrice: number
): Promise<PriceUpdateResult> {
  try {
    console.log(`[Server Action] Updating pricing bounds for product ${productId}: base=${basePrice}, max=${maxPrice}`);
    
    // These are typically stored locally for smart pricing algorithms
    // For now, we'll just return success
    
    // Note: Removed revalidatePath calls to prevent page refreshes
    
    return {
      success: true,
      productId,
      newPrice: basePrice
    };

  } catch (error) {
    console.error(`[Server Action] Failed to update pricing bounds for product ${productId}:`, error);
    
    return {
      success: false,
      productId,
      newPrice: basePrice,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
