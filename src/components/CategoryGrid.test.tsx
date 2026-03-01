import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CategoryGrid } from './CategoryGrid';
import type { Category, Product } from '../lib/types';

const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    parent_id: null,
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Hoodies',
    parent_id: null,
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
];

const products: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'Blue Tee',
    price_cents: 2500,
    active: true,
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    name: 'Red Tee',
    price_cents: 1999,
    active: true,
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
];

describe('CategoryGrid', () => {
  it('renders category names as buttons', () => {
    render(
      <CategoryGrid
        categories={categories}
        products={[]}
        onSelectCategory={vi.fn()}
        onSelectProduct={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'T-Shirts' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hoodies' }),
    ).toBeInTheDocument();
  });

  it('renders product names with formatted prices', () => {
    render(
      <CategoryGrid
        categories={[]}
        products={products}
        onSelectCategory={vi.fn()}
        onSelectProduct={vi.fn()}
      />,
    );
    expect(screen.getByText('Blue Tee')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('Red Tee')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('clicking category calls onSelectCategory with id', async () => {
    const user = userEvent.setup();
    const onSelectCategory = vi.fn();
    render(
      <CategoryGrid
        categories={categories}
        products={[]}
        onSelectCategory={onSelectCategory}
        onSelectProduct={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'T-Shirts' }));
    expect(onSelectCategory).toHaveBeenCalledWith('cat-1');

    await user.click(screen.getByRole('button', { name: 'Hoodies' }));
    expect(onSelectCategory).toHaveBeenCalledWith('cat-2');
  });

  it('clicking product calls onSelectProduct with product object', async () => {
    const user = userEvent.setup();
    const onSelectProduct = vi.fn();
    render(
      <CategoryGrid
        categories={[]}
        products={products}
        onSelectCategory={vi.fn()}
        onSelectProduct={onSelectProduct}
      />,
    );

    await user.click(screen.getByText('Blue Tee').closest('button')!);
    expect(onSelectProduct).toHaveBeenCalledWith(products[0]);

    await user.click(screen.getByText('Red Tee').closest('button')!);
    expect(onSelectProduct).toHaveBeenCalledWith(products[1]);
  });
});
