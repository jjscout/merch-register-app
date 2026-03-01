import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Seller } from '../lib/types';

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('sellers')
        .select('*')
        .order('name');

      if (cancelled) return;

      setSellers(data ?? []);
      setError(err?.message ?? null);
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  return { sellers, loading, error };
}
