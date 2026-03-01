import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CartItem, Sale, PaymentMethod } from '../lib/types';

interface RecordCartPayload {
  cart: CartItem[];
  sellerId: string;
  paymentMethod: PaymentMethod;
  eventId?: string;
}

export function useRecordCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recordCart(
    payload: RecordCartPayload,
  ): Promise<Sale[] | null> {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured');
      return null;
    }

    setLoading(true);
    setError(null);

    const soldAt = new Date().toISOString();

    try {
      const rows = payload.cart.map((item) => ({
        product_id: item.product.id,
        seller_id: payload.sellerId,
        quantity: item.quantity,
        unit_price_cents: item.product.price_cents,
        payment_method: payload.paymentMethod,
        sold_at: soldAt,
        event_id: payload.eventId ?? null,
      }));

      const { data, error: err } = await supabase
        .from('sales')
        .insert(rows as never)
        .select();

      if (err) {
        setError(err.message);
        return null;
      }

      setError(null);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { recordCart, loading, error };
}
