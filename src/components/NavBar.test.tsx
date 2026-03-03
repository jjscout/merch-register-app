import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('renders Sales, Dashboard, and Admin links', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Sales' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });

  it('Sales link points to /', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Sales' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('Dashboard link points to /dashboard', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard',
    );
  });

  it('Admin link points to /admin', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute(
      'href',
      '/admin',
    );
  });
});
