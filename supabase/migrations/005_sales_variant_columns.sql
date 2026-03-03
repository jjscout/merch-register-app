-- 005_sales_variant_columns.sql
-- Add variant reference columns to sales table (nullable, backward compatible)

-- ============================================================
-- SALES VARIANT COLUMNS
-- ============================================================
ALTER TABLE sales ADD COLUMN product_variant_id UUID REFERENCES product_variants(id);
ALTER TABLE sales ADD COLUMN variant_display_name TEXT;

CREATE INDEX idx_sales_product_variant_id ON sales(product_variant_id);
