import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SalesRoute } from './SalesRoute';

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {},
}));

vi.mock('../hooks/useActiveEvent', () => ({
  useActiveEvent: vi.fn(() => ({
    event: {
      id: 'e-1',
      name: 'Test Event',
      active: true,
      starts_at: '2025-01-01',
      ends_at: '2025-12-31',
      created_at: '2025-01-01',
    },
    loading: false,
    error: null,
  })),
}));

vi.mock('../hooks/useSellerByPin', () => ({
  useSellerByPin: vi.fn(() => ({
    lookupByPin: vi.fn(),
    loading: false,
    error: null,
  })),
}));

vi.mock('./SalesPage', () => ({
  SalesPage: () => <div>SalesPage</div>,
}));

vi.mock('../components/SellerPinLogin', () => ({
  SellerPinLogin: ({
    onLogin,
  }: {
    onLogin: (pin: string) => void;
    loading: boolean;
    error: string | null;
  }) => (
    <div>
      <h2>Enter Your PIN</h2>
      <button onClick={() => onLogin('1234')}>Log In</button>
    </div>
  ),
}));

vi.mock('../components/NoActiveEvent', () => ({
  NoActiveEvent: ({ error }: { error?: string | null }) => (
    <div>
      <h2>No Active Event</h2>
      {error && <div>{error}</div>}
    </div>
  ),
}));

const SELLER_STORAGE_KEY = 'merch-register-seller-id';
const SELLER_NAME_KEY = 'merch-register-seller-name';

describe('SalesRoute', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    const { useActiveEvent } = await import('../hooks/useActiveEvent');
    vi.mocked(useActiveEvent).mockReturnValue({
      event: {
        id: 'e-1',
        name: 'Test Event',
        active: true,
        starts_at: '2025-01-01',
        ends_at: '2025-12-31',
        created_at: '2025-01-01',
      },
      loading: false,
      error: null,
    });
    const { useSellerByPin } = await import('../hooks/useSellerByPin');
    vi.mocked(useSellerByPin).mockReturnValue({
      lookupByPin: vi.fn(),
      loading: false,
      error: null,
    });
  });

  it('shows PIN login when no seller is stored in localStorage', () => {
    render(<SalesRoute />);
    expect(
      screen.getByRole('heading', { name: 'Enter Your PIN' }),
    ).toBeInTheDocument();
  });

  it('shows SalesPage when seller ID is stored in localStorage', () => {
    localStorage.setItem(SELLER_STORAGE_KEY, 'seller-1');
    localStorage.setItem(SELLER_NAME_KEY, 'Alice');
    render(<SalesRoute />);
    expect(screen.getByText('SalesPage')).toBeInTheDocument();
  });

  it('shows loading state while event is loading', async () => {
    const { useActiveEvent } = await import('../hooks/useActiveEvent');
    vi.mocked(useActiveEvent).mockReturnValue({
      event: null,
      loading: true,
      error: null,
    });
    render(<SalesRoute />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows NoActiveEvent when there is no active event', async () => {
    const { useActiveEvent } = await import('../hooks/useActiveEvent');
    vi.mocked(useActiveEvent).mockReturnValue({
      event: null,
      loading: false,
      error: null,
    });
    render(<SalesRoute />);
    expect(
      screen.getByRole('heading', { name: 'No Active Event' }),
    ).toBeInTheDocument();
  });

  it('shows seller name in seller bar when seller is logged in', () => {
    localStorage.setItem(SELLER_STORAGE_KEY, 'seller-1');
    localStorage.setItem(SELLER_NAME_KEY, 'Alice');
    render(<SalesRoute />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows active event name in seller bar when seller is logged in', () => {
    localStorage.setItem(SELLER_STORAGE_KEY, 'seller-1');
    localStorage.setItem(SELLER_NAME_KEY, 'Alice');
    render(<SalesRoute />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('shows Change Seller button when seller is logged in', () => {
    localStorage.setItem(SELLER_STORAGE_KEY, 'seller-1');
    localStorage.setItem(SELLER_NAME_KEY, 'Alice');
    render(<SalesRoute />);
    expect(
      screen.getByRole('button', { name: 'Change Seller' }),
    ).toBeInTheDocument();
  });
});
