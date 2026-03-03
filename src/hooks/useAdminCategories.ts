import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Category } from '../lib/types';

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (cancelled) return;

      setCategories(data ?? []);
      setError(err?.message ?? null);
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const addCategory = async (category: {
    name: string;
    parent_id: string | null;
    sort_order: number;
  }) => {
    const { error: err } = await supabase
      .from('categories')
      .insert(category as never);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const updateCategory = async (
    id: string,
    updates: Partial<{ name: string; sort_order: number }>,
  ) => {
    const { error: err } = await supabase
      .from('categories')
      .update(updates as never)
      .eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const deleteCategory = async (id: string) => {
    const { error: err } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch,
  };
}
