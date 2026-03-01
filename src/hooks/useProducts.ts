import { useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../lib/types';

export function useProducts(categoryId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId === null || !isSupabaseConfigured) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId!)
        .eq('active', true)
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
  }, [categoryId]);

  const result = useMemo(
    () =>
      categoryId === null
        ? { products: [] as Product[], loading: false, error: null }
        : { products, loading, error },
    [categoryId, products, loading, error],
  );

  return result;
}
