# Component Inventory — Merch Register App

> Generated: 2026-03-03 | Scan: Exhaustive

## Overview

All UI components live under `src/components/` with CSS Modules for scoped styling. The app has no component library or design system — all components are custom-built with large tap targets for tablet use. Admin components share a single `Admin.module.css`.

**Total Components:** 23 files (15 CSS Modules)

## Component Catalog

### Layout Components

| Component     | File                         | Props                                | Description                                                                          |
| ------------- | ---------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| `AppLayout`   | `components/AppLayout.tsx`   | None (uses Outlet)                   | Root layout: header with title, NavBar, ThemeToggle + `<Outlet>` for route content   |
| `NavBar`      | `components/NavBar.tsx`      | None                                 | Top navigation with NavLink to Sales (/), Dashboard (/dashboard), Admin (/admin)     |
| `ThemeToggle` | `components/ThemeToggle.tsx` | `theme`, `resolvedTheme`, `onToggle` | Theme toggle button displaying emoji icon based on current theme (light/dark/system) |

### Auth & Gate Components

| Component        | File                            | Props                         | Description                                                             |
| ---------------- | ------------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `AdminPinGate`   | `components/AdminPinGate.tsx`   | `correctPin`, `onUnlock`      | PIN entry form for admin access. Validates PIN, shows error on mismatch |
| `SellerPinLogin` | `components/SellerPinLogin.tsx` | `onLogin`, `loading`, `error` | PIN entry form for seller login. Shows loading state while checking     |

### Navigation Components

| Component       | File                           | Props                                                               | Description                                                                 |
| --------------- | ------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `BreadcrumbNav` | `components/BreadcrumbNav.tsx` | `path[]`, `onNavigate`                                              | Breadcrumb showing category path. Last item static, earlier items clickable |
| `CategoryGrid`  | `components/CategoryGrid.tsx`  | `categories[]`, `products[]`, `onSelectCategory`, `onSelectProduct` | Grid display showing categories (drill-down) and products (selection)       |

### Selection Components

| Component       | File                           | Props                                                   | Description                                                        |
| --------------- | ------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------ |
| `SellerPicker`  | `components/SellerPicker.tsx`  | `sellers[]`, `onSelect`                                 | Grid of seller buttons for selection                               |
| `ProductPicker` | `components/ProductPicker.tsx` | `product`, `existingQuantity`, `onAddToCart`, `onClose` | Modal overlay for selecting product quantity with stepper controls |

### Cart Components

| Component          | File                              | Props                                                                        | Description                                                              |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `CartBar`          | `components/CartBar.tsx`          | `cart[]`, `onOpenCart`                                                       | Floating button showing item count badge and total cart value            |
| `CartReview`       | `components/CartReview.tsx`       | `cart[]`, `onUpdateItem`, `onRemoveItem`, `onCheckout`, `onContinueShopping` | Modal showing full cart review with quantity steppers and remove buttons |
| `CartCheckout`     | `components/CartCheckout.tsx`     | `cart[]`, `onConfirm`, `onBack`, `loading`, `error`                          | Checkout screen with cart summary and payment method radio buttons       |
| `SaleConfirmation` | `components/SaleConfirmation.tsx` | `items[]`, `totalCents`, `paymentMethod`, `onDone`                           | Success screen after sale is recorded with "New Sale" button             |

### Informational Components

| Component       | File                           | Props    | Description                                                                |
| --------------- | ------------------------------ | -------- | -------------------------------------------------------------------------- |
| `NoActiveEvent` | `components/NoActiveEvent.tsx` | `error?` | Displayed when no active event exists. Shows icon, message, optional error |

### Admin Components

All admin components are under `src/components/admin/` and share `Admin.module.css`.

| Component         | File                        | Hooks Used                               | Description                                                                                 |
| ----------------- | --------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `EventsAdmin`     | `admin/EventsAdmin.tsx`     | `useAdminEvents`                         | Manage events: add (name, start/end datetime), list with active toggle and delete           |
| `SellersAdmin`    | `admin/SellersAdmin.tsx`    | `useAdminSellers`                        | Manage sellers: add (name + PIN), list with delete                                          |
| `CategoriesAdmin` | `admin/CategoriesAdmin.tsx` | `useAdminCategories`                     | Manage categories: add (with optional parent), nested list with delete                      |
| `ProductsAdmin`   | `admin/ProductsAdmin.tsx`   | `useAdminProducts`, `useAdminCategories` | Manage products: add (name, category, price in dollars), list with active toggle and delete |

### Page Components

| Component       | File                      | Key State                                         | Description                                                             |
| --------------- | ------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| `SalesRoute`    | `pages/SalesRoute.tsx`    | `sellerId`, `sellerName` (localStorage-persisted) | Orchestration: seller PIN auth, event check, renders SalesPage or gates |
| `SalesPage`     | `pages/SalesPage.tsx`     | `useReducer` state machine (4 phases)             | Core sales workflow: BROWSING -> CART_REVIEW -> CHECKOUT -> CONFIRMED   |
| `AdminPage`     | `pages/AdminPage.tsx`     | `unlocked` boolean                                | PIN gate + sidebar navigation to admin sub-routes                       |
| `DashboardPage` | `pages/DashboardPage.tsx` | `selectedEventId`                                 | Event sales analytics: summary cards, tables by product/seller/payment  |
| `App`           | `App.tsx`                 | None                                              | Root router: defines routes with AppLayout wrapper                      |

## Component Hierarchy

```
App.tsx (Routes)
  └── AppLayout (Header + NavBar + ThemeToggle + Outlet)
      ├── SalesRoute
      │   ├── SellerPinLogin (when no seller)
      │   ├── NoActiveEvent (when no event)
      │   └── SalesPage
      │       ├── BreadcrumbNav
      │       ├── CategoryGrid
      │       ├── ProductPicker (modal)
      │       ├── CartBar (floating)
      │       ├── CartReview (modal)
      │       ├── CartCheckout
      │       └── SaleConfirmation
      ├── DashboardPage
      └── AdminPage
          ├── AdminPinGate (when locked)
          └── Routes (when unlocked)
              ├── EventsAdmin
              ├── SellersAdmin
              ├── CategoriesAdmin
              └── ProductsAdmin
```

## Design Patterns

- **CSS Modules**: All components use `*.module.css` for scoped styling (no Tailwind/styled-components)
- **Large tap targets**: Designed for tablet kiosk use
- **Modal overlays**: ProductPicker, CartReview use overlay patterns
- **Controlled forms**: All inputs managed via useState
- **Callback props**: Parent components pass handlers; children invoke them
