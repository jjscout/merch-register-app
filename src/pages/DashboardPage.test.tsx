import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from './DashboardPage';

vi.mock('../hooks/useEvents', () => ({
  useEvents: vi.fn(() => ({
    events: [
      {
        id: 'e-1',
        name: 'Summer Fest',
        active: true,
        starts_at: '2025-06-01',
        ends_at: '2025-06-30',
        created_at: '2025-01-01',
      },
    ],
    loading: false,
    error: null,
  })),
}));

vi.mock('../hooks/useEventSales', () => ({
  useEventSales: vi.fn(() => ({
    sales: [],
    loading: false,
    error: null,
  })),
}));

describe('DashboardPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useEvents } = await import('../hooks/useEvents');
    vi.mocked(useEvents).mockReturnValue({
      events: [
        {
          id: 'e-1',
          name: 'Summer Fest',
          active: true,
          starts_at: '2025-06-01',
          ends_at: '2025-06-30',
          created_at: '2025-01-01',
        },
      ],
      loading: false,
      error: null,
    });
    const { useEventSales } = await import('../hooks/useEventSales');
    vi.mocked(useEventSales).mockReturnValue({
      sales: [],
      loading: false,
      error: null,
    });
  });

  it('renders the Event Summary heading', () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole('heading', { name: 'Event Summary' }),
    ).toBeInTheDocument();
  });

  it('renders the event selector dropdown with the event name', () => {
    render(<DashboardPage />);
    const select = screen.getByRole('combobox', { name: 'Select event' });
    expect(select).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Summer Fest (Active)' }),
    ).toBeInTheDocument();
  });

  it('renders summary cards for Revenue, Items Sold, and Transactions', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Items Sold')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('shows zero values in summary cards when no sales', () => {
    render(<DashboardPage />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('shows empty message when no sales for selected event', () => {
    render(<DashboardPage />);
    expect(
      screen.getByText('No sales recorded for this event yet.'),
    ).toBeInTheDocument();
  });

  it('shows loading state while events are loading', async () => {
    const { useEvents } = await import('../hooks/useEvents');
    vi.mocked(useEvents).mockReturnValue({
      events: [],
      loading: true,
      error: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('shows sales breakdown tables when sales exist', async () => {
    const { useEventSales } = await import('../hooks/useEventSales');
    vi.mocked(useEventSales).mockReturnValue({
      sales: [
        {
          id: 'sale-1',
          product_id: 'p-1',
          seller_id: 's-1',
          event_id: 'e-1',
          quantity: 2,
          unit_price_cents: 2500,
          payment_method: 'cash',
          sold_at: '2025-06-01T12:00:00Z',
          product_variant_id: null,
          variant_display_name: null,
        },
      ],
      loading: false,
      error: null,
    });
    render(<DashboardPage />);
    expect(screen.getByText('By Product')).toBeInTheDocument();
    expect(screen.getByText('By Seller')).toBeInTheDocument();
    expect(screen.getByText('By Payment Method')).toBeInTheDocument();
  });

  it('shows "No events" option when events list is empty', async () => {
    const { useEvents } = await import('../hooks/useEvents');
    vi.mocked(useEvents).mockReturnValue({
      events: [],
      loading: false,
      error: null,
    });
    render(<DashboardPage />);
    expect(
      screen.getByRole('option', { name: 'No events' }),
    ).toBeInTheDocument();
  });
});
