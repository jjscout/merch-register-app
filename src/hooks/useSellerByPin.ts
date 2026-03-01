import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Seller } from '../lib/types';

export function useSellerByPin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookupByPin(pin: string): Promise<Seller | null> {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured');
      return null;
    }

    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('sellers')
      .select('*')
      .eq('pin', pin)
      .single();

    setLoading(false);

    if (err) {
      setError(err.message);
      return null;
    }

    return data;
  }

  return { lookupByPin, loading, error };
}
