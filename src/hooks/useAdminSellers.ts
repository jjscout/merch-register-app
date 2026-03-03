import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Seller } from '../lib/types';

export function useAdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
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
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const addSeller = async (seller: { name: string; pin: string }) => {
    const { error: err } = await supabase
      .from('sellers')
      .insert(seller as never);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const updateSeller = async (
    id: string,
    updates: Partial<{ name: string; pin: string }>,
  ) => {
    const { error: err } = await supabase
      .from('sellers')
      .update(updates as never)
      .eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const deleteSeller = async (id: string) => {
    const { error: err } = await supabase.from('sellers').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  return {
    sellers,
    loading,
    error,
    addSeller,
    updateSeller,
    deleteSeller,
    refetch,
  };
}
