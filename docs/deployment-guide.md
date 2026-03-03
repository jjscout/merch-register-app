# Deployment Guide — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Deployment Target

**GitHub Pages** — static site hosting, no server infrastructure required.

## Build Process

```bash
npm run build
# 1. TypeScript check: tsc -b
# 2. Vite production build → dist/
```

Output goes to `dist/` directory containing minified JS/CSS bundles and static assets.

## Vite Configuration

| Setting | Value                  | Purpose                                       |
| ------- | ---------------------- | --------------------------------------------- |
| `base`  | `/merch-register-app/` | GitHub Pages subpath                          |
| Router  | `HashRouter`           | Client-side SPA routing without server config |

Hash-based routing (`/#/dashboard`) avoids the need for server-side URL rewriting on GitHub Pages.

## GitHub Actions Pipeline

**File**: `.github/workflows/deploy.yml.disabled` (currently disabled)

When enabled, the pipeline runs on push to `main`:

```
push to main
  → checkout code
  → setup Node 20
  → npm ci
  → npm run lint        (ESLint check)
  → npm test            (Unit tests)
  → npm run build       (TypeScript + Vite, with Supabase secrets)
  → upload pages artifact
  → deploy to GitHub Pages
```

### Required GitHub Secrets

| Secret                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase project URL (injected at build time) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (injected at build time)    |

### Re-enabling Deployment

```bash
# Rename workflow file to re-enable
mv .github/workflows/deploy.yml.disabled .github/workflows/deploy.yml

# Ensure GitHub Pages is configured:
# Settings → Pages → Source: GitHub Actions
```

### Required Repository Settings

- **Pages source**: GitHub Actions (not branch-based)
- **Permissions**: Workflow needs `contents: read`, `pages: write`, `id-token: write`

## Supabase Infrastructure

The app depends on a Supabase project with:

1. **PostgreSQL database** with 5 tables (sellers, categories, products, sales, events)
2. **Row Level Security** enabled on all tables
3. **Anon key** for public client access
4. **Service role key** for admin seed operations only

### Database Setup for New Deployment

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Apply migrations in order via SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_events_pins_admin.sql`
   - `supabase/migrations/002_quantity_cap.sql`
3. Copy project URL and anon key to environment/secrets
4. Optionally seed with `npm run seed` (requires service role key)

## Security Considerations

| Area         | Status               | Notes                                                               |
| ------------ | -------------------- | ------------------------------------------------------------------- |
| Admin access | Client-side PIN only | Acceptable for trusted kiosk; needs server-side auth for public use |
| RLS policies | Enabled              | Anon role has full CRUD on admin tables after migration 002         |
| Secrets      | Build-time injection | Supabase keys embedded in JS bundle (anon key is public by design)  |
| HTTPS        | GitHub Pages default | Automatic SSL via GitHub                                            |

## Environment Matrix

| Environment | URL                                    | Supabase     | Notes          |
| ----------- | -------------------------------------- | ------------ | -------------- |
| Development | `localhost:5173/merch-register-app/`   | Dev project  | `.env` file    |
| Production  | `<user>.github.io/merch-register-app/` | Prod project | GitHub Secrets |
