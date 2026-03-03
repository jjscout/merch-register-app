import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminProducts } from './useAdminProducts';

const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockUpdateEq = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }));
const mockDeleteEq = vi.fn();
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }));

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: mockOrder,
      })),
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
  },
}));

describe('useAdminProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
  });

  it('fetches products list', async () => {
    const products = [
      {
        id: 'p-1',
        category_id: 'c-1',
        name: 'Blue Tee',
        price_cents: 2500,
        active: true,
        sort_order: 1,
        created_at: '2024-01-01',
      },
      {
        id: 'p-2',
        category_id: 'c-1',
        name: 'Red Tee',
        price_cents: 2500,
        active: false,
        sort_order: 2,
        created_at: '2024-01-01',
      },
    ];
    mockOrder.mockResolvedValue({ data: products, error: null });

    const { result } = renderHook(() => useAdminProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(products);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch products' },
    });

    const { result } = renderHook(() => useAdminProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch products');
  });

  it('addProduct calls insert and refetches on success', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAdminProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newProduct = {
      category_id: 'c-1',
      name: 'Green Hoodie',
      price_cents: 4500,
      active: true,
      sort_order: 3,
    };

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addProduct(newProduct);
    });

    expect(success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith(newProduct);
  });
});
