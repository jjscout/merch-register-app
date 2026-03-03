import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../lib/types';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
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
        .from('products')
        .select('*')
        .order('sort_order');

      if (cancelled) return;

      setProducts(data ?? []);
      setError(err?.message ?? null);
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const addProduct = async (product: {
    category_id: string;
    name: string;
    price_cents: number;
    active: boolean;
    sort_order: number;
  }) => {
    const { error: err } = await supabase
      .from('products')
      .insert(product as never);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const updateProduct = async (
    id: string,
    updates: Partial<{
      name: string;
      price_cents: number;
      active: boolean;
      sort_order: number;
    }>,
  ) => {
    const { error: err } = await supabase
      .from('products')
      .update(updates as never)
      .eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const deleteProduct = async (id: string) => {
    const { error: err } = await supabase
      .from('products')
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
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch,
  };
}
