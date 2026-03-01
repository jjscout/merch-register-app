import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BreadcrumbNav } from './BreadcrumbNav';

describe('BreadcrumbNav', () => {
  const path = [
    { id: null, name: 'Home' },
    { id: '1', name: 'T-Shirts' },
    { id: '2', name: 'Men' },
  ];

  it('renders all path segment names', () => {
    render(<BreadcrumbNav path={path} onNavigate={vi.fn()} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    expect(screen.getByText('Men')).toBeInTheDocument();
  });

  it('clicking a non-last segment calls onNavigate with correct id', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<BreadcrumbNav path={path} onNavigate={onNavigate} />);

    await user.click(screen.getByText('Home'));
    expect(onNavigate).toHaveBeenCalledWith(null);

    await user.click(screen.getByText('T-Shirts'));
    expect(onNavigate).toHaveBeenCalledWith('1');
  });

  it('last segment is not clickable', () => {
    render(<BreadcrumbNav path={path} onNavigate={vi.fn()} />);
    const lastSegment = screen.getByText('Men');
    expect(lastSegment.tagName).not.toBe('BUTTON');
    expect(lastSegment.closest('button')).toBeNull();
  });

  it('renders separator between segments', () => {
    const { container } = render(
      <BreadcrumbNav path={path} onNavigate={vi.fn()} />,
    );
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav?.textContent).toContain('>');
  });
});
