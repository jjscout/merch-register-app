import type { Category, Product, ProductCatalogEntry } from '../lib/types';

export function createMockCategory(overrides?: Partial<Category>): Category {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Test Category',
    parent_id: null,
    sort_order: 0,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: '00000000-0000-0000-0000-000000000010',
    category_id: '00000000-0000-0000-0000-000000000001',
    name: 'Test Product',
    price_cents: 2500,
    active: true,
    sort_order: 0,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockVariantProduct(
  overrides?: Partial<ProductCatalogEntry>,
): ProductCatalogEntry {
  return {
    product_id: '00000000-0000-0000-0000-000000000010',
    product_name: 'Test Variant Product',
    category_id: '00000000-0000-0000-0000-000000000001',
    base_price_cents: 2500,
    active: true,
    variant_id: '00000000-0000-0000-0000-000000000020',
    variant_display_name: 'Test Variant — Size L',
    variant_price_cents: 3000,
    dimensions: [{ dimension_name: 'Size', value_name: 'L' }],
    ...overrides,
  };
}

export function createMockProductTree(): {
  categories: Category[];
  catalog: ProductCatalogEntry[];
} {
  const rootCategory = createMockCategory({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Apparel',
  });
  const childCategory = createMockCategory({
    id: '00000000-0000-0000-0000-000000000002',
    name: 'T-Shirts',
    parent_id: '00000000-0000-0000-0000-000000000001',
    sort_order: 1,
  });

  const simpleEntry: ProductCatalogEntry = {
    product_id: '00000000-0000-0000-0000-000000000010',
    product_name: 'Sticker Pack',
    category_id: '00000000-0000-0000-0000-000000000001',
    base_price_cents: 500,
    active: true,
    variant_id: null,
    variant_display_name: null,
    variant_price_cents: null,
    dimensions: null,
  };

  const variantEntrySmall: ProductCatalogEntry = {
    product_id: '00000000-0000-0000-0000-000000000011',
    product_name: 'Tour Tee',
    category_id: '00000000-0000-0000-0000-000000000002',
    base_price_cents: 2500,
    active: true,
    variant_id: '00000000-0000-0000-0000-000000000020',
    variant_display_name: 'Tour Tee — S',
    variant_price_cents: 2500,
    dimensions: [{ dimension_name: 'Size', value_name: 'S' }],
  };

  const variantEntryLarge: ProductCatalogEntry = {
    product_id: '00000000-0000-0000-0000-000000000011',
    product_name: 'Tour Tee',
    category_id: '00000000-0000-0000-0000-000000000002',
    base_price_cents: 2500,
    active: true,
    variant_id: '00000000-0000-0000-0000-000000000021',
    variant_display_name: 'Tour Tee — L',
    variant_price_cents: 3000,
    dimensions: [{ dimension_name: 'Size', value_name: 'L' }],
  };

  return {
    categories: [rootCategory, childCategory],
    catalog: [simpleEntry, variantEntrySmall, variantEntryLarge],
  };
}
