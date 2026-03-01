import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Sale } from '../lib/types';

type SaleInsert = Omit<Sale, 'id'>;

export function useRecordSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recordSale(sale: SaleInsert): Promise<Sale | null> {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: err } = await supabase
        .from('sales')
        .insert(sale as never)
        .select()
        .single();

      setError(err?.message ?? null);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { recordSale, loading, error };
}
