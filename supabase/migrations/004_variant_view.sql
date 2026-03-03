-- 004_variant_view.sql
-- Create product_catalog_view joining products with variant data

-- ============================================================
-- PRODUCT CATALOG VIEW
-- Simple products: one row with NULL variant fields
-- Variant products: one row per variant combination
-- ============================================================
CREATE VIEW product_catalog_view WITH (security_invoker = true) AS
SELECT
  p.id          AS product_id,
  p.name        AS product_name,
  p.category_id,
  p.price_cents AS base_price_cents,
  p.active,
  pv.id         AS variant_id,
  pv.display_name AS variant_display_name,
  pv.price_cents  AS variant_price_cents,
  (
    SELECT json_agg(
      json_build_object(
        'dimension_name', vd.name,
        'value_name', vv.value
      )
      ORDER BY vd.sort_order, vv.sort_order
    )
    FROM product_variant_values pvv
    JOIN variant_values vv ON vv.id = pvv.value_id
    JOIN variant_dimensions vd ON vd.id = vv.dimension_id
    WHERE pvv.variant_id = pv.id
  ) AS dimensions
FROM products p
LEFT JOIN product_variants pv ON pv.product_id = p.id;

-- Grant SELECT on view to anon role
GRANT SELECT ON product_catalog_view TO anon;
