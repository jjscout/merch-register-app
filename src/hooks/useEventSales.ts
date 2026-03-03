import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Sale } from '../lib/types';

type SaleWithNames = Sale & {
  product_name?: string;
  seller_name?: string;
};

export function useEventSales(eventId: string | null) {
  const [sales, setSales] = useState<SaleWithNames[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !eventId) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('sales')
        .select('*, products:product_id(name), sellers:seller_id(name)')
        .eq('event_id', eventId as string);

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setSales([]);
      } else {
        const mapped = (data ?? []).map((row: Record<string, unknown>) => ({
          ...(row as unknown as Sale),
          product_name: (row.products as { name: string } | null)?.name,
          seller_name: (row.sellers as { name: string } | null)?.name,
        }));
        setSales(mapped);
        setError(null);
      }
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { sales: eventId ? sales : [], loading, error };
}
