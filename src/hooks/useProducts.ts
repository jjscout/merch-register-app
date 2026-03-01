import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/types';

export function useProducts(categoryId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId === null) {
      setProducts([]);
      setLoading(false);
      return;
    }

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

  return { products, loading, error };
}
