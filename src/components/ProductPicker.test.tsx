import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ProductPicker } from './ProductPicker';
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

describe('ProductPicker', () => {
  it('renders product name and price', () => {
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Classic T-Shirt')).toBeInTheDocument();
    expect(screen.getAllByText('$25.00').length).toBeGreaterThanOrEqual(1);
  });

  it('defaults quantity to 1 for new items', () => {
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1');
  });

  it('initializes quantity from existingQuantity when item is in cart', () => {
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={3}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByTestId('quantity-display')).toHaveTextContent('3');
  });

  it('increments and decrements quantity', async () => {
    const user = userEvent.setup();
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1');

    // Should not go below 1
    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(screen.getByTestId('quantity-display')).toHaveTextContent('1');
  });

  it('shows "Add to Cart" for new items', () => {
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  it('shows "Update Cart" for items already in cart', () => {
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={2}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: /update cart/i }),
    ).toBeInTheDocument();
  });

  it('calls onAddToCart with quantity when button clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={onAddToCart}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(2);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={vi.fn()}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows correct total based on quantity', async () => {
    const user = userEvent.setup();
    render(
      <ProductPicker
        product={mockProduct}
        existingQuantity={0}
        onAddToCart={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByTestId('total-price')).toHaveTextContent('$25.00');

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(screen.getByTestId('total-price')).toHaveTextContent('$50.00');
  });
});
