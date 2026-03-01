import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecordSale } from './useRecordSale';

const mockInsert = vi.fn();
const mockSelectSingle = vi.fn();

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

describe('useRecordSale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({ single: mockSelectSingle }),
    });
  });

  it('records a sale with correct payload', async () => {
    const saleData = {
      product_id: 'prod-1',
      seller_id: 'seller-1',
      quantity: 2,
      unit_price_cents: 2500,
      payment_method: 'cash' as const,
      sold_at: '2024-01-01T00:00:00Z',
    };
    const returnedSale = { id: 'sale-1', ...saleData };
    mockSelectSingle.mockResolvedValue({ data: returnedSale, error: null });

    const { result } = renderHook(() => useRecordSale());

    await act(async () => {
      await result.current.recordSale(saleData);
    });

    expect(mockInsert).toHaveBeenCalledWith(saleData);
    expect(result.current.error).toBeNull();
  });

  it('handles errors during recording', async () => {
    mockSelectSingle.mockResolvedValue({
      data: null,
      error: { message: 'Insert failed' },
    });

    const { result } = renderHook(() => useRecordSale());

    await act(async () => {
      await result.current.recordSale({
        product_id: 'prod-1',
        seller_id: 'seller-1',
        quantity: 1,
        unit_price_cents: 1000,
        payment_method: 'card',
        sold_at: new Date().toISOString(),
      });
    });

    expect(result.current.error).toBe('Insert failed');
  });

  it('tracks loading state', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSelectSingle.mockReturnValue(promise);

    const { result } = renderHook(() => useRecordSale());

    expect(result.current.loading).toBe(false);

    let recordPromise: Promise<unknown>;
    act(() => {
      recordPromise = result.current.recordSale({
        product_id: 'prod-1',
        seller_id: 'seller-1',
        quantity: 1,
        unit_price_cents: 1000,
        payment_method: 'cash',
        sold_at: new Date().toISOString(),
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ data: { id: '1' }, error: null });
      await recordPromise!;
    });

    expect(result.current.loading).toBe(false);
  });
});
