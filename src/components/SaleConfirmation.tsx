import type { PaymentMethod } from '../lib/types';
import { formatCents } from '../lib/format';
import styles from './SaleConfirmation.module.css';

interface SaleConfirmationProps {
  productName: string;
  quantity: number;
  totalCents: number;
  paymentMethod: PaymentMethod;
  onDone: () => void;
}

export function SaleConfirmation({
  productName,
  quantity,
  totalCents,
  paymentMethod,
  onDone,
}: SaleConfirmationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>&#10003;</div>
      <h2 className={styles.heading}>Sale Recorded!</h2>

      <dl className={styles.summary}>
        <div className={styles.row}>
          <dt>Product</dt>
          <dd>{productName}</dd>
        </div>
        <div className={styles.row}>
          <dt>Quantity</dt>
          <dd>{quantity}</dd>
        </div>
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

      <button className={styles.doneButton} onClick={onDone}>
        New Sale
      </button>
    </div>
  );
}
