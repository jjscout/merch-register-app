import type { Category, Product } from '../lib/types';
import { formatCents } from '../lib/format';
import styles from './CategoryGrid.module.css';

export interface CategoryGridProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export function CategoryGrid({
  categories,
  products,
  onSelectCategory,
  onSelectProduct,
}: CategoryGridProps) {
  return (
    <div className={styles.grid}>
      {categories.map((category) => (
        <button
          key={category.id}
          className={styles.categoryButton}
          onClick={() => onSelectCategory(category.id)}
          type="button"
        >
          {category.name}
        </button>
      ))}
      {products.map((product) => (
        <button
          key={product.id}
          className={styles.productButton}
          onClick={() => onSelectProduct(product)}
          type="button"
        >
          <span className={styles.productName}>{product.name}</span>
          <span className={styles.productPrice}>
            {formatCents(product.price_cents)}
          </span>
        </button>
      ))}
    </div>
  );
}
