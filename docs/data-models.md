# Data Models — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Database Overview

- **Provider**: Supabase (PostgreSQL)
- **Migrations**: `supabase/migrations/` (3 files, applied sequentially)
- **RLS**: Enabled on all tables
- **TypeScript types**: `src/lib/types.ts` (manually maintained `Database` interface)

## Entity Relationship

```
events 1──∞ sales ∞──1 products ∞──1 categories
                  ∞──1 sellers          │
                                        │ parent_id (self-ref)
                                        ↓
                                   categories
```

## Tables

### `sellers`

| Column       | Type        | Constraints                     | Notes                  |
| ------------ | ----------- | ------------------------------- | ---------------------- |
| `id`         | UUID        | PK, default `gen_random_uuid()` |                        |
| `name`       | TEXT        | NOT NULL, UNIQUE                |                        |
| `pin`        | TEXT        | UNIQUE (nullable)               | Added in migration 002 |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()`                 |                        |

### `categories`

Adjacency-list tree pattern. `parent_id = NULL` means root category.

| Column       | Type        | Constraints                                       | Notes            |
| ------------ | ----------- | ------------------------------------------------- | ---------------- |
| `id`         | UUID        | PK, default `gen_random_uuid()`                   |                  |
| `name`       | TEXT        | NOT NULL                                          |                  |
| `parent_id`  | UUID        | FK → `categories(id)` ON DELETE CASCADE, nullable | Self-referential |
| `sort_order` | INT         | NOT NULL, DEFAULT 0                               | Display ordering |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()`                                   |                  |

**Indexes**: `idx_categories_parent_id`

### `products`

| Column        | Type        | Constraints                                       | Notes                   |
| ------------- | ----------- | ------------------------------------------------- | ----------------------- |
| `id`          | UUID        | PK, default `gen_random_uuid()`                   |                         |
| `category_id` | UUID        | NOT NULL, FK → `categories(id)` ON DELETE CASCADE |                         |
| `name`        | TEXT        | NOT NULL                                          |                         |
| `price_cents` | INT         | NOT NULL, CHECK > 0                               | Stored in integer cents |
| `active`      | BOOLEAN     | NOT NULL, DEFAULT true                            | Soft-delete / hide      |
| `sort_order`  | INT         | NOT NULL, DEFAULT 0                               |                         |
| `created_at`  | TIMESTAMPTZ | DEFAULT `now()`                                   |                         |

**Indexes**: `idx_products_category_id`

### `sales`

| Column             | Type        | Constraints                                  | Notes                                 |
| ------------------ | ----------- | -------------------------------------------- | ------------------------------------- |
| `id`               | UUID        | PK, default `gen_random_uuid()`              |                                       |
| `product_id`       | UUID        | NOT NULL, FK → `products(id)`                |                                       |
| `seller_id`        | UUID        | NOT NULL, FK → `sellers(id)`                 |                                       |
| `event_id`         | UUID        | FK → `events(id)`, nullable                  | Added in migration 002                |
| `quantity`         | INT         | NOT NULL, CHECK > 0 AND <= 999               | Upper bound added in 002_quantity_cap |
| `unit_price_cents` | INT         | NOT NULL, CHECK > 0                          | Snapshot of price at sale time        |
| `payment_method`   | TEXT        | NOT NULL, CHECK IN ('cash', 'card', 'other') |                                       |
| `sold_at`          | TIMESTAMPTZ | NOT NULL, DEFAULT `now()`                    |                                       |

**Indexes**: `idx_sales_product_id`, `idx_sales_seller_id`, `idx_sales_sold_at`, `idx_sales_event_id`

### `events`

| Column       | Type        | Constraints                     | Notes                                                       |
| ------------ | ----------- | ------------------------------- | ----------------------------------------------------------- |
| `id`         | UUID        | PK, default `gen_random_uuid()` |                                                             |
| `name`       | TEXT        | NOT NULL                        |                                                             |
| `starts_at`  | TIMESTAMPTZ | NOT NULL                        |                                                             |
| `ends_at`    | TIMESTAMPTZ | NOT NULL, CHECK > `starts_at`   |                                                             |
| `active`     | BOOLEAN     | NOT NULL, DEFAULT false         | Only one should be active at a time (enforced in app logic) |
| `created_at` | TIMESTAMPTZ | DEFAULT `now()`                 |                                                             |

## Migration History

| File                        | Description                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `001_initial_schema.sql`    | Creates sellers, categories, products, sales tables with RLS (anon read-only except sales insert) |
| `002_events_pins_admin.sql` | Adds events table, seller pin column, sales.event_id FK, full CRUD RLS policies for admin         |
| `002_quantity_cap.sql`      | Adds quantity upper bound (999) to sales table                                                    |

## Key Design Patterns

1. **Prices in integer cents**: All monetary values stored as integers (e.g., `2500` = $25.00). Conversion happens at display boundary via `formatCents()`.
2. **Snapshot pricing**: `unit_price_cents` on sales captures price at time of sale, decoupled from product's current price.
3. **Adjacency-list tree**: Categories form a tree via self-referential `parent_id`. Fetched one level at a time as user drills down.
4. **Soft-delete for products**: `active` boolean allows hiding products without losing sales history.
5. **Batch cart insert**: `useRecordCart` inserts multiple sale rows in a single Supabase call with shared `sold_at` timestamp.

## TypeScript Types

All database types are defined in `src/lib/types.ts`:

- `Category`, `Product`, `Seller`, `MerchEvent`, `Sale`, `CartItem`, `PaymentMethod`
- `Database` interface provides typed Supabase client (Row, Insert, Update for each table)
