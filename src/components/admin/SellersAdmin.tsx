import { useState } from 'react';
import { useAdminSellers } from '../../hooks/useAdminSellers';
import styles from './Admin.module.css';

export function SellersAdmin() {
  const { sellers, loading, error, addSeller, deleteSeller } =
    useAdminSellers();

  const [name, setName] = useState('');
  const [pin, setPin] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pin) return;
    const ok = await addSeller({ name, pin });
    if (ok) {
      setName('');
      setPin('');
    }
  };

  if (loading) return <div className={styles.loading}>Loading sellers...</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Sellers</h3>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleAdd} className={styles.addForm}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seller name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>PIN</label>
          <input
            className={styles.inputSmall}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
          />
        </div>
        <button
          type="submit"
          className={styles.addButton}
          disabled={!name || !pin}
        >
          Add Seller
        </button>
      </form>

      <ul className={styles.list}>
        {sellers.map((s) => (
          <li key={s.id} className={styles.listItem}>
            <span className={styles.itemName}>{s.name}</span>
            <span className={styles.itemDetail}>PIN: {s.pin}</span>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => deleteSeller(s.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {sellers.length === 0 && (
        <div className={styles.empty}>No sellers yet.</div>
      )}
    </div>
  );
}
