import { useState } from 'react';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import styles from './Admin.module.css';

export function CategoriesAdmin() {
  const { categories, loading, error, addCategory, deleteCategory } =
    useAdminCategories();

  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const ok = await addCategory({
      name,
      parent_id: parentId || null,
      sort_order: categories.length,
    });
    if (ok) {
      setName('');
      setParentId('');
    }
  };

  if (loading)
    return <div className={styles.loading}>Loading categories...</div>;

  const rootCategories = categories.filter((c) => !c.parent_id);
  const getChildren = (id: string) =>
    categories.filter((c) => c.parent_id === id);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Categories</h3>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleAdd} className={styles.addForm}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Parent</label>
          <select
            className={styles.select}
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">Root</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.addButton} disabled={!name}>
          Add Category
        </button>
      </form>

      <ul className={styles.list}>
        {rootCategories.map((cat) => (
          <li key={cat.id}>
            <div className={styles.listItem}>
              <span className={styles.itemName}>{cat.name}</span>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => deleteCategory(cat.id)}
              >
                Delete
              </button>
            </div>
            {getChildren(cat.id).length > 0 && (
              <ul className={styles.list} style={{ marginLeft: '1.5rem' }}>
                {getChildren(cat.id).map((child) => (
                  <li key={child.id} className={styles.listItem}>
                    <span className={styles.itemName}>{child.name}</span>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => deleteCategory(child.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {categories.length === 0 && (
        <div className={styles.empty}>No categories yet.</div>
      )}
    </div>
  );
}
