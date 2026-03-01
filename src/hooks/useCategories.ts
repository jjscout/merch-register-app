import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../lib/types';

export function useCategories(parentId: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const query = supabase.from('categories').select('*');
      const filtered =
        parentId === null
          ? query.is('parent_id', null)
          : query.eq('parent_id', parentId);
      const { data, error: err } = await filtered.order('sort_order');

      if (cancelled) return;

      setCategories(data ?? []);
      setError(err?.message ?? null);
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [parentId]);

  return { categories, loading, error };
}
