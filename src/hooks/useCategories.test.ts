import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCategories } from './useCategories';

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockIsNull = vi.fn();
const mockOrder = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  },
}));

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ eq: mockEq, is: mockIsNull, order: mockOrder });
    mockOrder.mockResolvedValue({ data: [], error: null });
  });

  it('fetches root categories when parentId is null', async () => {
    const categories = [
      { id: '1', name: 'T-Shirts', parent_id: null, sort_order: 0, created_at: '2024-01-01' },
    ];
    mockIsNull.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: categories, error: null });

    const { result } = renderHook(() => useCategories(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(categories);
    expect(result.current.error).toBeNull();
    expect(mockIsNull).toHaveBeenCalledWith('parent_id', null);
  });

  it('fetches child categories when parentId is provided', async () => {
    const categories = [
      { id: '2', name: 'Men', parent_id: '1', sort_order: 0, created_at: '2024-01-01' },
    ];
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: categories, error: null });

    const { result } = renderHook(() => useCategories('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(categories);
    expect(mockEq).toHaveBeenCalledWith('parent_id', '1');
  });

  it('handles errors', async () => {
    mockIsNull.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: null, error: { message: 'Network error' } });

    const { result } = renderHook(() => useCategories(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.categories).toEqual([]);
  });
});
