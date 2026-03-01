import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders a button with aria-label', () => {
    render(
      <ThemeToggle theme="system" resolvedTheme="light" onToggle={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ThemeToggle theme="light" resolvedTheme="light" onToggle={onToggle} />,
    );

    await user.click(screen.getByRole('button', { name: /theme/i }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('shows sun icon for light theme', () => {
    render(
      <ThemeToggle theme="light" resolvedTheme="light" onToggle={vi.fn()} />,
    );
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('shows moon icon for dark theme', () => {
    render(
      <ThemeToggle theme="dark" resolvedTheme="dark" onToggle={vi.fn()} />,
    );
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('shows auto icon for system theme', () => {
    render(
      <ThemeToggle theme="system" resolvedTheme="light" onToggle={vi.fn()} />,
    );
    expect(screen.getByText('💻')).toBeInTheDocument();
  });
});
