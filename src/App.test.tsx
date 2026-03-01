import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

const mockSellers = [
  { id: 'seller-1', name: 'Alice', pin: '1111', created_at: '2024-01-01' },
  { id: 'seller-2', name: 'Bob', pin: '2222', created_at: '2024-01-01' },
];

vi.mock('./lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {},
}));

vi.mock('./hooks/useSellers', () => ({
  useSellers: vi.fn(() => ({
    sellers: mockSellers,
    loading: false,
    error: null,
  })),
}));

vi.mock('./pages/SalesPage', () => ({
  SalesPage: ({ sellerId }: { sellerId: string }) => (
    <div data-testid="sales-page">SalesPage:{sellerId}</div>
  ),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows the seller picker when no seller is stored', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /select.+seller/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bob' })).toBeInTheDocument();
    expect(screen.queryByTestId('sales-page')).not.toBeInTheDocument();
  });

  it('transitions to the sales page after selecting a seller', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Bob' }));

    expect(screen.getByTestId('sales-page')).toHaveTextContent(
      'SalesPage:seller-2',
    );
    expect(
      screen.queryByRole('heading', { name: /select.+seller/i }),
    ).not.toBeInTheDocument();
  });

  it('shows the seller name in the header after selection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Alice' }));

    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows a Change Seller button in the header', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Alice' }));

    expect(
      screen.getByRole('button', { name: /change seller/i }),
    ).toBeInTheDocument();
  });

  it('returns to the seller picker when Change Seller is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Alice' }));
    await user.click(screen.getByRole('button', { name: /change seller/i }));

    expect(
      screen.getByRole('heading', { name: /select.+seller/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('sales-page')).not.toBeInTheDocument();
  });

  it('does not show a seller dropdown select element', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Alice' }));

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('clears localStorage when Change Seller is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Alice' }));
    await user.click(screen.getByRole('button', { name: /change seller/i }));

    expect(localStorage.getItem('merch-register-seller-id')).toBeNull();
  });

  it('remembers the seller across renders when stored in localStorage', () => {
    localStorage.setItem('merch-register-seller-id', 'seller-2');

    render(<App />);

    // Should skip the picker and go straight to sales page
    expect(screen.getByTestId('sales-page')).toHaveTextContent(
      'SalesPage:seller-2',
    );
    expect(
      screen.queryByRole('heading', { name: /select.+seller/i }),
    ).not.toBeInTheDocument();
  });
});
