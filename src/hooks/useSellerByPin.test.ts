import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSellerByPin } from './useSellerByPin';

const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));

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

const mockSeller = {
  id: 'seller-1',
  name: 'Alice',
  pin: '1234',
  created_at: '2024-01-01T00:00:00Z',
};

describe('useSellerByPin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns seller on valid PIN lookup', async () => {
    mockSingle.mockResolvedValue({
      data: mockSeller,
      error: null,
    });

    const { result } = renderHook(() => useSellerByPin());

    let seller: unknown;
    await act(async () => {
      seller = await result.current.lookupByPin('1234');
    });

    expect(seller).toEqual(mockSeller);
    expect(result.current.error).toBeNull();
    expect(mockEq).toHaveBeenCalledWith('pin', '1234');
  });

  it('returns null and sets error when PIN not found', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'No rows found', code: 'PGRST116' },
    });

    const { result } = renderHook(() => useSellerByPin());

    let seller: unknown;
    await act(async () => {
      seller = await result.current.lookupByPin('9999');
    });

    expect(seller).toBeNull();
    expect(result.current.error).toBe('No rows found');
  });

  it('tracks loading state during lookup', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSingle.mockReturnValue(promise);

    const { result } = renderHook(() => useSellerByPin());

    expect(result.current.loading).toBe(false);

    let lookupPromise: Promise<unknown>;
    act(() => {
      lookupPromise = result.current.lookupByPin('1234');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ data: mockSeller, error: null });
      await lookupPromise!;
    });

    expect(result.current.loading).toBe(false);
  });
});
