import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SalesPage } from './SalesPage';

const mockCategories = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    parent_id: null,
    sort_order: 0,
    created_at: '2024-01-01',
  },
  {
    id: 'cat-2',
    name: 'Hoodies',
    parent_id: null,
    sort_order: 1,
    created_at: '2024-01-01',
  },
];

const mockSubCategories = [
  {
    id: 'cat-3',
    name: 'Men',
    parent_id: 'cat-1',
    sort_order: 0,
    created_at: '2024-01-01',
  },
];

const mockProducts = [
  {
    id: 'prod-1',
    category_id: 'cat-3',
    name: 'Large Tee',
    price_cents: 2500,
    active: true,
    sort_order: 0,
    created_at: '2024-01-01',
  },
];

const mockHoodieProducts = [
  {
    id: 'prod-2',
    category_id: 'cat-2',
    name: 'Classic Hoodie',
    price_cents: 5000,
    active: true,
    sort_order: 0,
    created_at: '2024-01-01',
  },
];

const mockRecordCart = vi.fn().mockResolvedValue([{ id: 'sale-1' }]);

vi.mock('../hooks/useCategories', () => ({
  useCategories: vi.fn((parentId: string | null) => {
    if (parentId === null)
      return { categories: mockCategories, loading: false, error: null };
    if (parentId === 'cat-1')
      return { categories: mockSubCategories, loading: false, error: null };
    return { categories: [], loading: false, error: null };
  }),
}));

vi.mock('../hooks/useProducts', () => ({
  useProducts: vi.fn((categoryId: string | null) => {
    if (categoryId === 'cat-3')
      return { products: mockProducts, loading: false, error: null };
    if (categoryId === 'cat-2')
      return { products: mockHoodieProducts, loading: false, error: null };
    return { products: [], loading: false, error: null };
  }),
}));

vi.mock('../hooks/useRecordCart', () => ({
  useRecordCart: vi.fn(() => ({
    recordCart: mockRecordCart,
    loading: false,
    error: null,
  })),
}));

describe('SalesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRecordCart.mockResolvedValue([{ id: 'sale-1' }]);
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
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
  });

  it('navigates back via breadcrumb', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByRole('button', { name: 'Home' }));

    expect(screen.getByText('Hoodies')).toBeInTheDocument();
  });

  it('opens ProductPicker when product clicked', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));

    // ProductPicker overlay should appear
    expect(
      screen.getByRole('button', { name: /add to cart/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('adds product to cart and shows CartBar', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // CartBar should be visible with item count
    expect(screen.getByText('View Cart')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('dismisses ProductPicker when close clicked', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /close/i }));

    // Picker should be gone, products still visible
    expect(
      screen.queryByRole('button', { name: /add to cart/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Large Tee')).toBeInTheDocument();
  });

  it('opens cart review when CartBar tapped', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Add a product to cart
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // Tap the cart bar
    await user.click(screen.getByText('View Cart'));

    // Cart review should be visible
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /checkout/i }),
    ).toBeInTheDocument();
  });

  it('removes item from cart in review', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Add a product
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // Open cart
    await user.click(screen.getByText('View Cart'));

    // Remove the item
    await user.click(screen.getByRole('button', { name: /remove large tee/i }));

    // Cart empty → should return to browsing
    expect(screen.queryByText('Cart')).not.toBeInTheDocument();
    // Should be back in browsing - root categories visible
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
  });

  it('completes full cart flow: add items → review → checkout → confirm → done', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Add first product
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // Open cart and go to checkout
    await user.click(screen.getByText('View Cart'));
    await user.click(screen.getByRole('button', { name: /checkout/i }));

    // Should be on checkout
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Large Tee')).toBeInTheDocument();

    // Select payment and confirm
    await user.click(screen.getByRole('radio', { name: 'Card' }));
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    // Should see confirmation
    expect(screen.getByText('Sale Recorded!')).toBeInTheDocument();
    expect(screen.getByText('Large Tee')).toBeInTheDocument();
    expect(mockRecordCart).toHaveBeenCalledOnce();

    // Click done
    await user.click(screen.getByText('New Sale'));

    // Back to root browsing
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    expect(screen.getByText('Hoodies')).toBeInTheDocument();
  });

  it('stays on checkout when recording fails', async () => {
    const { useRecordCart } = await import('../hooks/useRecordCart');
    const mockUseRecordCart = vi.mocked(useRecordCart);

    mockRecordCart.mockResolvedValue(null);
    mockUseRecordCart.mockReturnValue({
      recordCart: mockRecordCart,
      loading: false,
      error: 'Insert failed',
    });

    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Add product
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // Go to cart → checkout
    await user.click(screen.getByText('View Cart'));
    await user.click(screen.getByRole('button', { name: /checkout/i }));

    // Try to confirm
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    // Should remain on checkout
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.queryByText('Sale Recorded!')).not.toBeInTheDocument();
    expect(screen.getByText('Insert failed')).toBeInTheDocument();
  });

  it('preserves cart when navigating categories', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Add first product
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // Navigate to Home
    await user.click(screen.getByRole('button', { name: 'Home' }));

    // CartBar should still be visible with 1 item
    expect(screen.getByText('View Cart')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('updates existing cart item quantity when same product added again', async () => {
    const user = userEvent.setup();
    render(<SalesPage sellerId="seller-1" />);

    // Add product with qty 1
    await user.click(screen.getByText('T-Shirts'));
    await user.click(screen.getByText('Men'));
    await user.click(screen.getByText('Large Tee'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    // Cart should show 1 item
    expect(screen.getByText('1')).toBeInTheDocument();

    // Click product again — should show "Update Cart" since it's already in cart
    await user.click(screen.getByText('Large Tee'));
    expect(
      screen.getByRole('button', { name: /update cart/i }),
    ).toBeInTheDocument();

    // Increase to 3 and update
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: /update cart/i }));

    // CartBar badge should show 3 (updated quantity)
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });
});
