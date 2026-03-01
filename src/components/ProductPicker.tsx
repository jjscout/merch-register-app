import { useState } from 'react';
import type { Product } from '../lib/types';
import { formatCents } from '../lib/format';
import styles from './ProductPicker.module.css';

interface ProductPickerProps {
  product: Product;
  existingQuantity: number;
  onAddToCart: (quantity: number) => void;
  onClose: () => void;
}

export function ProductPicker({
  product,
  existingQuantity,
  onAddToCart,
  onClose,
}: ProductPickerProps) {
  const [quantity, setQuantity] = useState(
    existingQuantity > 0 ? existingQuantity : 1,
  );
  const totalCents = quantity * product.price_cents;
  const isUpdate = existingQuantity > 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className={styles.productInfo}>
          <h2 className={styles.productName}>{product.name}</h2>
          <span className={styles.unitPrice}>
            {formatCents(product.price_cents)}
          </span>
        </div>

        <div className={styles.quantitySection}>
          <label className={styles.label}>Quantity</label>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span
              className={styles.quantityDisplay}
              data-testid="quantity-display"
            >
              {quantity}
            </span>
            <button
              type="button"
              className={styles.stepperButton}
              onClick={() => setQuantity((q) => Math.min(999, q + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.totalSection}>
          <span className={styles.label}>Total</span>
          <span className={styles.totalPrice} data-testid="total-price">
            {formatCents(totalCents)}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => onAddToCart(quantity)}
          >
            {isUpdate ? 'Update Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
