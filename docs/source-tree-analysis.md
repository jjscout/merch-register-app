# Source Tree Analysis — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Project Root

```
merch-register-app/
├── .env.example                    # Environment variable template
├── .github/
│   └── workflows/
│       └── deploy.yml.disabled     # GitHub Pages CI/CD (disabled)
├── .husky/
│   └── pre-commit                  # Git hooks: lint, format, test
├── .prettierrc                     # Prettier config (semicolons, single quotes, 80 char)
├── eslint.config.js                # ESLint flat config (TS + React Hooks + Prettier)
├── index.html                      # SPA entry — theme init script + <div id="root">
├── package.json                    # Dependencies, scripts, lint-staged config
├── playwright.config.ts            # Playwright E2E config (Chromium, auto dev server)
├── tsconfig.json                   # Root TS config (composite references)
├── tsconfig.app.json               # App TS config (strict, noUnused*)
├── tsconfig.node.json              # Node TS config (scripts)
├── vite.config.ts                  # Vite config (base: /merch-register-app/)
├── vitest.config.ts                # Vitest config (jsdom, global setup)
│
├── docs/                           # [OUTPUT] Generated project documentation
│   ├── api-contracts.md
│   ├── component-inventory.md
│   ├── comprehensive-analysis.md
│   ├── data-models.md
│   └── project-scan-report.json    # Workflow state file
│
├── e2e/                            # Playwright end-to-end tests
│   └── sales-flow.spec.ts          # Sales flow smoke test
│
├── scripts/
│   └── seed.ts                     # Database seeder (uses service role key)
│
├── src/                            # ★ APPLICATION SOURCE
│   ├── main.tsx                    # ★ ENTRY: StrictMode + HashRouter + App
│   ├── App.tsx                     # ★ ENTRY: Route definitions (/, /dashboard, /admin/*)
│   ├── App.module.css              # Root app styles
│   ├── App.test.tsx                # App component tests
│   ├── index.css                   # Global CSS (variables, reset, theme tokens)
│   ├── test-setup.ts               # Vitest setup (jest-dom matchers)
│   ├── vite-env.d.ts               # Vite type declarations
│   │
│   ├── lib/                        # Shared utilities and types
│   │   ├── supabase.ts             # Supabase client init + isSupabaseConfigured flag
│   │   ├── types.ts                # Database types (Category, Product, Seller, etc.)
│   │   ├── types.test.ts           # Type-level tests
│   │   ├── format.ts               # formatCents(), cartTotalCents()
│   │   └── format.test.ts          # Format utility tests
│   │
│   ├── hooks/                      # Data fetching hooks (all Supabase queries)
│   │   ├── useActiveEvent.ts       # Fetch current active event
│   │   ├── useCategories.ts        # Fetch categories by parent (drill-down)
│   │   ├── useProducts.ts          # Fetch products by category
│   │   ├── useSellers.ts           # Fetch all sellers
│   │   ├── useSellerByPin.ts       # Lookup seller by PIN
│   │   ├── useEvents.ts            # Fetch all events
│   │   ├── useEventSales.ts        # Fetch sales for event (with joins)
│   │   ├── useRecordSale.ts        # Insert single sale
│   │   ├── useRecordCart.ts         # Batch insert cart items
│   │   ├── useTheme.ts             # Theme preference (dark/light/system)
│   │   ├── useAdminEvents.ts       # CRUD: events
│   │   ├── useAdminSellers.ts      # CRUD: sellers
│   │   ├── useAdminCategories.ts   # CRUD: categories
│   │   ├── useAdminProducts.ts     # CRUD: products
│   │   └── *.test.ts               # Co-located tests for each hook
│   │
│   ├── data/
│   │   └── products.seed.json      # Seed data for categories/products
│   │
│   ├── components/                 # UI components (CSS Modules)
│   │   ├── AppLayout.tsx           # Layout: header + NavBar + ThemeToggle + Outlet
│   │   ├── NavBar.tsx              # Navigation: Sales, Dashboard, Admin
│   │   ├── ThemeToggle.tsx         # Theme cycle button (system/light/dark)
│   │   ├── AdminPinGate.tsx        # PIN entry gate for admin area
│   │   ├── SellerPinLogin.tsx      # PIN entry for seller authentication
│   │   ├── NoActiveEvent.tsx       # "No active event" message screen
│   │   ├── BreadcrumbNav.tsx       # Category breadcrumb trail
│   │   ├── CategoryGrid.tsx        # Category + product grid display
│   │   ├── SellerPicker.tsx        # Seller selection grid
│   │   ├── ProductPicker.tsx       # Product quantity modal
│   │   ├── CartBar.tsx             # Floating cart summary button
│   │   ├── CartReview.tsx          # Cart review modal
│   │   ├── CartCheckout.tsx        # Checkout with payment method
│   │   ├── SaleConfirmation.tsx    # Sale success screen
│   │   ├── *.module.css            # Scoped styles per component
│   │   ├── *.test.tsx              # Co-located tests per component
│   │   │
│   │   └── admin/                  # Admin management components
│   │       ├── Admin.module.css    # Shared admin styles
│   │       ├── EventsAdmin.tsx     # Event CRUD UI
│   │       ├── SellersAdmin.tsx    # Seller CRUD UI
│   │       ├── CategoriesAdmin.tsx # Category CRUD UI (with tree)
│   │       ├── ProductsAdmin.tsx   # Product CRUD UI (price in dollars → cents)
│   │       └── *.test.tsx          # Co-located admin tests
│   │
│   └── pages/                      # Route-level page components
│       ├── SalesRoute.tsx          # ★ Sales orchestrator: auth + event gate → SalesPage
│       ├── SalesPage.tsx           # ★ Core sales state machine (4 phases)
│       ├── DashboardPage.tsx       # Event sales analytics with summary cards + tables
│       ├── AdminPage.tsx           # Admin PIN gate + sub-route navigation
│       ├── *.module.css            # Scoped page styles
│       └── *.test.tsx              # Co-located page tests
│
└── supabase/
    └── migrations/                 # Database migration files
        ├── 001_initial_schema.sql  # sellers, categories, products, sales + RLS
        ├── 002_events_pins_admin.sql # events table, seller PINs, admin CRUD policies
        └── 002_quantity_cap.sql    # Sales quantity upper bound (999)
```

## Critical Folders

| Folder                  | Purpose                                   | Key Files                                                      |
| ----------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `src/`                  | All application source code               | `main.tsx` (entry), `App.tsx` (router)                         |
| `src/lib/`              | Shared utilities, types, Supabase client  | `supabase.ts`, `types.ts`, `format.ts`                         |
| `src/hooks/`            | All data fetching and mutation hooks      | 14 hooks isolating all Supabase queries                        |
| `src/components/`       | Reusable UI components with CSS Modules   | 14 components + CSS modules                                    |
| `src/components/admin/` | Admin CRUD management components          | 4 admin panels + shared CSS                                    |
| `src/pages/`            | Route-level page components               | `SalesRoute.tsx` (entry gate), `SalesPage.tsx` (state machine) |
| `supabase/migrations/`  | Database schema (PostgreSQL via Supabase) | 3 migration files defining 5 tables                            |
| `e2e/`                  | Playwright end-to-end tests               | `sales-flow.spec.ts`                                           |
| `scripts/`              | Dev/ops scripts                           | `seed.ts` (database seeder)                                    |

## Entry Points

| Entry         | File                                         | Description                                |
| ------------- | -------------------------------------------- | ------------------------------------------ |
| HTML          | `index.html`                                 | SPA shell with theme init script           |
| React         | `src/main.tsx`                               | StrictMode + HashRouter + App mount        |
| Router        | `src/App.tsx`                                | Route definitions with AppLayout wrapper   |
| Sales Flow    | `src/pages/SalesRoute.tsx`                   | Auth gate + event check → SalesPage        |
| State Machine | `src/pages/SalesPage.tsx`                    | Core business logic (BROWSING → CONFIRMED) |
| Database      | `supabase/migrations/001_initial_schema.sql` | Initial schema definition                  |
| Seed          | `scripts/seed.ts`                            | Database population script                 |

## File Statistics

| Category                            | Count |
| ----------------------------------- | ----- |
| TypeScript source (`.ts`/`.tsx`)    | 52    |
| Test files (`.test.ts`/`.test.tsx`) | 26    |
| CSS Modules (`.module.css`)         | 16    |
| SQL migrations                      | 3     |
| Config files                        | 9     |
| Total source files                  | ~110  |
