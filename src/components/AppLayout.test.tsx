import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppLayout } from './AppLayout';

vi.mock('../hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({
    theme: 'system' as const,
    resolvedTheme: 'light' as const,
    toggleTheme: vi.fn(),
  })),
}));

describe('AppLayout', () => {
  let matchMediaListeners: Array<(e: { matches: boolean }) => void>;

  beforeEach(() => {
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

  it('renders the header with title', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Merch Register' }),
    ).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Sales' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });
});
