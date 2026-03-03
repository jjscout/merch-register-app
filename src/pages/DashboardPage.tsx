import { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useEventSales } from '../hooks/useEventSales';
import { formatCents } from '../lib/format';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const activeEvent = events.find((e) => e.active);
  const eventId = selectedEventId || activeEvent?.id || '';

  const { sales, loading: salesLoading } = useEventSales(eventId || null);

  const summary = useMemo(() => {
    if (!sales.length) {
      return { totalRevenue: 0, totalItems: 0, totalTransactions: 0 };
    }

    const transactionIds = new Set(sales.map((s) => s.sold_at));
    return {
      totalRevenue: sales.reduce(
        (sum, s) => sum + s.quantity * s.unit_price_cents,
        0,
      ),
      totalItems: sales.reduce((sum, s) => sum + s.quantity, 0),
      totalTransactions: transactionIds.size,
    };
  }, [sales]);

  const byProduct = useMemo(() => {
    const map = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();
    for (const s of sales) {
      const name = (s as unknown as Record<string, unknown>).product_name as
        | string
        | undefined;
      const key = s.product_id;
      const existing = map.get(key) || {
        name: name || key,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += s.quantity;
      existing.revenue += s.quantity * s.unit_price_cents;
      map.set(key, existing);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  const bySeller = useMemo(() => {
    const map = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();
    for (const s of sales) {
      const name = (s as unknown as Record<string, unknown>).seller_name as
        | string
        | undefined;
      const key = s.seller_id;
      const existing = map.get(key) || {
        name: name || key,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += s.quantity;
      existing.revenue += s.quantity * s.unit_price_cents;
      map.set(key, existing);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  const byPayment = useMemo(() => {
    const map = new Map<string, { quantity: number; revenue: number }>();
    for (const s of sales) {
      const key = s.payment_method;
      const existing = map.get(key) || { quantity: 0, revenue: 0 };
      existing.quantity += s.quantity;
      existing.revenue += s.quantity * s.unit_price_cents;
      map.set(key, existing);
    }
    return [...map.entries()]
      .map(([method, data]) => ({ method, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  if (eventsLoading) {
    return <div className={styles.loading}>Loading events...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Event Summary</h2>
        <select
          className={styles.eventSelect}
          value={eventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          aria-label="Select event"
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
              {ev.active ? ' (Active)' : ''}
            </option>
          ))}
          {events.length === 0 && <option value="">No events</option>}
        </select>
      </div>

      {salesLoading ? (
        <div className={styles.loading}>Loading sales...</div>
      ) : (
        <>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Revenue</div>
              <div className={styles.cardValue}>
                {formatCents(summary.totalRevenue)}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Items Sold</div>
              <div className={styles.cardValue}>{summary.totalItems}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Transactions</div>
              <div className={styles.cardValue}>
                {summary.totalTransactions}
              </div>
            </div>
          </div>

          {sales.length > 0 && (
            <>
              <section className={styles.section}>
                <h3 className={styles.sectionHeading}>By Product</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byProduct.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.quantity}</td>
                        <td>{formatCents(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionHeading}>By Seller</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Seller</th>
                      <th>Qty</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bySeller.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.quantity}</td>
                        <td>{formatCents(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionHeading}>By Payment Method</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Qty</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byPayment.map((row) => (
                      <tr key={row.method}>
                        <td className={styles.capitalize}>{row.method}</td>
                        <td>{row.quantity}</td>
                        <td>{formatCents(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {sales.length === 0 && eventId && (
            <div className={styles.empty}>
              No sales recorded for this event yet.
            </div>
          )}
        </>
      )}
    </div>
  );
}
