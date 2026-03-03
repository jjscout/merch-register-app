import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEvents } from './useEvents';

const mockOrder = vi.fn();

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: mockOrder,
      })),
    })),
  },
}));

describe('useEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns events list', async () => {
    const events = [
      { id: 'e-1', name: 'Summer', active: true },
      { id: 'e-2', name: 'Winter', active: false },
    ];
    mockOrder.mockResolvedValue({ data: events, error: null });

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(events);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Failed' },
    });

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe('Failed');
  });
});
