import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecordCart } from './useRecordCart';

const mockSelect = vi.fn();
const mockInsert = vi.fn();

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

const makeCartItem = (id: string, priceCents: number, qty: number) => ({
  product_id: id,
  product_name: `Product ${id}`,
  unit_price_cents: priceCents,
  quantity: qty,
  product_variant_id: null,
  variant_display_name: null,
});

describe('useRecordCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({ select: mockSelect });
  });

  it('batch-inserts all cart items and returns Sale array', async () => {
    const cart = [makeCartItem('p1', 2500, 2), makeCartItem('p2', 1000, 1)];
    mockSelect.mockResolvedValue({
      data: [{ id: 'sale-1' }, { id: 'sale-2' }],
      error: null,
    });

    const { result } = renderHook(() => useRecordCart());

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.recordCart({
        cart,
        sellerId: 'seller-1',
        paymentMethod: 'cash',
      });
    });

    // Single batch insert call with array of rows
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const rows = mockInsert.mock.calls[0][0];
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      product_id: 'p1',
      seller_id: 'seller-1',
      quantity: 2,
      unit_price_cents: 2500,
      payment_method: 'cash',
      event_id: null,
      product_variant_id: null,
      variant_display_name: null,
    });
    expect(rows[1]).toMatchObject({
      product_id: 'p2',
      seller_id: 'seller-1',
      quantity: 1,
      unit_price_cents: 1000,
      payment_method: 'cash',
      event_id: null,
    });
    expect(returnValue).toEqual([{ id: 'sale-1' }, { id: 'sale-2' }]);
    expect(result.current.error).toBeNull();
  });

  it('returns null and sets error on failure', async () => {
    const cart = [makeCartItem('p1', 2500, 1), makeCartItem('p2', 1000, 1)];
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: 'Insert failed' },
    });

    const { result } = renderHook(() => useRecordCart());

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.recordCart({
        cart,
        sellerId: 'seller-1',
        paymentMethod: 'card',
      });
    });

    expect(returnValue).toBeNull();
    expect(result.current.error).toBe('Insert failed');
  });

  it('tracks loading state during recording', async () => {
    const cart = [makeCartItem('p1', 2500, 1)];
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSelect.mockReturnValue(promise);

    const { result } = renderHook(() => useRecordCart());

    expect(result.current.loading).toBe(false);

    let recordPromise: Promise<unknown>;
    act(() => {
      recordPromise = result.current.recordCart({
        cart,
        sellerId: 'seller-1',
        paymentMethod: 'cash',
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ data: [{ id: 'sale-1' }], error: null });
      await recordPromise!;
    });

    expect(result.current.loading).toBe(false);
  });

  it('includes event_id in insert rows when provided', async () => {
    const cart = [makeCartItem('p1', 2500, 1)];
    mockSelect.mockResolvedValue({
      data: [{ id: 'sale-1' }],
      error: null,
    });

    const { result } = renderHook(() => useRecordCart());

    await act(async () => {
      await result.current.recordCart({
        cart,
        sellerId: 'seller-1',
        paymentMethod: 'cash',
        eventId: 'event-1',
      });
    });

    const rows = mockInsert.mock.calls[0][0];
    expect(rows[0].event_id).toBe('event-1');
  });

  it('uses same sold_at timestamp for all items', async () => {
    const cart = [makeCartItem('p1', 2500, 1), makeCartItem('p2', 1000, 1)];
    mockSelect.mockResolvedValue({
      data: [{ id: 'sale-1' }, { id: 'sale-2' }],
      error: null,
    });

    const { result } = renderHook(() => useRecordCart());

    await act(async () => {
      await result.current.recordCart({
        cart,
        sellerId: 'seller-1',
        paymentMethod: 'cash',
      });
    });

    const rows = mockInsert.mock.calls[0][0];
    expect(rows[0].sold_at).toBe(rows[1].sold_at);
  });
});
