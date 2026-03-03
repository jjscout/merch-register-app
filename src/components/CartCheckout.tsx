import { useState } from 'react';
import type { CartItem, PaymentMethod } from '../lib/types';
import { formatCents, cartTotalCents } from '../lib/format';
import styles from './CartCheckout.module.css';

interface CartCheckoutProps {
  cart: CartItem[];
  onConfirm: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

export function CartCheckout({
  cart,
  onConfirm,
  onBack,
  loading,
  error,
}: CartCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const totalCents = cartTotalCents(cart);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Checkout</h2>

      <ul className={styles.itemList}>
        {cart.map((item) => (
          <li
            key={`${item.product_id}::${item.product_variant_id ?? ''}`}
            className={styles.item}
          >
            <span className={styles.itemName}>{item.product_name}</span>
            <span className={styles.itemDetail}>
              x{item.quantity} &mdash;{' '}
              {formatCents(item.quantity * item.unit_price_cents)}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>{formatCents(totalCents)}</span>
      </div>

      <fieldset className={styles.paymentSection}>
        <legend className={styles.sectionLabel}>Payment Method</legend>
        <div className={styles.radioGroup}>
          {(['cash', 'card', 'other'] as const).map((method) => (
            <label key={method} className={styles.radioLabel}>
              <input
                type="radio"
                name="checkoutPaymentMethod"
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

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
        <button
          type="button"
          className={styles.confirmButton}
          onClick={() => onConfirm(paymentMethod)}
          disabled={loading}
        >
          {loading ? 'Charging...' : `Confirm ${formatCents(totalCents)}`}
        </button>
      </div>
    </div>
  );
}
