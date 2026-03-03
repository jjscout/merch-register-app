import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SellersAdmin } from './SellersAdmin';

vi.mock('../../hooks/useAdminSellers', () => ({
  useAdminSellers: vi.fn(() => ({
    sellers: [],
    loading: false,
    error: null,
    addSeller: vi.fn(),
    deleteSeller: vi.fn(),
  })),
}));

describe('SellersAdmin', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAdminSellers } = await import('../../hooks/useAdminSellers');
    vi.mocked(useAdminSellers).mockReturnValue({
      sellers: [],
      loading: false,
      error: null,
      addSeller: vi.fn(),
      deleteSeller: vi.fn(),
      updateSeller: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders the Sellers heading', () => {
    render(<SellersAdmin />);
    expect(
      screen.getByRole('heading', { name: 'Sellers' }),
    ).toBeInTheDocument();
  });

  it('renders add seller form with name, PIN inputs and submit button', () => {
    render(<SellersAdmin />);
    expect(screen.getByPlaceholderText('Seller name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('PIN')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Seller' }),
    ).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { useAdminSellers } = await import('../../hooks/useAdminSellers');
    vi.mocked(useAdminSellers).mockReturnValue({
      sellers: [],
      loading: true,
      error: null,
      addSeller: vi.fn(),
      deleteSeller: vi.fn(),
      updateSeller: vi.fn(),
      refetch: vi.fn(),
    });
    render(<SellersAdmin />);
    expect(screen.getByText('Loading sellers...')).toBeInTheDocument();
  });

  it('shows empty state when no sellers', () => {
    render(<SellersAdmin />);
    expect(screen.getByText('No sellers yet.')).toBeInTheDocument();
  });

  it('renders sellers list with name, PIN display, and delete button', async () => {
    const { useAdminSellers } = await import('../../hooks/useAdminSellers');
    vi.mocked(useAdminSellers).mockReturnValue({
      sellers: [
        { id: 's-1', name: 'Alice', pin: '1234', created_at: '2025-01-01' },
        { id: 's-2', name: 'Bob', pin: '5678', created_at: '2025-01-01' },
      ],
      loading: false,
      error: null,
      addSeller: vi.fn(),
      deleteSeller: vi.fn(),
      updateSeller: vi.fn(),
      refetch: vi.fn(),
    });
    render(<SellersAdmin />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('PIN: 1234')).toBeInTheDocument();
    expect(screen.getByText('PIN: 5678')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });
});
