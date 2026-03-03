import type { CartItem, PaymentMethod } from '../lib/types';
import { formatCents } from '../lib/format';
import styles from './SaleConfirmation.module.css';

interface SaleConfirmationProps {
  items: CartItem[];
  totalCents: number;
  paymentMethod: PaymentMethod;
  onDone: () => void;
}

export function SaleConfirmation({
  items,
  totalCents,
  paymentMethod,
  onDone,
}: SaleConfirmationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>&#10003;</div>
      <h2 className={styles.heading}>Sale Recorded!</h2>

      <dl className={styles.summary}>
        {items.map((item) => (
          <div
            key={`${item.product_id}::${item.product_variant_id ?? ''}`}
            className={styles.row}
          >
            <dt>{item.product_name}</dt>
            <dd>
              x{item.quantity} &mdash;{' '}
              {formatCents(item.quantity * item.unit_price_cents)}
            </dd>
          </div>
        ))}
        <div className={styles.row}>
          <dt>Total</dt>
          <dd>{formatCents(totalCents)}</dd>
        </div>
        <div className={styles.row}>
          <dt>Payment</dt>
          <dd className={styles.paymentMethod}>
            {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
          </dd>
        </div>
      </dl>

      <button type="button" className={styles.doneButton} onClick={onDone}>
        New Sale
      </button>
    </div>
  );
}
