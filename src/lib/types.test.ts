import { describe, it, expectTypeOf } from 'vitest';
import type {
  MerchEvent,
  Seller,
  Sale,
  VariantDimension,
  VariantValue,
  ProductVariant,
  ProductCatalogEntry,
  CartItem,
} from './types';

describe('MerchEvent type', () => {
  it('has required fields', () => {
    expectTypeOf<MerchEvent>().toHaveProperty('id');
    expectTypeOf<MerchEvent>().toHaveProperty('name');
    expectTypeOf<MerchEvent>().toHaveProperty('starts_at');
    expectTypeOf<MerchEvent>().toHaveProperty('ends_at');
    expectTypeOf<MerchEvent>().toHaveProperty('active');
    expectTypeOf<MerchEvent>().toHaveProperty('created_at');
  });

  it('active is boolean', () => {
    expectTypeOf<MerchEvent['active']>().toBeBoolean();
  });
});

describe('Seller type', () => {
  it('has pin field', () => {
    expectTypeOf<Seller>().toHaveProperty('pin');
  });

  it('pin is nullable string', () => {
    expectTypeOf<Seller['pin']>().toEqualTypeOf<string | null>();
  });
});

describe('Sale type', () => {
  it('has event_id field', () => {
    expectTypeOf<Sale>().toHaveProperty('event_id');
  });

  it('event_id is nullable string', () => {
    expectTypeOf<Sale['event_id']>().toEqualTypeOf<string | null>();
  });

  it('has variant fields', () => {
    expectTypeOf<Sale>().toHaveProperty('product_variant_id');
    expectTypeOf<Sale>().toHaveProperty('variant_display_name');
  });

  it('variant fields are nullable', () => {
    expectTypeOf<Sale['product_variant_id']>().toEqualTypeOf<string | null>();
    expectTypeOf<Sale['variant_display_name']>().toEqualTypeOf<string | null>();
  });
});

describe('VariantDimension type', () => {
  it('has required fields', () => {
    expectTypeOf<VariantDimension>().toHaveProperty('id');
    expectTypeOf<VariantDimension>().toHaveProperty('product_id');
    expectTypeOf<VariantDimension>().toHaveProperty('name');
    expectTypeOf<VariantDimension>().toHaveProperty('sort_order');
    expectTypeOf<VariantDimension>().toHaveProperty('created_at');
  });

  it('sort_order is number', () => {
    expectTypeOf<VariantDimension['sort_order']>().toBeNumber();
  });
});

describe('VariantValue type', () => {
  it('has required fields', () => {
    expectTypeOf<VariantValue>().toHaveProperty('id');
    expectTypeOf<VariantValue>().toHaveProperty('dimension_id');
    expectTypeOf<VariantValue>().toHaveProperty('value');
    expectTypeOf<VariantValue>().toHaveProperty('sort_order');
    expectTypeOf<VariantValue>().toHaveProperty('created_at');
  });

  it('value is string', () => {
    expectTypeOf<VariantValue['value']>().toBeString();
  });
});

describe('ProductVariant type', () => {
  it('has required fields', () => {
    expectTypeOf<ProductVariant>().toHaveProperty('id');
    expectTypeOf<ProductVariant>().toHaveProperty('product_id');
    expectTypeOf<ProductVariant>().toHaveProperty('display_name');
    expectTypeOf<ProductVariant>().toHaveProperty('price_cents');
    expectTypeOf<ProductVariant>().toHaveProperty('active');
    expectTypeOf<ProductVariant>().toHaveProperty('created_at');
  });

  it('price_cents is number', () => {
    expectTypeOf<ProductVariant['price_cents']>().toBeNumber();
  });

  it('active is boolean', () => {
    expectTypeOf<ProductVariant['active']>().toBeBoolean();
  });
});

describe('ProductCatalogEntry type', () => {
  it('has required fields', () => {
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('product_id');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('product_name');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('category_id');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('base_price_cents');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('active');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('variant_id');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('variant_display_name');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('variant_price_cents');
    expectTypeOf<ProductCatalogEntry>().toHaveProperty('dimensions');
  });

  it('variant fields are nullable', () => {
    expectTypeOf<ProductCatalogEntry['variant_id']>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<ProductCatalogEntry['variant_display_name']>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<ProductCatalogEntry['variant_price_cents']>().toEqualTypeOf<
      number | null
    >();
  });

  it('dimensions is nullable array', () => {
    expectTypeOf<ProductCatalogEntry['dimensions']>().toEqualTypeOf<Array<{
      dimension_name: string;
      value_name: string;
    }> | null>();
  });
});

describe('CartItem type', () => {
  it('has flat structure with variant support', () => {
    expectTypeOf<CartItem>().toHaveProperty('product_id');
    expectTypeOf<CartItem>().toHaveProperty('product_name');
    expectTypeOf<CartItem>().toHaveProperty('unit_price_cents');
    expectTypeOf<CartItem>().toHaveProperty('quantity');
    expectTypeOf<CartItem>().toHaveProperty('product_variant_id');
    expectTypeOf<CartItem>().toHaveProperty('variant_display_name');
  });

  it('variant fields are nullable', () => {
    expectTypeOf<CartItem['product_variant_id']>().toEqualTypeOf<
      string | null
    >();
    expectTypeOf<CartItem['variant_display_name']>().toEqualTypeOf<
      string | null
    >();
  });

  it('price and quantity are numbers', () => {
    expectTypeOf<CartItem['unit_price_cents']>().toBeNumber();
    expectTypeOf<CartItem['quantity']>().toBeNumber();
  });
});
