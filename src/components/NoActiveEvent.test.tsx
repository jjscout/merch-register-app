import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NoActiveEvent } from './NoActiveEvent';

describe('NoActiveEvent', () => {
  it('renders no active event message', () => {
    render(<NoActiveEvent />);
    expect(
      screen.getByRole('heading', { name: /no active event/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no active event right now/i)).toBeInTheDocument();
  });

  it('shows error when provided', () => {
    render(<NoActiveEvent error="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('does not show error block when no error', () => {
    const { container } = render(<NoActiveEvent />);
    expect(container.querySelector('[class*="error"]')).not.toBeInTheDocument();
  });
});
