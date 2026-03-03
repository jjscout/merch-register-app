# Development Guide — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Prerequisites

| Requirement      | Version | Notes                           |
| ---------------- | ------- | ------------------------------- |
| Node.js          | 20+     | LTS recommended                 |
| npm              | 10+     | Comes with Node                 |
| Supabase project | —       | Free tier works for development |

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd merch-register-app
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run database migrations
# Apply in order via Supabase dashboard or CLI:
#   supabase/migrations/001_initial_schema.sql
#   supabase/migrations/002_events_pins_admin.sql
#   supabase/migrations/002_quantity_cap.sql

# 4. Seed database (optional)
npm run seed

# 5. Start dev server
npm run dev
# App available at http://localhost:5173/merch-register-app/
```

## Environment Variables

| Variable                    | Required  | Default | Description                                             |
| --------------------------- | --------- | ------- | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`         | Yes       | —       | Supabase project URL                                    |
| `VITE_SUPABASE_ANON_KEY`    | Yes       | —       | Supabase anon (public) key                              |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed only | —       | Service role key (bypasses RLS, used by `npm run seed`) |
| `VITE_ADMIN_PIN`            | No        | `0000`  | PIN for admin section access                            |

If `VITE_SUPABASE_URL` is unset, the app shows setup instructions instead of crashing.

## Scripts

| Command              | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `npm run dev`        | Vite dev server on port 5173 with HMR                                   |
| `npm run build`      | TypeScript check + Vite production build                                |
| `npm run preview`    | Preview production build locally                                        |
| `npm run lint`       | ESLint on all .ts/.tsx files                                            |
| `npm test`           | Vitest unit tests (single run)                                          |
| `npm run test:watch` | Vitest in watch mode                                                    |
| `npm run test:e2e`   | Playwright E2E tests (auto-starts dev server)                           |
| `npm run seed`       | Populate Supabase from seed data (requires `SUPABASE_SERVICE_ROLE_KEY`) |

## Code Quality

### Pre-commit Hooks (Husky + lint-staged)

On every commit, staged `.ts`/`.tsx` files are automatically:

1. `eslint --fix` — Auto-fix lint issues
2. `prettier --write` — Format code
3. `vitest related --run` — Run tests related to changed files

Staged `.json`/`.css`/`.md` files get `prettier --write` only.

### Style Rules

| Rule            | Setting                                             |
| --------------- | --------------------------------------------------- |
| Semicolons      | Required                                            |
| Quotes          | Single                                              |
| Trailing commas | All                                                 |
| Print width     | 80 characters                                       |
| Indentation     | 2 spaces                                            |
| TypeScript      | Strict mode, `noUnusedLocals`, `noUnusedParameters` |

## Testing

### Unit Tests (Vitest + Testing Library)

- **Location**: Co-located with source (`*.test.ts(x)`)
- **Environment**: jsdom
- **Setup**: `src/test-setup.ts` (imports jest-dom matchers)
- **Mocking**: Supabase client mocked in component/hook tests
- **User events**: `@testing-library/user-event` for realistic interactions

```bash
# Run all unit tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Run tests for specific file
npx vitest run src/components/CartBar.test.tsx
```

### E2E Tests (Playwright)

- **Location**: `e2e/` directory
- **Browser**: Chromium only
- **Dev server**: Auto-started on `http://localhost:5173/merch-register-app/`

```bash
# Run E2E tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui

# View last report
npx playwright show-report
```

## Project Conventions

### File Organization

- Components: `src/components/ComponentName.tsx` + `ComponentName.module.css` + `ComponentName.test.tsx`
- Admin components: `src/components/admin/` with shared `Admin.module.css`
- Pages: `src/pages/PageName.tsx` + `PageName.module.css` + `PageName.test.tsx`
- Hooks: `src/hooks/useHookName.ts` + `useHookName.test.ts`
- Shared code: `src/lib/` (types, utilities, Supabase client)

### Key Patterns

- **Prices**: Always integer cents internally (e.g., `2500` = $25.00). Use `formatCents()` at display boundary only.
- **Data hooks**: Return `{ data, loading, error }`. Isolate all Supabase queries in `src/hooks/`.
- **Styling**: CSS Modules only — no Tailwind, no styled-components.
- **Routing**: Hash-based (`HashRouter`) for GitHub Pages compatibility.
- **State**: No external state library. `useState`/`useReducer` only. Seller persisted in localStorage.

## Database

### Running Migrations

Migrations are in `supabase/migrations/` and should be applied in order:

1. `001_initial_schema.sql` — Core tables (sellers, categories, products, sales) with RLS
2. `002_events_pins_admin.sql` — Events table, seller PINs, admin CRUD RLS policies
3. `002_quantity_cap.sql` — Sales quantity upper bound (999)

### Seeding

```bash
# Requires SUPABASE_SERVICE_ROLE_KEY in .env
npm run seed
```

Seed data: `src/data/products.seed.json` — Categories and products for development/demo.

## Dependencies

### Production (4)

| Package                 | Version | Purpose                          |
| ----------------------- | ------- | -------------------------------- |
| `react`                 | ^19.2.0 | UI framework                     |
| `react-dom`             | ^19.2.0 | React DOM renderer               |
| `react-router-dom`      | ^7.13.1 | Client-side routing              |
| `@supabase/supabase-js` | ^2.49.4 | Supabase client (database, auth) |

### Key Dev Dependencies

| Package                  | Version | Purpose                           |
| ------------------------ | ------- | --------------------------------- |
| `typescript`             | ~5.9.3  | Type checking                     |
| `vite`                   | ^7.3.1  | Build tool + dev server           |
| `vitest`                 | ^3.2.1  | Unit test runner                  |
| `@playwright/test`       | ^1.52.0 | E2E test runner                   |
| `@testing-library/react` | ^16.3.0 | Component testing utilities       |
| `eslint`                 | ^9.39.1 | Linting                           |
| `prettier`               | ^3.5.3  | Code formatting                   |
| `husky`                  | ^9.1.7  | Git hooks                         |
| `lint-staged`            | ^16.1.0 | Pre-commit staged file processing |
