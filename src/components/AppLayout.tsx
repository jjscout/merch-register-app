import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { NavBar } from './NavBar';
import { ThemeToggle } from './ThemeToggle';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Merch Register</h1>
        <NavBar />
        <ThemeToggle
          theme={theme}
          resolvedTheme={resolvedTheme}
          onToggle={toggleTheme}
        />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
