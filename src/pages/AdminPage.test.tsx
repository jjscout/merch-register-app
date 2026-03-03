import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminPage } from './AdminPage';

vi.mock('../components/AdminPinGate', () => ({
  AdminPinGate: ({
    onUnlock,
  }: {
    onUnlock: () => void;
    correctPin: string;
  }) => (
    <div>
      <h2>Admin Access</h2>
      <button onClick={onUnlock}>Unlock</button>
    </div>
  ),
}));

vi.mock('../components/admin/EventsAdmin', () => ({
  EventsAdmin: () => <div>EventsAdmin</div>,
}));

vi.mock('../components/admin/SellersAdmin', () => ({
  SellersAdmin: () => <div>SellersAdmin</div>,
}));

vi.mock('../components/admin/CategoriesAdmin', () => ({
  CategoriesAdmin: () => <div>CategoriesAdmin</div>,
}));

vi.mock('../components/admin/ProductsAdmin', () => ({
  ProductsAdmin: () => <div>ProductsAdmin</div>,
}));

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows PIN gate initially with Admin Access heading', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Admin Access' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unlock' })).toBeInTheDocument();
  });

  it('does not show admin nav before unlocking', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.queryByRole('link', { name: 'Events' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Sellers' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Lock Admin' }),
    ).not.toBeInTheDocument();
  });

  it('shows admin sidebar nav after unlock', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Unlock' }));
    expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sellers' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Categories' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
  });

  it('shows Lock Admin button after unlock', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Unlock' }));
    expect(
      screen.getByRole('button', { name: 'Lock Admin' }),
    ).toBeInTheDocument();
  });

  it('returns to PIN gate after clicking Lock Admin', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Unlock' }));
    await user.click(screen.getByRole('button', { name: 'Lock Admin' }));
    expect(
      screen.getByRole('heading', { name: 'Admin Access' }),
    ).toBeInTheDocument();
  });

  it('shows EventsAdmin content on the admin index route after unlock', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Unlock' }));
    expect(screen.getByText('EventsAdmin')).toBeInTheDocument();
  });
});
