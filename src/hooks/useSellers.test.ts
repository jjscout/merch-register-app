import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSellers } from './useSellers';

const mockSelect = vi.fn();
const mockOrder = vi.fn();

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  },
}));

describe('useSellers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: [], error: null });
  });

  it('fetches sellers list', async () => {
    const sellers = [
      { id: '1', name: 'Alice', created_at: '2024-01-01' },
      { id: '2', name: 'Bob', created_at: '2024-01-01' },
    ];
    mockOrder.mockResolvedValue({ data: sellers, error: null });

    const { result } = renderHook(() => useSellers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.sellers).toEqual(sellers);
    expect(result.current.error).toBeNull();
  });

  it('handles errors', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Fetch failed' },
    });

    const { result } = renderHook(() => useSellers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.sellers).toEqual([]);
  });
});
