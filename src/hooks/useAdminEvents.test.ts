import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminEvents } from './useAdminEvents';

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

describe('useAdminEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
  });

  it('fetches events list', async () => {
    const events = [
      {
        id: 'e-1',
        name: 'Summer Fest',
        starts_at: '2024-06-01',
        ends_at: '2024-06-02',
        active: true,
        created_at: '2024-01-01',
      },
      {
        id: 'e-2',
        name: 'Winter Fest',
        starts_at: '2024-12-01',
        ends_at: '2024-12-02',
        active: false,
        created_at: '2024-01-01',
      },
    ];
    mockOrder.mockResolvedValue({ data: events, error: null });

    const { result } = renderHook(() => useAdminEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual(events);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch events' },
    });

    const { result } = renderHook(() => useAdminEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch events');
  });

  it('addEvent calls insert and refetches on success', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAdminEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newEvent = {
      name: 'New Event',
      starts_at: '2024-07-01',
      ends_at: '2024-07-02',
      active: true,
    };

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addEvent(newEvent);
    });

    expect(success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith(newEvent);
  });

  it('deleteEvent returns false and sets error on failure', async () => {
    mockDeleteEq.mockResolvedValue({
      error: { message: 'Delete failed' },
    });

    const { result } = renderHook(() => useAdminEvents());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.deleteEvent('e-1');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Delete failed');
  });
});
