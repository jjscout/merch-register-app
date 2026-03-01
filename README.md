# Merch Register App

A lightweight point-of-sale app for tracking merchandise sales at events. Sellers navigate a product tree (e.g. T-Shirts -> Men -> Tank -> Size L), record a sale with quantity and payment method, and the transaction is stored in Supabase.

Built for tablet use at a merch stand with large tap-friendly buttons and minimal friction.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL free tier) with Row Level Security
- **Styling:** CSS Modules
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Deployment:** GitHub Pages via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Setup

1. **Clone and install:**

   ```bash
   git clone https://github.com/jjscout/merch-register-app.git
   cd merch-register-app
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Open the **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
   - Go to **Settings > API** and note your **Project URL**, **anon key**, and **service_role key**

3. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Fill in the values:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Seed the database:**

   ```bash
   npm run seed
   ```

5. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:5173/merch-register-app/`.

> **Note:** The app works without Supabase configured — it shows setup instructions instead of crashing.

## Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Start dev server                       |
| `npm run build`      | Type-check and build for production    |
| `npm run lint`       | Run ESLint                             |
| `npm test`           | Run unit tests                         |
| `npm run test:watch` | Run unit tests in watch mode           |
| `npm run test:e2e`   | Run Playwright e2e tests               |
| `npm run seed`       | Seed Supabase with sample product data |

## How It Works

1. **Select a seller** from the dropdown (persisted in localStorage)
2. **Navigate the product tree** by tapping categories to drill down
3. **Pick a product** to open the sale form
4. **Set quantity and payment method** (cash, card, or other)
5. **Confirm the sale** — it's recorded in Supabase with a snapshot of the current price

Product data is organized as a category tree (adjacency list). Prices are stored in integer cents to avoid floating-point issues.

## Project Structure

```
src/
├── components/   # BreadcrumbNav, CategoryGrid, SaleForm, SaleConfirmation
├── hooks/        # useCategories, useProducts, useSellers, useRecordSale
├── lib/          # Supabase client, TypeScript types, formatCents utility
├── pages/        # SalesPage (state machine: BROWSING → SALE_FORM → CONFIRMED)
└── data/         # products.seed.json

supabase/migrations/  # Database schema
scripts/              # Seed script
e2e/                  # Playwright tests
```

## Deployment

The app deploys to GitHub Pages automatically on push to `main` via GitHub Actions.

To set up deployment:

1. Go to your repo **Settings > Pages**
2. Set source to **GitHub Actions**
3. Push to `main`

Live at: `https://jjscout.github.io/merch-register-app/`
