-- 002_events_pins_admin.sql
-- Add events table, seller PINs, event_id on sales, and admin write policies

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  starts_at  TIMESTAMPTZ NOT NULL,
  ends_at    TIMESTAMPTZ NOT NULL,
  active     BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  CHECK (ends_at > starts_at)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_anon"
  ON events FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- SELLER PINs
-- ============================================================
ALTER TABLE sellers ADD COLUMN pin TEXT UNIQUE;

-- ============================================================
-- SALES -> EVENT FK
-- ============================================================
ALTER TABLE sales ADD COLUMN event_id UUID REFERENCES events(id);

CREATE INDEX idx_sales_event_id ON sales(event_id);

-- ============================================================
-- ADMIN WRITE POLICIES (service_role already bypasses RLS,
-- but anon needs insert/update/delete for admin features)
-- ============================================================

-- events: full CRUD for anon (admin PIN checked in app)
CREATE POLICY "events_insert_anon"
  ON events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "events_update_anon"
  ON events FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "events_delete_anon"
  ON events FOR DELETE
  TO anon
  USING (true);

-- sellers: write policies for admin
CREATE POLICY "sellers_insert_anon"
  ON sellers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "sellers_update_anon"
  ON sellers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "sellers_delete_anon"
  ON sellers FOR DELETE
  TO anon
  USING (true);

-- categories: write policies for admin
CREATE POLICY "categories_insert_anon"
  ON categories FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "categories_update_anon"
  ON categories FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_delete_anon"
  ON categories FOR DELETE
  TO anon
  USING (true);

-- products: write policies for admin
CREATE POLICY "products_insert_anon"
  ON products FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "products_update_anon"
  ON products FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products_delete_anon"
  ON products FOR DELETE
  TO anon
  USING (true);
