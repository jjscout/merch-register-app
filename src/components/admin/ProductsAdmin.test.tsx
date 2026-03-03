import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsAdmin } from './ProductsAdmin';

vi.mock('../../hooks/useAdminProducts', () => ({
  useAdminProducts: vi.fn(() => ({
    products: [],
    loading: false,
    error: null,
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  })),
}));

vi.mock('../../hooks/useAdminCategories', () => ({
  useAdminCategories: vi.fn(() => ({
    categories: [],
    loading: false,
    error: null,
    addCategory: vi.fn(),
    deleteCategory: vi.fn(),
  })),
}));

describe('ProductsAdmin', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAdminProducts } = await import('../../hooks/useAdminProducts');
    const { useAdminCategories } =
      await import('../../hooks/useAdminCategories');
    vi.mocked(useAdminProducts).mockReturnValue({
      products: [],
      loading: false,
      error: null,
      addProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useAdminCategories).mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
      updateCategory: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders the Products heading', () => {
    render(<ProductsAdmin />);
    expect(
      screen.getByRole('heading', { name: 'Products' }),
    ).toBeInTheDocument();
  });

  it('renders add product form with name, category select, price input, and submit button', () => {
    render(<ProductsAdmin />);
    expect(screen.getByPlaceholderText('Product name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Product' }),
    ).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { useAdminProducts } = await import('../../hooks/useAdminProducts');
    vi.mocked(useAdminProducts).mockReturnValue({
      products: [],
      loading: true,
      error: null,
      addProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      refetch: vi.fn(),
    });
    render(<ProductsAdmin />);
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    render(<ProductsAdmin />);
    expect(screen.getByText('No products yet.')).toBeInTheDocument();
  });

  it('renders products list with name, category, price, badge, and action buttons', async () => {
    const { useAdminProducts } = await import('../../hooks/useAdminProducts');
    const { useAdminCategories } =
      await import('../../hooks/useAdminCategories');
    vi.mocked(useAdminCategories).mockReturnValue({
      categories: [
        {
          id: 'cat-1',
          name: 'Apparel',
          parent_id: null,
          sort_order: 0,
          created_at: '2025-01-01',
        },
      ],
      loading: false,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
      updateCategory: vi.fn(),
      refetch: vi.fn(),
    });
    vi.mocked(useAdminProducts).mockReturnValue({
      products: [
        {
          id: 'p-1',
          name: 'Classic Tee',
          category_id: 'cat-1',
          price_cents: 2500,
          active: true,
          sort_order: 0,
          created_at: '2025-01-01',
        },
        {
          id: 'p-2',
          name: 'Old Hat',
          category_id: 'cat-1',
          price_cents: 1500,
          active: false,
          sort_order: 1,
          created_at: '2025-01-01',
        },
      ],
      loading: false,
      error: null,
      addProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      refetch: vi.fn(),
    });
    render(<ProductsAdmin />);
    expect(screen.getByText('Classic Tee')).toBeInTheDocument();
    expect(screen.getByText('Old Hat')).toBeInTheDocument();
    expect(screen.getAllByText('Apparel')).toHaveLength(3);
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Deactivate' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Activate' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });
});
