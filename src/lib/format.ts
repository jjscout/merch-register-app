import type { CartItem } from './types';

export function formatCents(cents: number): string {
  const dollars = (Math.abs(cents) / 100).toFixed(2);
  return cents < 0 ? `-$${dollars}` : `$${dollars}`;
}

export function cartTotalCents(cart: CartItem[]): number {
  return cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price_cents,
    0,
  );
}
