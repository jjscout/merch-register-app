import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminSellers } from './useAdminSellers';

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

describe('useAdminSellers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
  });

  it('fetches sellers list', async () => {
    const sellers = [
      { id: 's-1', name: 'Alice', pin: '1234', created_at: '2024-01-01' },
      { id: 's-2', name: 'Bob', pin: null, created_at: '2024-01-01' },
    ];
    mockOrder.mockResolvedValue({ data: sellers, error: null });

    const { result } = renderHook(() => useAdminSellers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sellers).toEqual(sellers);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch sellers' },
    });

    const { result } = renderHook(() => useAdminSellers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sellers).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch sellers');
  });

  it('addSeller calls insert and refetches on success', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAdminSellers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newSeller = { name: 'Carol', pin: '5678' };

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addSeller(newSeller);
    });

    expect(success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith(newSeller);
  });
});
