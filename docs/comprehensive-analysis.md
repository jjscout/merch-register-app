# Comprehensive Analysis — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## State Management

### Approach

No external state library (Redux, Zustand, etc.). All state is local:

- **`useState`** — Simple form inputs, toggles, selections
- **`useReducer`** — Complex multi-phase state machine (SalesPage)
- **`localStorage`** — Session persistence (seller ID/name, theme preference)

### State Machine (SalesPage.tsx)

The core sales flow uses a discriminated union state machine with 4 phases:

```
BROWSING ──> CART_REVIEW ──> CHECKOUT ──> CONFIRMED ──> (reset to BROWSING)
```

**Phases & State:**

| Phase         | State Fields                                               | Description                               |
| ------------- | ---------------------------------------------------------- | ----------------------------------------- |
| `BROWSING`    | `path[]`, `currentCategoryId`, `cart[]`, `selectedProduct` | Category navigation and product selection |
| `CART_REVIEW` | `path[]`, `currentCategoryId`, `cart[]`                    | Review and modify cart items              |
| `CHECKOUT`    | `path[]`, `currentCategoryId`, `cart[]`                    | Payment method selection and confirmation |
| `CONFIRMED`   | `items[]`, `totalCents`, `paymentMethod`                   | Success display                           |

**Actions (13 total):** DRILL_DOWN, NAVIGATE_TO, SELECT_PRODUCT, DISMISS_PICKER, ADD_TO_CART, OPEN_CART, CLOSE_CART, UPDATE_CART_ITEM, REMOVE_CART_ITEM, PROCEED_TO_CHECKOUT, BACK_TO_CART, CHECKOUT_COMPLETE, DONE

Each action includes a phase guard — invalid transitions return current state unchanged.

### localStorage Keys

| Key                          | Type                          | Scope                      |
| ---------------------------- | ----------------------------- | -------------------------- |
| `merch-register-seller-id`   | string                        | Seller session persistence |
| `merch-register-seller-name` | string                        | Seller display name        |
| `merch-register-theme`       | 'light' \| 'dark' \| 'system' | Theme preference           |

### Data Hooks Pattern

All hooks in `src/hooks/` follow a consistent pattern:

- Return `{ data, loading, error }`
- Use `useEffect` with cancellation token to prevent race conditions
- Conditional fetching based on parameters

| Hook                      | Parameters       | Returns                                                              |
| ------------------------- | ---------------- | -------------------------------------------------------------------- |
| `useCategories(parentId)` | `string \| null` | `{ categories, loading, error }`                                     |
| `useProducts(categoryId)` | `string \| null` | `{ products, loading, error }`                                       |
| `useActiveEvent()`        | None             | `{ event, loading, error }`                                          |
| `useSellerByPin()`        | None             | `{ lookupByPin(pin), loading, error }`                               |
| `useRecordCart()`         | None             | `{ recordCart(payload), loading, error }`                            |
| `useEvents()`             | None             | `{ events, loading, error }`                                         |
| `useEventSales(eventId)`  | `string \| null` | `{ sales, loading, error }`                                          |
| `useTheme()`              | None             | `{ theme, resolvedTheme, toggleTheme }`                              |
| `useAdminEvents()`        | None             | `{ events, loading, error, add*, update*, delete*, toggleActive }`   |
| `useAdminSellers()`       | None             | `{ sellers, loading, error, add*, delete* }`                         |
| `useAdminCategories()`    | None             | `{ categories, loading, error, add*, delete* }`                      |
| `useAdminProducts()`      | None             | `{ products, loading, error, add*, update*, delete*, toggleActive }` |

---

## Configuration

### Environment Variables

```
VITE_SUPABASE_URL        # Supabase project URL
VITE_SUPABASE_ANON_KEY   # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY # Service role key (seed script only)
VITE_ADMIN_PIN           # Admin PIN (default: 0000)
```

### Build Tooling

| Tool            | Config File            | Purpose                                                                  |
| --------------- | ---------------------- | ------------------------------------------------------------------------ |
| Vite 7          | `vite.config.ts`       | Dev server (port 5173), production bundler, base: `/merch-register-app/` |
| TypeScript 5.9  | `tsconfig.app.json`    | Strict mode, `noUnusedLocals`, `noUnusedParameters`                      |
| ESLint          | `eslint.config.js`     | Flat config, TS + React Hooks + Prettier                                 |
| Prettier        | `.prettierrc`          | Semicolons, single quotes, trailing commas, 80 char, 2-space indent      |
| Vitest 3.2      | `vitest.config.ts`     | jsdom environment, global setup, CSS support                             |
| Playwright 1.52 | `playwright.config.ts` | Chromium only, auto-starts dev server                                    |
| Husky           | `.husky/pre-commit`    | Pre-commit hooks                                                         |
| lint-staged     | `package.json`         | Runs eslint --fix, prettier --write, vitest related on staged .ts/.tsx   |

### Package.json Scripts

| Script       | Command                               | Purpose                             |
| ------------ | ------------------------------------- | ----------------------------------- |
| `dev`        | `vite`                                | Dev server on port 5173             |
| `build`      | `tsc -b && vite build`                | TypeScript check + production build |
| `lint`       | `eslint .`                            | Lint all files                      |
| `test`       | `vitest run`                          | Single unit test run                |
| `test:watch` | `vitest`                              | Watch mode tests                    |
| `test:e2e`   | `playwright test`                     | E2E tests with auto dev server      |
| `seed`       | `tsx --env-file=.env scripts/seed.ts` | Populate Supabase                   |
| `prepare`    | `husky`                               | Git hooks setup                     |

---

## Authentication & Security

### Admin PIN Gate

- PIN stored in `VITE_ADMIN_PIN` env var (default: `"0000"`)
- Client-side only check in `AdminPage.tsx`
- Session state in component (resets on page reload)
- `AdminPinGate` component: password input with `inputMode="numeric"`

### Seller PIN Login

- Sellers have optional `pin` column in database
- `useSellerByPin()` hook queries: `.from('sellers').select('*').eq('pin', pin).single()`
- On success: seller ID and name persisted to localStorage
- Session survives page reload via localStorage recovery in `SalesRoute.tsx`
- "Change Seller" button clears localStorage and forces re-auth

### Database Row Level Security

**After migration 002 (current state):**

| Table        | anon SELECT | anon INSERT | anon UPDATE | anon DELETE |
| ------------ | ----------- | ----------- | ----------- | ----------- |
| `events`     | Yes         | Yes         | Yes         | Yes         |
| `sellers`    | Yes         | Yes         | Yes         | Yes         |
| `categories` | Yes         | Yes         | Yes         | Yes         |
| `products`   | Yes         | Yes         | Yes         | Yes         |
| `sales`      | Yes         | Yes         | No          | No          |

> **Security note**: Admin write operations are protected only by client-side PIN check. RLS policies allow full CRUD for anon role. Acceptable for trusted-device kiosk deployment but needs server-side auth for public-facing use.

---

## Entry Points

### HTML Entry (`index.html`)

- Single `<div id="root">` for React mounting
- Inline theme initialization script in `<head>` to prevent FOUC:
  - Reads localStorage theme preference
  - Falls back to system preference via `matchMedia`
  - Sets `data-theme` attribute on `<html>` before React hydrates

### React Entry (`src/main.tsx`)

```
StrictMode → HashRouter → App
```

- **Hash-based routing** (`HashRouter`) for GitHub Pages compatibility (no server-side routing)
- `StrictMode` enabled for development checks

### App Router (`src/App.tsx`)

```
Routes
  └── AppLayout (layout wrapper)
      ├── / (index) → SalesRoute
      ├── /dashboard → DashboardPage
      └── /admin/* → AdminPage (with sub-routes)
```

---

## CI/CD

### GitHub Actions (`.github/workflows/deploy.yml.disabled`)

**Status: DISABLED** (file renamed to `.disabled`)

Pipeline when active:

1. `npm ci` — Install dependencies
2. `npm run lint` — ESLint check
3. `npm test` — Unit tests
4. `npm run build` — TypeScript + Vite build (with Supabase secrets)
5. Upload pages artifact
6. Deploy to GitHub Pages

**Required secrets:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## Shared Code (`src/lib/`)

### `supabase.ts` — Supabase Client

- Graceful degradation: checks if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Exports `isSupabaseConfigured` flag
- If unconfigured: app shows setup instructions instead of crashing
- Typed with `Database` generic from `types.ts`

### `types.ts` — Database Types

Manually maintained TypeScript types mirroring database schema:

- `Category`, `Product`, `Seller`, `MerchEvent`, `Sale`, `CartItem`, `PaymentMethod`
- `Database` interface for typed Supabase client (Row, Insert, Update per table)

### `format.ts` — Formatting Utilities

- `formatCents(cents: number): string` — Converts integer cents to `$XX.XX` display
- `cartTotalCents(cart: CartItem[]): number` — Sums cart total in cents

---

## Testing

### Unit Tests (Vitest + Testing Library)

- Co-located with source: `*.test.ts(x)` files
- Setup: `src/test-setup.ts` imports `@testing-library/jest-dom/vitest` matchers
- User interactions via `@testing-library/user-event`
- Supabase client mocked in component tests
- Type tests in `src/lib/types.test.ts` using `expectTypeOf`

### E2E Tests (Playwright)

- Directory: `e2e/`
- Chromium only
- Auto-starts Vite dev server on `http://localhost:5173/merch-register-app/`
- Parallel execution, retries in CI

---

## Theme System

- Three-state toggle: system -> light -> dark -> system
- `useTheme()` hook manages preference
- OS detection via `window.matchMedia('(prefers-color-scheme: dark)')`
- Listens for system preference changes
- Applied via `data-theme` attribute on `<html>` element
- FOUC prevention: inline script in `index.html` sets theme before React renders
