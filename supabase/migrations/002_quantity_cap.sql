-- 002_quantity_cap.sql
-- Add upper bound on sale quantity to prevent overflow

ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_quantity_check;
ALTER TABLE sales ADD CONSTRAINT sales_quantity_check CHECK (quantity > 0 AND quantity <= 999);
