import styles from './NoActiveEvent.module.css';

interface NoActiveEventProps {
  error?: string | null;
}

export function NoActiveEvent({ error }: NoActiveEventProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>📅</div>
      <h2 className={styles.heading}>No Active Event</h2>
      <p className={styles.message}>
        There is no active event right now. Please check back later or contact
        an administrator.
      </p>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
