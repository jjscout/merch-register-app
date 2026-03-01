import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { MerchEvent } from '../lib/types';

export function useActiveEvent() {
  const [event, setEvent] = useState<MerchEvent | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const now = new Date().toISOString();

      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .gte('ends_at', now)
        .lte('starts_at', now)
        .select();

      if (cancelled) return;

      if (err) {
        setError(err.message);
        setEvent(null);
      } else {
        setEvent(data && data.length > 0 ? data[0] : null);
        setError(null);
      }
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  return { event, loading, error };
}
