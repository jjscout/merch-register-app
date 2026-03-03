import { useState } from 'react';
import { useAdminEvents } from '../../hooks/useAdminEvents';
import styles from './Admin.module.css';

export function EventsAdmin() {
  const { events, loading, error, addEvent, toggleActive, deleteEvent } =
    useAdminEvents();

  const [name, setName] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startsAt || !endsAt) return;
    const ok = await addEvent({
      name,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      active: false,
    });
    if (ok) {
      setName('');
      setStartsAt('');
      setEndsAt('');
    }
  };

  if (loading) return <div className={styles.loading}>Loading events...</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Events</h3>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleAdd} className={styles.addForm}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Start</label>
          <input
            type="datetime-local"
            className={styles.input}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>End</label>
          <input
            type="datetime-local"
            className={styles.input}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.addButton}
          disabled={!name || !startsAt || !endsAt}
        >
          Add Event
        </button>
      </form>

      <ul className={styles.list}>
        {events.map((ev) => (
          <li key={ev.id} className={styles.listItem}>
            <span className={styles.itemName}>{ev.name}</span>
            <span
              className={ev.active ? styles.badgeActive : styles.badgeInactive}
            >
              {ev.active ? 'Active' : 'Inactive'}
            </span>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => toggleActive(ev.id, !ev.active)}
            >
              {ev.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => deleteEvent(ev.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {events.length === 0 && (
        <div className={styles.empty}>No events yet.</div>
      )}
    </div>
  );
}
