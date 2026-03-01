import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CartReview } from './CartReview';
import type { CartItem } from '../lib/types';

const makeItem = (
  id: string,
  name: string,
  priceCents: number,
  qty: number,
): CartItem => ({
  product: {
    id,
    category_id: 'cat-1',
    name,
    price_cents: priceCents,
    active: true,
    sort_order: 0,
    created_at: '2025-01-01T00:00:00Z',
  },
  quantity: qty,
});

describe('CartReview', () => {
  const defaultProps = {
    cart: [
      makeItem('p1', 'T-Shirt', 2500, 2),
      makeItem('p2', 'Hoodie', 5000, 1),
    ],
    onUpdateItem: vi.fn(),
    onRemoveItem: vi.fn(),
    onCheckout: vi.fn(),
    onContinueShopping: vi.fn(),
  };

  it('renders all cart items with names and line totals', () => {
    render(<CartReview {...defaultProps} />);

    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Hoodie')).toBeInTheDocument();
    // T-Shirt: 2 * 2500 = $50.00, Hoodie: 1 * 5000 = $50.00
    expect(screen.getAllByText('$50.00').length).toBe(2);
  });

  it('shows cart total', () => {
    render(<CartReview {...defaultProps} />);

    // Total: 5000 + 5000 = $100.00
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('calls onUpdateItem when quantity is increased', async () => {
    const user = userEvent.setup();
    const onUpdateItem = vi.fn();
    render(<CartReview {...defaultProps} onUpdateItem={onUpdateItem} />);

    await user.click(
      screen.getByRole('button', { name: /increase quantity of T-Shirt/i }),
    );
    expect(onUpdateItem).toHaveBeenCalledWith('p1', 3);
  });

  it('calls onUpdateItem when quantity is decreased', async () => {
    const user = userEvent.setup();
    const onUpdateItem = vi.fn();
    render(<CartReview {...defaultProps} onUpdateItem={onUpdateItem} />);

    await user.click(
      screen.getByRole('button', { name: /decrease quantity of T-Shirt/i }),
    );
    expect(onUpdateItem).toHaveBeenCalledWith('p1', 1);
  });

  it('does not decrease below 1', async () => {
    const user = userEvent.setup();
    const onUpdateItem = vi.fn();
    const cart = [makeItem('p1', 'T-Shirt', 2500, 1)];
    render(
      <CartReview {...defaultProps} cart={cart} onUpdateItem={onUpdateItem} />,
    );

    await user.click(
      screen.getByRole('button', { name: /decrease quantity of T-Shirt/i }),
    );
    expect(onUpdateItem).not.toHaveBeenCalled();
  });

  it('calls onRemoveItem when remove button clicked', async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();
    render(<CartReview {...defaultProps} onRemoveItem={onRemoveItem} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);
    expect(onRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('calls onCheckout when checkout button clicked', async () => {
    const user = userEvent.setup();
    const onCheckout = vi.fn();
    render(<CartReview {...defaultProps} onCheckout={onCheckout} />);

    await user.click(screen.getByRole('button', { name: /checkout/i }));
    expect(onCheckout).toHaveBeenCalledOnce();
  });

  it('calls onContinueShopping when continue button clicked', async () => {
    const user = userEvent.setup();
    const onContinueShopping = vi.fn();
    render(
      <CartReview {...defaultProps} onContinueShopping={onContinueShopping} />,
    );

    await user.click(
      screen.getByRole('button', { name: /continue shopping/i }),
    );
    expect(onContinueShopping).toHaveBeenCalledOnce();
  });
});
