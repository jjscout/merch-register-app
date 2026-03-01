import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActiveEvent } from './useActiveEvent';

const mockSelect = vi.fn();
const mockLte = vi.fn(() => ({ select: mockSelect }));
const mockGte = vi.fn(() => ({ lte: mockLte }));
const mockEq = vi.fn(() => ({ gte: mockGte }));

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

const mockEvent = {
  id: 'event-1',
  name: 'Summer Sale',
  starts_at: '2024-06-01T00:00:00Z',
  ends_at: '2024-09-01T00:00:00Z',
  active: true,
  created_at: '2024-01-01T00:00:00Z',
};

describe('useActiveEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the active event when one exists', async () => {
    mockSelect.mockResolvedValue({
      data: [mockEvent],
      error: null,
    });

    const { result } = renderHook(() => useActiveEvent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toEqual(mockEvent);
    expect(result.current.error).toBeNull();
  });

  it('returns null event when no active event exists', async () => {
    mockSelect.mockResolvedValue({
      data: [],
      error: null,
    });

    const { result } = renderHook(() => useActiveEvent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets error on fetch failure', async () => {
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: 'Network error' },
    });

    const { result } = renderHook(() => useActiveEvent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('starts in loading state', () => {
    mockSelect.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useActiveEvent());

    expect(result.current.loading).toBe(true);
    expect(result.current.event).toBeNull();
  });
});
