# Merch Register App — Documentation Index

> Generated: 2026-03-03 | Scan: Exhaustive | Mode: Initial Scan

## Project Overview

- **Type:** Monolith web application
- **Primary Language:** TypeScript
- **Architecture:** Component-based SPA with state machine navigation

## Quick Reference

- **Tech Stack:** React 19 + TypeScript 5.9 + Vite 7 + Supabase (PostgreSQL) + CSS Modules
- **Entry Point:** `src/main.tsx` → `src/App.tsx`
- **Architecture Pattern:** SPA with `useReducer` state machine (4 phases), custom data hooks, hash-based routing
- **Database:** 5 tables (sellers, categories, products, sales, events) with RLS
- **Deployment:** GitHub Pages (static site, CI/CD currently disabled)

## Generated Documentation

- [Project Overview](./project-overview.md) — Purpose, features, repository structure, getting started
- [Architecture](./architecture.md) — System design, layers, state machine, data flow, security model
- [Data Models](./data-models.md) — Database schema, table definitions, relationships, migrations
- [API Contracts](./api-contracts.md) — Supabase hooks API surface, query patterns, RLS policies
- [Component Inventory](./component-inventory.md) — All 23 UI components with props, hierarchy, design patterns
- [Comprehensive Analysis](./comprehensive-analysis.md) — State management, configuration, auth, entry points, testing, theme
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree, critical folders, file statistics
- [Development Guide](./development-guide.md) — Prerequisites, scripts, code quality, testing, conventions, dependencies
- [Deployment Guide](./deployment-guide.md) — GitHub Pages, CI/CD pipeline, Supabase setup, security considerations

## Existing Project Files

- [CLAUDE.md](../CLAUDE.md) — AI assistant instructions and project conventions
- [README.md](../README.md) — Project readme
- [PLAN.md](../PLAN.md) — Project planning notes
- [.env.example](../.env.example) — Environment variable template

## Getting Started

```bash
git clone <repo-url> && cd merch-register-app
npm install
cp .env.example .env   # Add Supabase credentials
npm run dev             # http://localhost:5173/merch-register-app/
```

**Key commands:** `npm run dev` (dev server), `npm run build` (production), `npm test` (unit tests), `npm run test:e2e` (E2E tests), `npm run seed` (database seeder).

## For AI-Assisted Development

When creating a brownfield PRD or planning new features, point to this index as the primary context source. Key documents by use case:

| Planning Task        | Start With                                                                              |
| -------------------- | --------------------------------------------------------------------------------------- |
| New UI feature       | [Architecture](./architecture.md) + [Component Inventory](./component-inventory.md)     |
| Database changes     | [Data Models](./data-models.md) + [API Contracts](./api-contracts.md)                   |
| State/flow changes   | [Comprehensive Analysis](./comprehensive-analysis.md) (state management section)        |
| New hook or API call | [API Contracts](./api-contracts.md)                                                     |
| Build/deploy changes | [Development Guide](./development-guide.md) + [Deployment Guide](./deployment-guide.md) |
| Full context         | [Project Overview](./project-overview.md) + [Architecture](./architecture.md)           |
