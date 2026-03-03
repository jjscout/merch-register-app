import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsAdmin } from './EventsAdmin';

vi.mock('../../hooks/useAdminEvents', () => ({
  useAdminEvents: vi.fn(() => ({
    events: [],
    loading: false,
    error: null,
    addEvent: vi.fn(),
    toggleActive: vi.fn(),
    deleteEvent: vi.fn(),
  })),
}));

describe('EventsAdmin', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAdminEvents } = await import('../../hooks/useAdminEvents');
    vi.mocked(useAdminEvents).mockReturnValue({
      events: [],
      loading: false,
      error: null,
      addEvent: vi.fn(),
      toggleActive: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders the Events heading', () => {
    render(<EventsAdmin />);
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
  });

  it('renders the add event form with name, start, end inputs and submit button', () => {
    render(<EventsAdmin />);
    expect(screen.getByPlaceholderText('Event name')).toBeInTheDocument();
    const dateInputs = screen.getAllByDisplayValue('');
    expect(dateInputs.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole('button', { name: 'Add Event' }),
    ).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    const { useAdminEvents } = await import('../../hooks/useAdminEvents');
    vi.mocked(useAdminEvents).mockReturnValue({
      events: [],
      loading: true,
      error: null,
      addEvent: vi.fn(),
      toggleActive: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn(),
      refetch: vi.fn(),
    });
    render(<EventsAdmin />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('shows empty state when no events', () => {
    render(<EventsAdmin />);
    expect(screen.getByText('No events yet.')).toBeInTheDocument();
  });

  it('renders events list with name, badge, and action buttons', async () => {
    const { useAdminEvents } = await import('../../hooks/useAdminEvents');
    vi.mocked(useAdminEvents).mockReturnValue({
      events: [
        {
          id: 'ev-1',
          name: 'Summer Fest',
          starts_at: '2025-06-01T00:00:00Z',
          ends_at: '2025-06-02T00:00:00Z',
          active: true,
          created_at: '2025-01-01',
        },
        {
          id: 'ev-2',
          name: 'Winter Show',
          starts_at: '2025-12-01T00:00:00Z',
          ends_at: '2025-12-02T00:00:00Z',
          active: false,
          created_at: '2025-01-01',
        },
      ],
      loading: false,
      error: null,
      addEvent: vi.fn(),
      toggleActive: vi.fn(),
      deleteEvent: vi.fn(),
      updateEvent: vi.fn(),
      refetch: vi.fn(),
    });
    render(<EventsAdmin />);
    expect(screen.getByText('Summer Fest')).toBeInTheDocument();
    expect(screen.getByText('Winter Show')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Deactivate' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Activate' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });
});
