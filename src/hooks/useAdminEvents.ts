import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { MerchEvent } from '../lib/types';

export function useAdminEvents() {
  const [events, setEvents] = useState<MerchEvent[]>([]);
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
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const addEvent = async (event: {
    name: string;
    starts_at: string;
    ends_at: string;
    active: boolean;
  }) => {
    const { error: err } = await supabase.from('events').insert(event as never);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const updateEvent = async (
    id: string,
    updates: Partial<{
      name: string;
      starts_at: string;
      ends_at: string;
      active: boolean;
    }>,
  ) => {
    const { error: err } = await supabase
      .from('events')
      .update(updates as never)
      .eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const deleteEvent = async (id: string) => {
    const { error: err } = await supabase.from('events').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    refetch();
    return true;
  };

  const toggleActive = async (id: string, active: boolean) => {
    return updateEvent(id, { active });
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleActive,
    refetch,
  };
}
