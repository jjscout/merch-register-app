import { useState } from 'react';
import type { Product, PaymentMethod } from '../lib/types';
import { formatCents } from '../lib/format';
import styles from './SaleForm.module.css';

interface SaleFormProps {
  product: Product;
  onSubmit: (data: { quantity: number; paymentMethod: PaymentMethod }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SaleForm({
  product,
  onSubmit,
  onCancel,
  loading = false,
}: SaleFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const totalCents = quantity * product.price_cents;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ quantity, paymentMethod });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
            onClick={() => setQuantity((q) => q + 1)}
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

      <fieldset className={styles.paymentSection}>
        <legend className={styles.label}>Payment Method</legend>
        <div className={styles.radioGroup}>
          {(['cash', 'card', 'other'] as const).map((method) => (
            <label key={method} className={styles.radioLabel}>
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <span className={styles.radioText}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Recording...' : 'Record Sale'}
        </button>
      </div>
    </form>
  );
}
