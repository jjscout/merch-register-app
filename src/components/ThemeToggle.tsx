import type { Theme } from '../hooks/useTheme';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  onToggle: () => void;
}

const icons: Record<Theme, string> = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
};

const labels: Record<Theme, string> = {
  light: 'Theme: Light',
  dark: 'Theme: Dark',
  system: 'Theme: System',
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={labels[theme]}
    >
      <span className={styles.icon}>{icons[theme]}</span>
    </button>
  );
}
