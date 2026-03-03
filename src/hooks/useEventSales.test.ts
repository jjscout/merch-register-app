import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEventSales } from './useEventSales';

const mockEq = vi.fn();

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: mockEq,
      })),
    })),
  },
}));

describe('useEventSales', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches sales for a given event', async () => {
    const salesData = [
      {
        id: 's-1',
        product_id: 'p-1',
        seller_id: 'sel-1',
        event_id: 'e-1',
        quantity: 2,
        unit_price_cents: 2500,
        payment_method: 'cash',
        sold_at: '2025-01-01',
        products: { name: 'Tee S' },
        sellers: { name: 'Alice' },
      },
    ];
    mockEq.mockResolvedValue({ data: salesData, error: null });

    const { result } = renderHook(() => useEventSales('e-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sales).toHaveLength(1);
    expect(result.current.sales[0].product_name).toBe('Tee S');
    expect(result.current.sales[0].seller_name).toBe('Alice');
  });

  it('returns empty array when eventId is null', () => {
    const { result } = renderHook(() => useEventSales(null));

    expect(result.current.sales).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('handles error', async () => {
    mockEq.mockResolvedValue({
      data: null,
      error: { message: 'Query failed' },
    });

    const { result } = renderHook(() => useEventSales('e-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Query failed');
    expect(result.current.sales).toEqual([]);
  });
});
