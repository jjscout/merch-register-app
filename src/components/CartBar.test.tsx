import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CartBar } from './CartBar';
import type { CartItem } from '../lib/types';

const makeItem = (id: string, priceCents: number, qty: number): CartItem => ({
  product: {
    id,
    category_id: 'cat-1',
    name: `Product ${id}`,
    price_cents: priceCents,
    active: true,
    sort_order: 0,
    created_at: '2025-01-01T00:00:00Z',
  },
  quantity: qty,
});

describe('CartBar', () => {
  it('shows item count and total', () => {
    render(
      <CartBar
        cart={[makeItem('a', 2500, 2), makeItem('b', 1000, 1)]}
        onOpenCart={vi.fn()}
      />,
    );

    // 2+1 = 3 items, 5000+1000 = 6000 cents = $60.00
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('$60.00')).toBeInTheDocument();
  });

  it('calls onOpenCart when tapped', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<CartBar cart={[makeItem('a', 2500, 1)]} onOpenCart={handler} />);

    await user.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('shows singular "item" for single item', () => {
    render(<CartBar cart={[makeItem('a', 2500, 1)]} onOpenCart={vi.fn()} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });
});
