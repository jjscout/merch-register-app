# Merch Register App - Implementation Plan

> **NOTE FOR CLAUDE INSTANCES:** When you complete a checklist item, change `- [ ]` to `- [x]` in this file and commit the update alongside your work. This lets future sessions know what's done. Before starting work, read this file to see current progress.

## Context

Building a sales tracking app for a merch stand. Users (1-3 sellers) navigate a product tree (e.g. T-shirt model → Men/Women → T/Tank → Size), select an item, and record a sale. Sales stored in Supabase free tier. Products configured via JSON seed file.

## Decisions

- **Stack**: React + Vite + TypeScript, Supabase, plain CSS / CSS Modules
- **Prices**: Integer cents (2500 = $25.00)
- **Config**: JSON seed file (admin UI later)
- **Sales data**: Item, quantity, price, timestamp, payment method, seller
- **Reporting**: Record only (Supabase dashboard for viewing)
- **Testing**: Vitest (unit) + Playwright (e2e), red-green-yellow TDD
- **Pre-commit**: Husky + lint-staged (prettier, eslint, vitest related)
- **No auth**: Seller picked from dropdown, persisted in localStorage

---

## Progress Checklist

After each step, commit and clear context before starting the next.

### Execution Strategy

**Parallel steps use worktree agents.** Each parallel agent gets an isolated git worktree (separate branch). After all parallel agents complete, we merge their branches into main sequentially.

**Merge strategy:** Since this is greenfield, each parallel step creates _new files only_ (no overlapping edits), so merges should be conflict-free. If conflicts arise, resolve manually.

**Parallel batch 1** (after Step 1):

- Agent A (worktree): Step 2 — DB schema (creates `supabase/` dir)
- Agent B (worktree): Step 3 — Types/Utils (creates `src/lib/` files)
- → Merge both into main, then proceed to Step 4

**Parallel batch 2** (after Step 4):

- Agent A (worktree): Step 5 — BreadcrumbNav + CategoryGrid (creates `src/components/BreadcrumbNav.*`, `CategoryGrid.*`)
- Agent B (worktree): Step 6 — SaleForm + SaleConfirmation (creates `src/components/SaleForm.*`, `SaleConfirmation.*`)
- Agent C (worktree): Step 8 — Seed script (creates `scripts/seed.ts`, `src/data/products.seed.json`)
- → Merge all into main, then proceed to Step 7

### Dependency Graph

```
Step 1 (Scaffolding)
  ├→ Step 2 (DB Schema)  ──┐
  └→ Step 3 (Types/Utils) ─┤  (2 & 3 in parallel)
                            ↓
                     Step 4 (Hooks)
                       ├→ Step 5 (Nav components) ─┐
                       ├→ Step 6 (Sale components) ─┤  (5, 6, 8 in parallel)
                       └→ Step 8 (Seed script) ─────┤
                            ↓                       ↓
                     Step 7 (Page assembly) ←───────┘
                            ↓
                     Step 9 (E2E tests)
                            ↓
                     Step 10 (Polish)
```

### Step 1: Project Scaffolding

- [x] Scaffold Vite React-TS project in `merch-register-app/`
- [x] Install deps: react, react-dom, @supabase/supabase-js
- [x] Install dev deps: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, @playwright/test, eslint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, eslint-config-prettier, prettier, husky, lint-staged, tsx
- [x] Configure: vite.config.ts, vitest.config.ts (jsdom env), eslint.config.js, .prettierrc, tsconfig
- [x] Setup husky pre-commit hook running lint-staged
- [x] Configure lint-staged in package.json: eslint + prettier + vitest related on \*.ts/tsx
- [x] Create .env.example with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- [x] Create .gitignore (include .env)
- [x] Verify: `npm run dev`, `npm test`, pre-commit hook all work
- [x] Commit: "chore: scaffold project with Vite, Vitest, Playwright, husky, lint-staged"

### Step 2: Database Schema + Supabase Setup

- [x] Create `supabase/migrations/001_initial_schema.sql` with tables:
  - `sellers` (id UUID, name TEXT UNIQUE, created_at)
  - `categories` (id UUID, name TEXT, parent_id UUID self-ref nullable, sort_order INT) + index on parent_id
  - `products` (id UUID, category_id UUID FK, name TEXT, price_cents INT, active BOOL, sort_order INT) + index on category_id
  - `sales` (id UUID, product_id UUID FK, seller_id UUID FK, quantity INT >0, unit_price_cents INT >0, payment_method TEXT cash/card/other, sold_at TIMESTAMPTZ) + indexes
- [x] Add RLS: categories/products/sellers read-only for anon, sales read+insert for anon
- [ ] Create Supabase project, run migration SQL in dashboard
- [x] Commit: "feat: add database schema migration"

### Step 3: Types, Supabase Client, and Utilities

- [x] Create `src/lib/types.ts`: Category, Product, Seller, Sale, PaymentMethod, Database types
- [x] Create `src/lib/supabase.ts`: Supabase client singleton
- [x] RED: Write test for `formatCents` (2500→"$25.00", 99→"$0.99", 0→"$0.00")
- [x] GREEN: Implement `src/lib/format.ts`
- [x] YELLOW: Refactor if needed
- [x] Commit: "feat: add types, supabase client, and formatCents utility"

### Step 4: Data Hooks

- [x] RED: Test `useCategories` — mock supabase, returns categories for parentId (null=root)
- [x] GREEN: Implement `src/hooks/useCategories.ts`
- [x] RED: Test `useProducts` — mock supabase, returns products for categoryId
- [x] GREEN: Implement `src/hooks/useProducts.ts`
- [x] RED: Test `useSellers` — mock supabase, returns sellers list
- [x] GREEN: Implement `src/hooks/useSellers.ts`
- [x] RED: Test `useRecordSale` — mock supabase insert, verify payload
- [x] GREEN: Implement `src/hooks/useRecordSale.ts`
- [x] YELLOW: Review all hooks, ensure consistent error/loading pattern
- [x] Commit: "feat: add data hooks for categories, products, sellers, and sales"

### Step 5: UI Components — BreadcrumbNav + CategoryGrid

- [ ] RED: Test `BreadcrumbNav` — renders path segments, clicking calls onNavigate
- [ ] GREEN: Implement `src/components/BreadcrumbNav.tsx` + CSS module
- [ ] RED: Test `CategoryGrid` — renders items as buttons, products show price, clicking calls onSelect
- [ ] GREEN: Implement `src/components/CategoryGrid.tsx` + CSS module (large tap-friendly grid)
- [ ] YELLOW: Refine styles
- [ ] Commit: "feat: add BreadcrumbNav and CategoryGrid components"

### Step 6: UI Components — SaleForm + SaleConfirmation

- [ ] RED: Test `SaleForm` — quantity stepper, payment method radios, submit with correct payload
- [ ] GREEN: Implement `src/components/SaleForm.tsx` + CSS module
- [ ] RED: Test `SaleConfirmation` — renders summary, calls onDone
- [ ] GREEN: Implement `src/components/SaleConfirmation.tsx` + CSS module
- [ ] YELLOW: Polish form UX
- [ ] Commit: "feat: add SaleForm and SaleConfirmation components"

### Step 7: SalesPage + App Assembly

- [ ] RED: Test `SalesPage` — state transitions: BROWSING→drill down→select product→SALE_FORM→confirm→CONFIRMED→back to root
- [ ] GREEN: Implement `src/pages/SalesPage.tsx` with state machine (useState/useReducer)
- [ ] Wire up `App.tsx`: seller dropdown (persisted in localStorage) + SalesPage
- [ ] YELLOW: Refactor state management if needed
- [ ] Basic responsive CSS for tablet use at merch stand
- [ ] Commit: "feat: assemble full app with SalesPage and seller selection"

### Step 8: Seed Script + Data

- [ ] Create `src/data/products.seed.json` with sample product tree
- [ ] Create `scripts/seed.ts` — reads JSON, recursively inserts categories + products via service_role key
- [ ] Run seed script, verify data in Supabase dashboard
- [ ] Commit: "feat: add product seed data and seed script"

### Step 9: E2E Tests

- [ ] Configure `playwright.config.ts` (base URL, webServer to start Vite)
- [ ] Install Playwright browsers
- [ ] Write `e2e/sales-flow.spec.ts`: navigate tree → record sale → verify confirmation
- [ ] Run and iterate
- [ ] Commit: "test: add Playwright e2e tests for sales flow"

### Step 10: Polish

- [ ] Error handling UI (toast/banner on network errors)
- [ ] Loading states for data fetches
- [ ] Final responsive CSS pass
- [ ] Full test run: unit + e2e
- [ ] Commit: "chore: polish UI, add loading/error states"

### Step 11: GitHub Pages Deployment

- [ ] Set `base: '/merch-register-app/'` in vite.config.ts
- [ ] Create `.github/workflows/deploy.yml` — GitHub Actions workflow:
  - Trigger on push to main
  - Install deps, build (`npm run build`)
  - Deploy `dist/` to GitHub Pages using `actions/deploy-pages`
- [ ] Enable GitHub Pages in repo settings (source: GitHub Actions)
- [ ] Push and verify the site is live at `https://jjscout.github.io/merch-register-app/`
- [ ] Commit: "ci: add GitHub Pages deployment workflow"

---

## Prerequisites

**Before Step 7** (not needed for Steps 1-6, which use mocked Supabase in tests):

1. Create Supabase account at supabase.com (free tier)
2. Create a new project, run the migration SQL from Step 2 in the SQL Editor
3. Note the **Project URL** and **anon key** (Settings → API) → put in `.env`
4. Note the **service_role key** (for Step 8 seed script only, never commit)

**Before Step 11**: 5. Enable GitHub Pages in repo settings (source: GitHub Actions)

---

## Key Architecture Notes

- **Product tree**: Adjacency list (parent_id) in `categories` table. Shallow tree (3-4 levels). Fetch one level at a time as user drills down.
- **Prices in cents**: Integer math, convert at display boundary only (`formatCents`).
- **unit_price_cents on sales**: Snapshot of price at sale time — historical sales stay accurate if prices change.
- **No state library**: useState/useReducer in SalesPage is sufficient.
- **Seller**: Dropdown at top of page, persists in localStorage. No auth system.
- **Pre-commit**: `vitest related --run` runs only tests for changed files (fast).

## Project Structure

```
merch-register-app/
├── .husky/pre-commit
├── e2e/sales-flow.spec.ts
├── scripts/seed.ts
├── src/
│   ├── components/  (BreadcrumbNav, CategoryGrid, SaleForm, SaleConfirmation + tests + CSS modules)
│   ├── data/products.seed.json
│   ├── hooks/       (useCategories, useProducts, useSellers, useRecordSale + tests)
│   ├── lib/         (supabase.ts, types.ts, format.ts + test)
│   ├── pages/       (SalesPage.tsx + test)
│   ├── App.tsx, main.tsx, index.css
├── supabase/migrations/001_initial_schema.sql
├── .env.example, eslint.config.js, .prettierrc, vite.config.ts, vitest.config.ts, playwright.config.ts
└── package.json
```
