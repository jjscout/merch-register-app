# Architecture — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Executive Summary

Merch Register App is a **tablet-first point-of-sale (POS) kiosk** for merchandise sales at events. Built as a single-page application with React 19, it uses Supabase (PostgreSQL) as its backend-as-a-service — there are no custom API endpoints or server-side code. The app is deployed as a static site to GitHub Pages.

The architecture prioritizes **simplicity and offline-readiness**: no state management library, no routing complexity beyond hash-based navigation, and all business logic contained in a single `useReducer` state machine. Data access is fully isolated into custom hooks.

## Architecture Pattern

**Component-based SPA with state machine navigation**

| Pattern            | Implementation                                              |
| ------------------ | ----------------------------------------------------------- |
| Architecture style | Single Page Application (SPA)                               |
| UI framework       | React 19 with functional components                         |
| State management   | Local state only (`useState`, `useReducer`, `localStorage`) |
| Data layer         | Custom hooks wrapping Supabase JS client                    |
| Styling            | CSS Modules (scoped, no utility framework)                  |
| Routing            | React Router v7 with `HashRouter` (3 top-level routes)      |
| Backend            | Supabase (PostgreSQL + PostgREST auto-generated API)        |
| Auth model         | Client-side PIN gates (seller + admin)                      |
| Deployment         | Static site on GitHub Pages                                 |

## Technology Stack

| Category     | Technology               | Version    | Justification                          |
| ------------ | ------------------------ | ---------- | -------------------------------------- |
| Language     | TypeScript               | 5.9        | Type safety, strict mode               |
| UI Framework | React                    | 19.2       | Component model, hooks ecosystem       |
| Build Tool   | Vite                     | 7.3        | Fast HMR, ESM-native bundling          |
| Routing      | react-router-dom         | 7.13       | Hash routing for static hosting        |
| Database     | Supabase (PostgreSQL)    | 2.49       | BaaS with RLS, real-time capable       |
| Styling      | CSS Modules              | —          | Scoped styles without build complexity |
| Unit Tests   | Vitest + Testing Library | 3.2 / 16.3 | Fast, Vite-native, React-aware         |
| E2E Tests    | Playwright               | 1.52       | Chromium-based, auto-starts dev server |
| Linting      | ESLint + Prettier        | 9.39 / 3.5 | Flat config, consistent formatting     |
| Git Hooks    | Husky + lint-staged      | 9.1 / 16.1 | Pre-commit quality enforcement         |

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Tablet)                   │
│                                                     │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  SalesRoute  │  │Dashboard │  │  AdminPage   │  │
│  │  (PIN gate)  │  │  Page    │  │  (PIN gate)  │  │
│  │      ↓       │  │          │  │      ↓       │  │
│  │  SalesPage   │  │  Event   │  │  CRUD Panels │  │
│  │  (state      │  │  sales   │  │  (Events,    │  │
│  │   machine)   │  │  stats   │  │   Sellers,   │  │
│  │              │  │          │  │   Categories,│  │
│  │  BROWSING    │  │          │  │   Products)  │  │
│  │  → CART      │  │          │  │              │  │
│  │  → CHECKOUT  │  │          │  │              │  │
│  │  → CONFIRMED │  │          │  │              │  │
│  └──────┬───────┘  └────┬─────┘  └──────┬───────┘  │
│         │               │               │          │
│  ┌──────┴───────────────┴───────────────┴───────┐  │
│  │              Custom Hooks (src/hooks/)         │  │
│  │  useCategories, useProducts, useRecordCart,    │  │
│  │  useActiveEvent, useSellerByPin, useEvents,    │  │
│  │  useEventSales, useAdmin*                      │  │
│  └──────────────────────┬────────────────────────┘  │
│                         │                           │
│  ┌──────────────────────┴────────────────────────┐  │
│  │        Supabase JS Client (src/lib/)           │  │
│  │  supabase.ts + types.ts + format.ts            │  │
│  └──────────────────────┬────────────────────────┘  │
└─────────────────────────┼───────────────────────────┘
                          │ HTTPS (PostgREST)
                          ▼
              ┌───────────────────────┐
              │   Supabase Cloud      │
              │  ┌─────────────────┐  │
              │  │   PostgreSQL    │  │
              │  │  ┌───────────┐  │  │
              │  │  │ sellers   │  │  │
              │  │  │ categories│  │  │
              │  │  │ products  │  │  │
              │  │  │ sales     │  │  │
              │  │  │ events    │  │  │
              │  │  └───────────┘  │  │
              │  │  RLS Enabled    │  │
              │  └─────────────────┘  │
              └───────────────────────┘
```

## Data Architecture

### Database Schema (5 tables)

```
events 1──∞ sales ∞──1 products ∞──1 categories
                  ∞──1 sellers          │ parent_id (self-ref)
                                        ↓
                                   categories
```

See [Data Models](./data-models.md) for full table definitions and migration history.

### Key Design Decisions

| Decision                           | Rationale                                        |
| ---------------------------------- | ------------------------------------------------ |
| Prices in integer cents            | Avoids floating-point precision issues           |
| Snapshot pricing on sales          | Decouples sale record from product price changes |
| Adjacency-list categories          | Simple tree model, fetched one level at a time   |
| Soft-delete products (active flag) | Preserves sales history while hiding products    |
| Batch cart insert                  | Single Supabase call for multi-item checkout     |

## Application Layers

### 1. Entry & Routing Layer

```
index.html → main.tsx → App.tsx (Routes)
                          └── AppLayout (Header + NavBar + Outlet)
                              ├── / → SalesRoute
                              ├── /dashboard → DashboardPage
                              └── /admin/* → AdminPage
```

- `HashRouter` for GitHub Pages compatibility
- `AppLayout` wraps all routes with header, navigation, and theme toggle
- Three top-level sections: Sales, Dashboard, Admin

### 2. Page Layer (`src/pages/`)

| Page            | Responsibility                                                                 |
| --------------- | ------------------------------------------------------------------------------ |
| `SalesRoute`    | Seller PIN authentication gate + active event check → delegates to `SalesPage` |
| `SalesPage`     | Core sales state machine (4 phases, 13 actions via `useReducer`)               |
| `DashboardPage` | Event sales analytics with `useMemo` aggregations                              |
| `AdminPage`     | Admin PIN gate + sub-routed CRUD panels                                        |

### 3. Component Layer (`src/components/`)

23 components organized by function. See [Component Inventory](./component-inventory.md) for full catalog.

Key component groups:

- **Layout**: AppLayout, NavBar, ThemeToggle
- **Auth gates**: AdminPinGate, SellerPinLogin
- **Sales flow**: BreadcrumbNav, CategoryGrid, ProductPicker, CartBar, CartReview, CartCheckout, SaleConfirmation
- **Admin CRUD**: EventsAdmin, SellersAdmin, CategoriesAdmin, ProductsAdmin

### 4. Data Layer (`src/hooks/`)

All Supabase queries are isolated into custom hooks returning `{ data, loading, error }`. No component directly imports the Supabase client.

| Category   | Hooks                                                                            | Count |
| ---------- | -------------------------------------------------------------------------------- | ----- |
| Read-only  | useCategories, useProducts, useSellers, useActiveEvent, useEvents, useEventSales | 6     |
| Mutations  | useRecordSale, useRecordCart, useSellerByPin                                     | 3     |
| Admin CRUD | useAdminEvents, useAdminSellers, useAdminCategories, useAdminProducts            | 4     |
| UI         | useTheme                                                                         | 1     |

See [API Contracts](./api-contracts.md) for full hook API surface.

### 5. Shared Library (`src/lib/`)

| Module        | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `supabase.ts` | Client initialization with graceful fallback if unconfigured |
| `types.ts`    | TypeScript interfaces mirroring database schema              |
| `format.ts`   | `formatCents()` and `cartTotalCents()` utilities             |

## State Machine (Sales Flow)

The core business logic is a `useReducer` state machine in `SalesPage.tsx`:

```
BROWSING ──────► CART_REVIEW ──────► CHECKOUT ──────► CONFIRMED
    ▲               │                    │                │
    │          CLOSE_CART            BACK_TO_CART          │
    │               │                    │                │
    └───────────────┘                    └────────────────┘
                                                     DONE (reset)
```

| Phase       | User Actions                                        | State Fields                                   |
| ----------- | --------------------------------------------------- | ---------------------------------------------- |
| BROWSING    | Drill into categories, select products, add to cart | path, currentCategoryId, cart, selectedProduct |
| CART_REVIEW | Update quantities, remove items                     | path, currentCategoryId, cart                  |
| CHECKOUT    | Select payment method, confirm                      | path, currentCategoryId, cart                  |
| CONFIRMED   | View receipt, start new sale                        | items, totalCents, paymentMethod               |

13 actions with phase guards — invalid transitions return current state unchanged.

## Authentication & Security

| Mechanism           | Implementation                                     | Scope                |
| ------------------- | -------------------------------------------------- | -------------------- |
| Seller PIN          | Database lookup via `useSellerByPin` hook          | Sales access         |
| Admin PIN           | Client-side check against `VITE_ADMIN_PIN` env var | Admin CRUD access    |
| Session persistence | `localStorage` (seller ID + name)                  | Survives page reload |
| Database RLS        | Enabled on all tables; anon role has broad access  | Data layer           |

**Security note**: All write operations are accessible to the `anon` Supabase role. Admin PIN is a UX gate only. Acceptable for trusted-device kiosk use; would need server-side auth for public deployment.

## Testing Strategy

| Level | Tool                     | Scope                        | Location                  |
| ----- | ------------------------ | ---------------------------- | ------------------------- |
| Unit  | Vitest + Testing Library | Components, hooks, utilities | Co-located `*.test.ts(x)` |
| Type  | Vitest `expectTypeOf`    | Database type correctness    | `src/lib/types.test.ts`   |
| E2E   | Playwright (Chromium)    | Full user flows              | `e2e/` directory          |

Pre-commit hook runs `vitest related --run` on staged files for fast feedback.

## Deployment Architecture

```
Developer → git push main → GitHub Actions (disabled) → GitHub Pages
                              │
                              ├── npm run lint
                              ├── npm test
                              └── npm run build (with Supabase secrets)
                                   └── Static dist/ → GitHub Pages CDN
```

- Static SPA deployed to `<user>.github.io/merch-register-app/`
- Supabase credentials injected at build time via GitHub Secrets
- Hash routing eliminates need for server-side URL rewriting

## Cross-Cutting Concerns

| Concern              | Approach                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| Error handling       | Errors stored in hook state, displayed inline, never thrown                    |
| Loading states       | `loading` boolean per hook, disables UI during fetch                           |
| Race conditions      | `cancelled` flag in `useEffect` cleanup                                        |
| Theme                | System preference detection + manual toggle, FOUC prevention via inline script |
| Accessibility        | Semantic HTML, large tap targets for tablet, `inputMode="numeric"` for PINs    |
| Graceful degradation | App shows setup instructions if Supabase credentials are missing               |
