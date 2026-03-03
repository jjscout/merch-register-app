import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

vi.mock('./lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {},
}));

vi.mock('./hooks/useActiveEvent', () => ({
  useActiveEvent: vi.fn(() => ({
    event: {
      id: 'event-1',
      name: 'Test Event',
      starts_at: '2025-01-01',
      ends_at: '2026-12-31',
      active: true,
      created_at: '2025-01-01',
    },
    loading: false,
    error: null,
  })),
}));

vi.mock('./hooks/useSellerByPin', () => ({
  useSellerByPin: vi.fn(() => ({
    lookupByPin: vi.fn(),
    loading: false,
    error: null,
  })),
}));

vi.mock('./hooks/useEvents', () => ({
  useEvents: vi.fn(() => ({
    events: [],
    loading: false,
    error: null,
  })),
}));

vi.mock('./hooks/useEventSales', () => ({
  useEventSales: vi.fn(() => ({
    sales: [],
    loading: false,
    error: null,
  })),
}));

vi.mock('./hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({
    theme: 'system' as const,
    resolvedTheme: 'light' as const,
    toggleTheme: vi.fn(),
  })),
}));

describe('App', () => {
  let matchMediaListeners: Array<(e: { matches: boolean }) => void>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    matchMediaListeners = [];
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query.includes('dark') ? false : false,
        media: query,
        addEventListener: (_: string, cb: (e: { matches: boolean }) => void) =>
          matchMediaListeners.push(cb),
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the app with header and navigation', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Merch Register' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sales' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('renders seller PIN login on sales route when no seller stored', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /enter your pin/i }),
    ).toBeInTheDocument();
  });

  it('renders dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /event summary/i }),
    ).toBeInTheDocument();
  });

  it('renders admin route with PIN gate', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /admin access/i }),
    ).toBeInTheDocument();
  });
});
