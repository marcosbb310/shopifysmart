// Products feature exports
// Main components for product management and pricing optimization

export { ProductList } from './components/ProductList';
export { ProductFilters } from './components/ProductFilters';
export { BulkActions } from './components/BulkActions';
export { ProductsLayout } from './components/ProductsLayout';
export { ProductEditForm } from './components/ProductEditForm';

// Pages
export * from './pages';

// Re-export types from pricing feature
export type { Product, PricingRecommendation } from '../pricing/types';
