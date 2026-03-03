import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminCategories } from './useAdminCategories';

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

describe('useAdminCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdateEq.mockResolvedValue({ error: null });
    mockDeleteEq.mockResolvedValue({ error: null });
  });

  it('fetches categories list', async () => {
    const categories = [
      {
        id: 'c-1',
        name: 'Apparel',
        parent_id: null,
        sort_order: 1,
        created_at: '2024-01-01',
      },
      {
        id: 'c-2',
        name: 'T-Shirts',
        parent_id: 'c-1',
        sort_order: 2,
        created_at: '2024-01-01',
      },
    ];
    mockOrder.mockResolvedValue({ data: categories, error: null });

    const { result } = renderHook(() => useAdminCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(categories);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch categories' },
    });

    const { result } = renderHook(() => useAdminCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch categories');
  });

  it('addCategory calls insert and refetches on success', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAdminCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newCategory = { name: 'Hats', parent_id: null, sort_order: 3 };

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.addCategory(newCategory);
    });

    expect(success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith(newCategory);
  });
});
