import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SaleConfirmation } from './SaleConfirmation';
import type { CartItem } from '../lib/types';

const makeItem = (
  id: string,
  name: string,
  priceCents: number,
  qty: number,
): CartItem => ({
  product_id: id,
  product_name: name,
  unit_price_cents: priceCents,
  quantity: qty,
  product_variant_id: null,
  variant_display_name: null,
});

describe('SaleConfirmation', () => {
  it('renders all items, total, and payment method', () => {
    const items = [
      makeItem('p1', 'Classic T-Shirt', 2500, 3),
      makeItem('p2', 'Hoodie', 5000, 1),
    ];
    render(
      <SaleConfirmation
        items={items}
        totalCents={12500}
        paymentMethod="card"
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText(/Classic T-Shirt/)).toBeInTheDocument();
    expect(screen.getByText(/Hoodie/)).toBeInTheDocument();
    expect(screen.getByText('$125.00')).toBeInTheDocument();
    expect(screen.getByText(/card/i)).toBeInTheDocument();
  });

  it('shows a success message', () => {
    render(
      <SaleConfirmation
        items={[makeItem('p1', 'Hoodie', 4500, 1)]}
        totalCents={4500}
        paymentMethod="cash"
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText(/sale recorded/i)).toBeInTheDocument();
  });

  it('calls onDone when done button is clicked', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(
      <SaleConfirmation
        items={[makeItem('p1', 'Hoodie', 4500, 1)]}
        totalCents={4500}
        paymentMethod="cash"
        onDone={onDone}
      />,
    );

    await user.click(screen.getByRole('button', { name: /new sale/i }));

    expect(onDone).toHaveBeenCalledOnce();
  });
});
