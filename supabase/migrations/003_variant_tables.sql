-- 003_variant_tables.sql
-- Add variant support: dimensions, values, product_variants, and junction table

-- ============================================================
-- VARIANT DIMENSIONS (per-product dimension definitions)
-- ============================================================
CREATE TABLE variant_dimensions (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  sort_order INT         NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_variant_dimensions_product_id ON variant_dimensions(product_id);

-- ============================================================
-- VARIANT VALUES (values within a dimension)
-- ============================================================
CREATE TABLE variant_values (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension_id UUID        NOT NULL REFERENCES variant_dimensions(id) ON DELETE CASCADE,
  value        TEXT        NOT NULL,
  sort_order   INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_variant_values_dimension_id ON variant_values(dimension_id);

-- ============================================================
-- PRODUCT VARIANTS (specific variant combinations with pricing)
-- ============================================================
CREATE TABLE product_variants (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id   UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_name TEXT        NOT NULL,
  price_cents  INT         NOT NULL CHECK (price_cents > 0),
  active       BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- ============================================================
-- PRODUCT VARIANT VALUES (junction: variant <-> dimension values)
-- ============================================================
CREATE TABLE product_variant_values (
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  value_id   UUID NOT NULL REFERENCES variant_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, value_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE variant_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_values ENABLE ROW LEVEL SECURITY;

-- variant_dimensions: full CRUD for anon (admin PIN checked in app)
CREATE POLICY "variant_dimensions_select_anon" ON variant_dimensions FOR SELECT TO anon USING (true);
CREATE POLICY "variant_dimensions_insert_anon" ON variant_dimensions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "variant_dimensions_update_anon" ON variant_dimensions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "variant_dimensions_delete_anon" ON variant_dimensions FOR DELETE TO anon USING (true);

-- variant_values: full CRUD for anon (admin PIN checked in app)
CREATE POLICY "variant_values_select_anon" ON variant_values FOR SELECT TO anon USING (true);
CREATE POLICY "variant_values_insert_anon" ON variant_values FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "variant_values_update_anon" ON variant_values FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "variant_values_delete_anon" ON variant_values FOR DELETE TO anon USING (true);

-- product_variants: full CRUD for anon (admin PIN checked in app)
CREATE POLICY "product_variants_select_anon" ON product_variants FOR SELECT TO anon USING (true);
CREATE POLICY "product_variants_insert_anon" ON product_variants FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "product_variants_update_anon" ON product_variants FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "product_variants_delete_anon" ON product_variants FOR DELETE TO anon USING (true);

-- product_variant_values: full CRUD for anon (admin PIN checked in app)
CREATE POLICY "product_variant_values_select_anon" ON product_variant_values FOR SELECT TO anon USING (true);
CREATE POLICY "product_variant_values_insert_anon" ON product_variant_values FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "product_variant_values_update_anon" ON product_variant_values FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "product_variant_values_delete_anon" ON product_variant_values FOR DELETE TO anon USING (true);
