# Project Overview — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Purpose

Merch Register App is a **tablet-first point-of-sale (POS) system** for recording merchandise sales at events. Sellers authenticate via PIN, browse a category tree of products, build a multi-item cart, select a payment method, and record the sale to a Supabase database. An admin panel manages events, sellers, categories, and products. A dashboard provides per-event sales analytics.

## Quick Reference

| Property             | Value                                             |
| -------------------- | ------------------------------------------------- |
| **Type**             | Monolith web application                          |
| **Primary Language** | TypeScript                                        |
| **Framework**        | React 19                                          |
| **Build Tool**       | Vite 7                                            |
| **Backend**          | Supabase (PostgreSQL + PostgREST)                 |
| **Styling**          | CSS Modules                                       |
| **Routing**          | react-router-dom v7 (HashRouter)                  |
| **State Management** | Local only (useState, useReducer, localStorage)   |
| **Architecture**     | Component-based SPA with state machine navigation |
| **Entry Point**      | `src/main.tsx`                                    |
| **Deployment**       | GitHub Pages (static site)                        |

## Key Features

1. **Sales Flow** — State machine (BROWSING → CART_REVIEW → CHECKOUT → CONFIRMED) with category drill-down, multi-item cart, and batch checkout
2. **Seller PIN Auth** — Sellers log in with numeric PIN, session persisted in localStorage
3. **Admin Panel** — PIN-gated CRUD for events, sellers, categories, and products
4. **Dashboard** — Per-event sales analytics with revenue summaries by product, seller, and payment method
5. **Dark Mode** — System preference detection + manual toggle with FOUC prevention
6. **Graceful Fallback** — Shows setup instructions if Supabase credentials are missing

## Repository Structure

```
merch-register-app/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Route definitions
│   ├── lib/                  # Shared: Supabase client, types, formatters
│   ├── hooks/                # 14 data hooks (all Supabase queries)
│   ├── components/           # 14 UI components + admin/ subdirectory
│   └── pages/                # 4 page components
├── supabase/migrations/      # 3 SQL migration files (5 tables)
├── e2e/                      # Playwright E2E tests
├── scripts/                  # Database seed script
└── docs/                     # Generated project documentation
```

## Database

5 tables with RLS enabled: `sellers`, `categories` (adjacency-list tree), `products`, `sales` (snapshot pricing), `events`.

## Documentation Index

| Document                                              | Description                                            |
| ----------------------------------------------------- | ------------------------------------------------------ |
| [Architecture](./architecture.md)                     | System design, layers, state machine, security model   |
| [Data Models](./data-models.md)                       | Database schema, tables, relationships, migrations     |
| [API Contracts](./api-contracts.md)                   | Supabase hooks API surface, RLS policies               |
| [Component Inventory](./component-inventory.md)       | All 23 UI components with props and hierarchy          |
| [Comprehensive Analysis](./comprehensive-analysis.md) | State management, config, auth, entry points, testing  |
| [Source Tree Analysis](./source-tree-analysis.md)     | Annotated directory tree, critical folders, file stats |
| [Development Guide](./development-guide.md)           | Prerequisites, scripts, testing, conventions           |
| [Deployment Guide](./deployment-guide.md)             | GitHub Pages, CI/CD, Supabase setup                    |

## Getting Started

```bash
git clone <repo-url> && cd merch-register-app
npm install
cp .env.example .env   # Add Supabase credentials
npm run dev             # http://localhost:5173/merch-register-app/
```

See [Development Guide](./development-guide.md) for full setup instructions.
