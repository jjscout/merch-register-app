# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Vite dev server on port 5173
npm run build         # TypeScript check + Vite production build
npm run lint          # ESLint on .ts/.tsx files
npm test              # Vitest unit tests (single run)
npm run test:watch    # Vitest in watch mode
npm run test:e2e      # Playwright e2e tests (auto-starts dev server)
npm run seed          # Populate Supabase from seed file (needs SUPABASE_SERVICE_ROLE_KEY)
```

Pre-commit hook (Husky + lint-staged): runs `eslint --fix`, `prettier --write`, and `vitest related --run` on staged .ts/.tsx files.

## Architecture

**Stack:** React 19 + TypeScript + Vite, Supabase (PostgreSQL), CSS Modules (no Tailwind/styled-components).

**No routing library.** Navigation is conditional rendering driven by a state machine in `SalesPage.tsx` with phases: `BROWSING` -> `SALE_FORM` -> `CONFIRMED`, managed via `useReducer`.

**No state management library.** Local `useState`/`useReducer` only. Seller persisted in `localStorage` key `'merch-register-seller-id'`.

### Key patterns

- **Prices in integer cents** (2500 = $25.00). Convert at display boundary only via `formatCents()`.
- **Adjacency-list tree:** Categories have nullable `parent_id`. Fetched one level at a time as user drills down.
- **Snapshot pricing:** `unit_price_cents` on `sales` table captures price at sale time.
- **Data hooks** (`src/hooks/`) isolate all Supabase queries. Each returns `{ <domain>, loading, error }` (e.g. `{ categories, loading, error }`).
- **Graceful fallback:** If `VITE_SUPABASE_URL` is unset, the app shows setup instructions instead of crashing.

### Data flow

`App.tsx` (seller picker) -> `SalesPage.tsx` (state machine) -> drill-down through `CategoryGrid` -> `SaleForm` -> `useRecordSale` inserts to Supabase -> `SaleConfirmation`.

### Database (4 tables, RLS enabled)

- `sellers` — read-only for anon
- `categories` — adjacency-list tree, read-only for anon
- `products` — belongs to category, read-only for anon
- `sales` — anon can read + insert; constraints: `quantity > 0`, `unit_price_cents > 0`, `payment_method IN ('cash','card','other')`

Schema: `supabase/migrations/001_initial_schema.sql`

### Testing

- **Unit tests:** Vitest + Testing Library. Tests co-located with source (`*.test.ts(x)`). Supabase client is mocked.
- **E2E tests:** Playwright (`e2e/`), Chromium only. Config auto-starts Vite dev server.
- Test setup: `src/test-setup.ts` imports `@testing-library/jest-dom` matchers.

## Configuration

- `base: '/merch-register-app/'` in `vite.config.ts` (GitHub Pages deployment)
- Strict TypeScript (`tsconfig.app.json`): `noUnusedLocals`, `noUnusedParameters`
- Prettier: semicolons, single quotes, trailing commas, 80 char width, 2-space indent
- Deployed via GitHub Actions to GitHub Pages on push to main
