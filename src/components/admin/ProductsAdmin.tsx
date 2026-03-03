import { useState } from 'react';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import { formatCents } from '../../lib/format';
import styles from './Admin.module.css';

export function ProductsAdmin() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } =
    useAdminProducts();
  const { categories } = useAdminCategories();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceCents, setPriceCents] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !priceCents) return;
    const ok = await addProduct({
      name,
      category_id: categoryId,
      price_cents: Math.round(parseFloat(priceCents) * 100),
      active: true,
      sort_order: products.length,
    });
    if (ok) {
      setName('');
      setPriceCents('');
    }
  };

  if (loading) return <div className={styles.loading}>Loading products...</div>;

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? 'Unknown';

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Products</h3>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleAdd} className={styles.addForm}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Category</label>
          <select
            className={styles.select}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className={styles.inputSmall}
            value={priceCents}
            onChange={(e) => setPriceCents(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <button
          type="submit"
          className={styles.addButton}
          disabled={!name || !categoryId || !priceCents}
        >
          Add Product
        </button>
      </form>

      <ul className={styles.list}>
        {products.map((p) => (
          <li key={p.id} className={styles.listItem}>
            <span className={styles.itemName}>{p.name}</span>
            <span className={styles.itemDetail}>
              {getCategoryName(p.category_id)}
            </span>
            <span className={styles.itemDetail}>
              {formatCents(p.price_cents)}
            </span>
            <span
              className={p.active ? styles.badgeActive : styles.badgeInactive}
            >
              {p.active ? 'Active' : 'Inactive'}
            </span>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => updateProduct(p.id, { active: !p.active })}
            >
              {p.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => deleteProduct(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <div className={styles.empty}>No products yet.</div>
      )}
    </div>
  );
}
