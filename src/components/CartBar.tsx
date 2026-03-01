import type { CartItem } from '../lib/types';
import { formatCents, cartTotalCents } from '../lib/format';
import styles from './CartBar.module.css';

interface CartBarProps {
  cart: CartItem[];
  onOpenCart: () => void;
}

export function CartBar({ cart, onOpenCart }: CartBarProps) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = cartTotalCents(cart);

  return (
    <button
      type="button"
      className={styles.bar}
      onClick={onOpenCart}
      aria-label={`Cart: ${itemCount} items, ${formatCents(totalCents)}. Open cart.`}
    >
      <span className={styles.badge}>{itemCount}</span>
      <span className={styles.label}>View Cart</span>
      <span className={styles.total}>{formatCents(totalCents)}</span>
    </button>
  );
}
