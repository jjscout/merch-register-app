import styles from './BreadcrumbNav.module.css';

export interface BreadcrumbNavProps {
  path: { id: string | null; name: string }[];
  onNavigate: (categoryId: string | null) => void;
}

export function BreadcrumbNav({ path, onNavigate }: BreadcrumbNavProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {path.map((segment, index) => {
          const isLast = index === path.length - 1;
          return (
            <li key={segment.id ?? 'root'} className={styles.item}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  {' > '}
                </span>
              )}
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {segment.name}
                </span>
              ) : (
                <button
                  className={styles.link}
                  onClick={() => onNavigate(segment.id)}
                  type="button"
                >
                  {segment.name}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
