import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CartCheckout } from './CartCheckout';
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

describe('CartCheckout', () => {
  const defaultProps = {
    cart: [
      makeItem('p1', 'T-Shirt', 2500, 2),
      makeItem('p2', 'Hoodie', 5000, 1),
    ],
    onConfirm: vi.fn(),
    onBack: vi.fn(),
    loading: false,
    error: null as string | null,
  };

  it('renders all cart items as read-only summary', () => {
    render(<CartCheckout {...defaultProps} />);

    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Hoodie')).toBeInTheDocument();
  });

  it('shows cart total', () => {
    render(<CartCheckout {...defaultProps} />);

    // 2*2500 + 1*5000 = 10000 = $100.00
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('defaults payment method to cash', () => {
    render(<CartCheckout {...defaultProps} />);

    const cashRadio = screen.getByRole('radio', { name: 'Cash' });
    expect(cashRadio).toBeChecked();
  });

  it('calls onConfirm with selected payment method', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<CartCheckout {...defaultProps} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('radio', { name: 'Card' }));
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(onConfirm).toHaveBeenCalledWith('card');
  });

  it('calls onBack when back button clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<CartCheckout {...defaultProps} onBack={onBack} />);

    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('disables confirm button while loading', () => {
    render(<CartCheckout {...defaultProps} loading={true} />);

    expect(screen.getByRole('button', { name: /charging/i })).toBeDisabled();
  });

  it('shows error when present', () => {
    render(<CartCheckout {...defaultProps} error="Insert failed" />);

    expect(screen.getByText('Insert failed')).toBeInTheDocument();
  });

  it('shows total in confirm button text', () => {
    render(<CartCheckout {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /confirm.*\$100\.00/i }),
    ).toBeInTheDocument();
  });
});
