import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoriesAdmin } from './CategoriesAdmin';

vi.mock('../../hooks/useAdminCategories', () => ({
  useAdminCategories: vi.fn(() => ({
    categories: [],
    loading: false,
    error: null,
    addCategory: vi.fn(),
    deleteCategory: vi.fn(),
  })),
}));

describe('CategoriesAdmin', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAdminCategories } =
      await import('../../hooks/useAdminCategories');
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

  it('renders the Categories heading', () => {
    render(<CategoriesAdmin />);
    expect(
      screen.getByRole('heading', { name: 'Categories' }),
    ).toBeInTheDocument();
  });

  it('renders add category form with name input, parent select, and submit button', () => {
    render(<CategoriesAdmin />);
    expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Category' }),
    ).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { useAdminCategories } =
      await import('../../hooks/useAdminCategories');
    vi.mocked(useAdminCategories).mockReturnValue({
      categories: [],
      loading: true,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
      updateCategory: vi.fn(),
      refetch: vi.fn(),
    });
    render(<CategoriesAdmin />);
    expect(screen.getByText('Loading categories...')).toBeInTheDocument();
  });

  it('shows empty state when no categories', () => {
    render(<CategoriesAdmin />);
    expect(screen.getByText('No categories yet.')).toBeInTheDocument();
  });

  it('renders root categories and their children (tree)', async () => {
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
        {
          id: 'cat-2',
          name: 'T-Shirts',
          parent_id: 'cat-1',
          sort_order: 1,
          created_at: '2025-01-01',
        },
        {
          id: 'cat-3',
          name: 'Accessories',
          parent_id: null,
          sort_order: 2,
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
    render(<CategoriesAdmin />);
    expect(screen.getAllByText('Apparel')).toHaveLength(2);
    expect(screen.getAllByText('T-Shirts')).toHaveLength(2);
    expect(screen.getAllByText('Accessories')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(3);
  });

  it('shows root option in parent select', () => {
    render(<CategoriesAdmin />);
    expect(screen.getByRole('option', { name: 'Root' })).toBeInTheDocument();
  });
});
