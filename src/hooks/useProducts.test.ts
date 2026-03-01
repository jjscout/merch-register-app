import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from './useProducts';

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  },
}));

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const eqChain = { eq: mockEq, order: mockOrder };
    mockSelect.mockReturnValue(eqChain);
    mockEq.mockReturnValue(eqChain);
    mockOrder.mockResolvedValue({ data: [], error: null });
  });

  it('fetches products for a category', async () => {
    const products = [
      { id: '1', category_id: 'cat-1', name: 'Large Tee', price_cents: 2500, active: true, sort_order: 0, created_at: '2024-01-01' },
    ];
    mockOrder.mockResolvedValue({ data: products, error: null });

    const { result } = renderHook(() => useProducts('cat-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(products);
    expect(result.current.error).toBeNull();
    expect(mockEq).toHaveBeenCalledWith('category_id', 'cat-1');
  });

  it('does not fetch when categoryId is null', () => {
    const { result } = renderHook(() => useProducts(null));

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('only fetches active products', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    renderHook(() => useProducts('cat-1'));

    await waitFor(() => {
      expect(mockEq).toHaveBeenCalledWith('active', true);
    });
  });

  it('handles errors', async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: 'Failed' } });

    const { result } = renderHook(() => useProducts('cat-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed');
    expect(result.current.products).toEqual([]);
  });
});
