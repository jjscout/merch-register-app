import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SaleForm } from './SaleForm';
import type { Product } from '../lib/types';

const mockProduct: Product = {
  id: 'prod-1',
  category_id: 'cat-1',
  name: 'Classic T-Shirt',
  price_cents: 2500,
  active: true,
  sort_order: 1,
  created_at: '2025-01-01T00:00:00Z',
};

describe('SaleForm', () => {
  it('renders product name and price', () => {
    render(
      <SaleForm product={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    expect(screen.getByText('Classic T-Shirt')).toBeInTheDocument();
    expect(screen.getAllByText('$25.00').length).toBeGreaterThanOrEqual(1);
  });

  it('defaults quantity to 1 and shows correct total', () => {
    render(
      <SaleForm product={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$25.00');
  });

  it('increments quantity and updates total', async () => {
    const user = userEvent.setup();
    render(
      <SaleForm product={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));

    expect(screen.getByTestId('quantity-display')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$50.00');
  });

  it('decrements quantity but not below 1', async () => {
    const user = userEvent.setup();
    render(
      <SaleForm product={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    // Increment to 3
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('3');

    // Decrement to 2
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('2');

    // Decrement to 1
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1');

    // Should not go below 1
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1');
  });

  it('selects payment method via radio buttons', async () => {
    const user = userEvent.setup();
    render(
      <SaleForm product={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    const cashRadio = screen.getByRole('radio', { name: 'Cash' });
    const cardRadio = screen.getByRole('radio', { name: 'Card' });
    const otherRadio = screen.getByRole('radio', { name: 'Other' });

    // Cash is default
    expect(cashRadio).toBeChecked();
    expect(cardRadio).not.toBeChecked();

    await user.click(cardRadio);
    expect(cardRadio).toBeChecked();
    expect(cashRadio).not.toBeChecked();

    await user.click(otherRadio);
    expect(otherRadio).toBeChecked();
    expect(cardRadio).not.toBeChecked();
  });

  it('calls onSubmit with correct payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <SaleForm product={mockProduct} onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    // Set quantity to 2
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));

    // Select card payment
    await user.click(screen.getByRole('radio', { name: 'Card' }));

    // Submit
    await user.click(screen.getByRole('button', { name: /record sale/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      quantity: 2,
      paymentMethod: 'card',
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <SaleForm product={mockProduct} onSubmit={vi.fn()} onCancel={onCancel} />,
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables submit button when loading', () => {
    render(
      <SaleForm
        product={mockProduct}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        loading
      />,
    );

    expect(screen.getByRole('button', { name: /recording/i })).toBeDisabled();
  });
});
