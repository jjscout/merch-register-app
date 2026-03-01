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

export interface CartItem {
  product: Product;
  quantity: number;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
