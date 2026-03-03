import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { AdminPinGate } from '../components/AdminPinGate';
import { EventsAdmin } from '../components/admin/EventsAdmin';
import { SellersAdmin } from '../components/admin/SellersAdmin';
import { CategoriesAdmin } from '../components/admin/CategoriesAdmin';
import { ProductsAdmin } from '../components/admin/ProductsAdmin';
import styles from './AdminPage.module.css';

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '0000';

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <AdminPinGate correctPin={ADMIN_PIN} onUnlock={() => setUnlocked(true)} />
    );
  }

  return (
    <div className={styles.page}>
      <nav className={styles.sidebar}>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Events
        </NavLink>
        <NavLink
          to="/admin/sellers"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Sellers
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Categories
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Products
        </NavLink>
        <button
          type="button"
          className={styles.lockButton}
          onClick={() => setUnlocked(false)}
        >
          Lock Admin
        </button>
      </nav>
      <div className={styles.content}>
        <Routes>
          <Route index element={<EventsAdmin />} />
          <Route path="sellers" element={<SellersAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="products" element={<ProductsAdmin />} />
        </Routes>
      </div>
    </div>
  );
}
