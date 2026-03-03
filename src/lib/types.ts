export type PaymentMethod = 'cash' | 'card' | 'other';

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  price_cents: number;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Seller {
  id: string;
  name: string;
  pin: string | null;
  created_at: string;
}

export interface MerchEvent {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  active: boolean;
  created_at: string;
}

export interface VariantDimension {
  id: string;
  product_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface VariantValue {
  id: string;
  dimension_id: string;
  value: string;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  display_name: string;
  price_cents: number;
  active: boolean;
  created_at: string;
}

export interface ProductVariantValue {
  variant_id: string;
  value_id: string;
}

export interface ProductCatalogEntry {
  product_id: string;
  product_name: string;
  category_id: string;
  base_price_cents: number;
  active: boolean;
  variant_id: string | null;
  variant_display_name: string | null;
  variant_price_cents: number | null;
  dimensions: Array<{
    dimension_name: string;
    value_name: string;
  }> | null;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
  product_variant_id: string | null;
  variant_display_name: string | null;
}

export interface Sale {
  id: string;
  product_id: string;
  seller_id: string;
  event_id: string | null;
  quantity: number;
  unit_price_cents: number;
  payment_method: PaymentMethod;
  sold_at: string;
  product_variant_id: string | null;
  variant_display_name: string | null;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      sellers: {
        Row: Seller;
        Insert: Omit<Seller, 'id' | 'created_at'>;
        Update: Partial<Omit<Seller, 'id' | 'created_at'>>;
      };
      sales: {
        Row: Sale;
        Insert: Omit<Sale, 'id'>;
        Update: Partial<Omit<Sale, 'id'>>;
      };
      events: {
        Row: MerchEvent;
        Insert: Omit<MerchEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<MerchEvent, 'id' | 'created_at'>>;
      };
      variant_dimensions: {
        Row: VariantDimension;
        Insert: Omit<VariantDimension, 'id' | 'created_at'>;
        Update: Partial<Omit<VariantDimension, 'id' | 'created_at'>>;
      };
      variant_values: {
        Row: VariantValue;
        Insert: Omit<VariantValue, 'id' | 'created_at'>;
        Update: Partial<Omit<VariantValue, 'id' | 'created_at'>>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, 'id' | 'created_at'>;
        Update: Partial<Omit<ProductVariant, 'id' | 'created_at'>>;
      };
      product_variant_values: {
        Row: ProductVariantValue;
        Insert: ProductVariantValue;
        Update: Partial<ProductVariantValue>;
      };
    };
    Views: {
      product_catalog_view: {
        Row: ProductCatalogEntry;
      };
    };
    Functions: Record<string, never>;
  };
}
