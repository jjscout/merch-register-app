-- 001_initial_schema.sql
-- Merch Register App: initial database schema

-- ============================================================
-- SELLERS
-- ============================================================
CREATE TABLE sellers (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CATEGORIES  (adjacency-list tree; parent_id NULL = root)
-- ============================================================
CREATE TABLE categories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  parent_id  UUID        REFERENCES categories(id) ON DELETE CASCADE,
  sort_order INT         NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id    UUID        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name           TEXT        NOT NULL,
  price_cents    INT         NOT NULL CHECK (price_cents > 0),
  active         BOOLEAN     NOT NULL DEFAULT true,
  sort_order     INT         NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_category_id ON products(category_id);

-- ============================================================
-- SALES
-- ============================================================
CREATE TABLE sales (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id       UUID        NOT NULL REFERENCES products(id),
  seller_id        UUID        NOT NULL REFERENCES sellers(id),
  quantity         INT         NOT NULL CHECK (quantity > 0),
  unit_price_cents INT         NOT NULL CHECK (unit_price_cents > 0),
  payment_method   TEXT        NOT NULL CHECK (payment_method IN ('cash', 'card', 'other')),
  sold_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_sales_seller_id  ON sales(seller_id);
CREATE INDEX idx_sales_sold_at    ON sales(sold_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE sellers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales      ENABLE ROW LEVEL SECURITY;

-- sellers: read-only for anon
CREATE POLICY "sellers_select_anon"
  ON sellers FOR SELECT
  TO anon
  USING (true);

-- categories: read-only for anon
CREATE POLICY "categories_select_anon"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- products: read-only for anon
CREATE POLICY "products_select_anon"
  ON products FOR SELECT
  TO anon
  USING (true);

-- sales: read + insert for anon
CREATE POLICY "sales_select_anon"
  ON sales FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "sales_insert_anon"
  ON sales FOR INSERT
  TO anon
  WITH CHECK (true);
