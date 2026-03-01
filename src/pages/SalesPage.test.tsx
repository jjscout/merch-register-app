import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SalesPage } from './SalesPage';

const mockCategories = [
  { id: 'cat-1', name: 'T-Shirts', parent_id: null, sort_order: 0, created_at: '2024-01-01' },
  { id: 'cat-2', name: 'Hoodies', parent_id: null, sort_order: 1, created_at: '2024-01-01' },
];

const mockSubCategories = [
  { id: 'cat-3', name: 'Men', parent_id: 'cat-1', sort_order: 0, created_at: '2024-01-01' },
];

const mockProducts = [
  { id: 'prod-1', category_id: 'cat-3', name: 'Large Tee', price_cents: 2500, active: true, sort_order: 0, created_at: '2024-01-01' },
];

const mockRecordSale = vi.fn().mockResolvedValue({ id: 'sale-1' });

vi.mock('../hooks/useCategories', () => ({
  useCategories: vi.fn((parentId: string | null) => {
    if (parentId === null) return { categories: mockCategories, loading: false, error: null };
    if (parentId === 'cat-1') return { categories: mockSubCategories, loading: false, error: null };
    return { categories: [], loading: false, error: null };
  }),
}));

vi.mock('../hooks/useProducts', () => ({
  useProducts: vi.fn((categoryId: string | null) => {
    if (categoryId === 'cat-3') return { products: mockProducts, loading: false, error: null };
    return { products: [], loading: false, error: null };
  }),
}));

vi.mock('../hooks/useRecordSale', () => ({
  useRecordSale: vi.fn(() => ({
    recordSale: mockRecordSale,
    loading: false,
    error: null,
  })),
}));

describe('SalesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRecordSale.mockResolvedValue({ id: 'sale-1' });
  });

  it('renders root categories in BROWSING state', () => {
    render(<SalesPage sellerId="seller-1" />);
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    expect(screen.getByText('Hoodies')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('drills down into a category', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));

    expect(screen.getByText('Men')).toBeInTheDocument();
    expect(screen.getByText('T-Shirts')).toBeInTheDocument(); // in breadcrumb
  });

  it('navigates back via breadcrumb', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));
    // Now in T-Shirts category, breadcrumb shows Home > T-Shirts
    // Click Home in breadcrumb to go back
    await user.click(screen.getByRole('button', { name: 'Home' }));

    expect(screen.getByText('Hoodies')).toBeInTheDocument();
  });

  it('transitions from BROWSING to SALE_FORM when product selected', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Drill down to products
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));

    // Select product
    await user.click(screen.getByText('Large Tee'));

    // Should see sale form
    expect(screen.getByText('Record Sale')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('cancels sale form and returns to BROWSING', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));

    await user.click(screen.getByText('Cancel'));

    // Back to browsing - should see products again
    expect(screen.getByText('Large Tee')).toBeInTheDocument();
  });

  it('completes full sale flow: browse → select → confirm → done', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Browse
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));

    // Select product
    await user.click(screen.getByText('Large Tee'));

    // Submit sale
    await user.click(screen.getByText('Record Sale'));

    // Should see confirmation
    expect(screen.getByText('Sale Recorded!')).toBeInTheDocument();
    expect(screen.getByText('Large Tee')).toBeInTheDocument();

    // Click done
    await user.click(screen.getByText('New Sale'));

    // Back to root browsing
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    expect(screen.getByText('Hoodies')).toBeInTheDocument();
  });
});
