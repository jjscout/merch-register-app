import type { CartItem } from '../lib/types';
import { formatCents, cartTotalCents } from '../lib/format';
import styles from './CartReview.module.css';

interface CartReviewProps {
  cart: CartItem[];
  onUpdateItem: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function CartReview({
  cart,
  onUpdateItem,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}: CartReviewProps) {
  const totalCents = cartTotalCents(cart);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Cart</h2>

      <ul className={styles.itemList}>
        {cart.map(({ product, quantity }) => (
          <li key={product.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{product.name}</span>
              <span className={styles.itemUnit}>
                {formatCents(product.price_cents)} each
              </span>
            </div>
            <div className={styles.itemControls}>
              <button
                type="button"
                className={styles.stepperButton}
                disabled={quantity <= 1}
                onClick={() => onUpdateItem(product.id, quantity - 1)}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                -
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button
                type="button"
                className={styles.stepperButton}
                onClick={() =>
                  onUpdateItem(product.id, Math.min(999, quantity + 1))
                }
                aria-label={`Increase quantity of ${product.name}`}
              >
                +
              </button>
              <span className={styles.itemTotal}>
                {formatCents(quantity * product.price_cents)}
              </span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemoveItem(product.id)}
                aria-label={`Remove ${product.name}`}
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>{formatCents(totalCents)}</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.continueButton}
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
        <button
          type="button"
          className={styles.checkoutButton}
          onClick={onCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
