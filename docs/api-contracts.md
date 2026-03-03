# API Contracts — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Overview

This app uses **Supabase** as its backend — there are no custom API endpoints. All data access goes through the Supabase JS client (`@supabase/supabase-js`) using its PostgREST auto-generated REST API. The client is initialized in `src/lib/supabase.ts`.

Authentication uses the **anon** role exclusively. Admin write operations rely on RLS policies that grant full CRUD to the `anon` role (admin PIN is checked client-side only).

## Supabase Client Configuration

| Setting           | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Client file       | `src/lib/supabase.ts`                                              |
| URL env var       | `VITE_SUPABASE_URL`                                                |
| Key env var       | `VITE_SUPABASE_ANON_KEY`                                           |
| Typed             | Yes (`Database` generic from `src/lib/types.ts`)                   |
| Graceful fallback | `isSupabaseConfigured` flag; app shows setup instructions if unset |

## Data Access Hooks (API Surface)

All Supabase queries are encapsulated in custom hooks under `src/hooks/`. Each hook returns `{ data, loading, error }` pattern.

### Read-Only Hooks

| Hook                      | Table        | Query Pattern                                                      | Filters                                                                           |
| ------------------------- | ------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `useCategories(parentId)` | `categories` | `.select('*')`                                                     | `.is('parent_id', null)` or `.eq('parent_id', parentId)`, ordered by `sort_order` |
| `useProducts(categoryId)` | `products`   | `.select('*')`                                                     | `.eq('category_id', id).eq('active', true)`, ordered by `sort_order`              |
| `useSellers()`            | `sellers`    | `.select('*')`                                                     | Ordered by `name`                                                                 |
| `useActiveEvent()`        | `events`     | `.select('*')`                                                     | `.eq('active', true).gte('ends_at', now).lte('starts_at', now)`                   |
| `useEvents()`             | `events`     | `.select('*')`                                                     | Ordered by `starts_at` descending                                                 |
| `useEventSales(eventId)`  | `sales`      | `.select('*, products:product_id(name), sellers:seller_id(name)')` | `.eq('event_id', eventId)`                                                        |

### Mutation Hooks

| Hook               | Table     | Operations                                                    |
| ------------------ | --------- | ------------------------------------------------------------- |
| `useRecordSale()`  | `sales`   | `.insert(sale).select().single()`                             |
| `useRecordCart()`  | `sales`   | `.insert(rows[]).select()` — batch insert for multi-item cart |
| `useSellerByPin()` | `sellers` | `.select('*').eq('pin', pin).single()`                        |

### Admin CRUD Hooks

All admin hooks follow the same pattern: `useEffect` fetch with `version` counter for refetch, plus `add*`, `update*`, `delete*` async methods.

| Hook                   | Table        | Operations                                                                                                 |
| ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `useAdminEvents()`     | `events`     | CRUD + `toggleActive(id, active)`                                                                          |
| `useAdminSellers()`    | `sellers`    | Create, delete (name + pin)                                                                                |
| `useAdminCategories()` | `categories` | Create (with parent_id), delete                                                                            |
| `useAdminProducts()`   | `products`   | CRUD + toggle active. Price input in dollars, converted to cents via `Math.round(parseFloat(price) * 100)` |

## RLS Policies

### Original Schema (001)

| Table        | anon SELECT | anon INSERT | anon UPDATE | anon DELETE |
| ------------ | ----------- | ----------- | ----------- | ----------- |
| `sellers`    | Yes         | No          | No          | No          |
| `categories` | Yes         | No          | No          | No          |
| `products`   | Yes         | No          | No          | No          |
| `sales`      | Yes         | Yes         | No          | No          |

### After Migration 002

| Table        | anon SELECT | anon INSERT | anon UPDATE | anon DELETE |
| ------------ | ----------- | ----------- | ----------- | ----------- |
| `events`     | Yes         | Yes         | Yes         | Yes         |
| `sellers`    | Yes         | Yes         | Yes         | Yes         |
| `categories` | Yes         | Yes         | Yes         | Yes         |
| `products`   | Yes         | Yes         | Yes         | Yes         |
| `sales`      | Yes         | Yes         | No          | No          |

> **Security note**: Admin write operations are protected only by a client-side PIN check (`VITE_ADMIN_PIN` env var, default `0000`). RLS policies allow full CRUD for `anon`. This is acceptable for a trusted-device kiosk deployment but would need server-side auth for a public-facing app.
