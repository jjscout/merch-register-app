import type { CartItem } from '../lib/types';
import { formatCents, cartTotalCents } from '../lib/format';
import styles from './CartReview.module.css';

interface CartReviewProps {
  cart: CartItem[];
  onUpdateItem: (
    productId: string,
    quantity: number,
    variantId?: string | null,
  ) => void;
  onRemoveItem: (productId: string, variantId?: string | null) => void;
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
        {cart.map((item) => (
          <li
            key={`${item.product_id}::${item.product_variant_id ?? ''}`}
            className={styles.item}
          >
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.product_name}</span>
              <span className={styles.itemUnit}>
                {formatCents(item.unit_price_cents)} each
              </span>
            </div>
            <div className={styles.itemControls}>
              <button
                type="button"
                className={styles.stepperButton}
                disabled={item.quantity <= 1}
                onClick={() =>
                  onUpdateItem(
                    item.product_id,
                    item.quantity - 1,
                    item.product_variant_id,
                  )
                }
                aria-label={`Decrease quantity of ${item.product_name}`}
              >
                -
              </button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button
                type="button"
                className={styles.stepperButton}
                onClick={() =>
                  onUpdateItem(
                    item.product_id,
                    Math.min(999, item.quantity + 1),
                    item.product_variant_id,
                  )
                }
                aria-label={`Increase quantity of ${item.product_name}`}
              >
                +
              </button>
              <span className={styles.itemTotal}>
                {formatCents(item.quantity * item.unit_price_cents)}
              </span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() =>
                  onRemoveItem(item.product_id, item.product_variant_id)
                }
                aria-label={`Remove ${item.product_name}`}
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
