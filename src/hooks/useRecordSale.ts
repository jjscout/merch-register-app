import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Sale } from '../lib/types';

type SaleInsert = Omit<Sale, 'id'>;

export function useRecordSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recordSale(sale: SaleInsert): Promise<Sale | null> {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('sales')
      .insert(sale)
      .select()
      .single();

    setLoading(false);
    setError(err?.message ?? null);

    return data;
  }

  return { recordSale, loading, error };
}
