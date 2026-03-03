import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

export function NavBar() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Sales
      </NavLink>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Admin
      </NavLink>
    </nav>
  );
}
