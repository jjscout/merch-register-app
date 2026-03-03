import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { MerchEvent } from '../lib/types';

export function useEvents() {
  const [events, setEvents] = useState<MerchEvent[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .order('starts_at', { ascending: false });

      if (cancelled) return;

      setEvents(data ?? []);
      setError(err?.message ?? null);
      setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  return { events, loading, error };
}
