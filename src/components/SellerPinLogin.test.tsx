import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SellerPinLogin } from './SellerPinLogin';

describe('SellerPinLogin', () => {
  it('renders PIN input and submit button', () => {
    render(<SellerPinLogin onLogin={vi.fn()} loading={false} error={null} />);
    expect(screen.getByLabelText('Seller PIN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('calls onLogin with PIN when submitted', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<SellerPinLogin onLogin={onLogin} loading={false} error={null} />);

    await user.type(screen.getByLabelText('Seller PIN'), '1234');
    await user.click(screen.getByRole('button', { name: 'Log In' }));

    expect(onLogin).toHaveBeenCalledWith('1234');
  });

  it('displays error message when provided', () => {
    render(
      <SellerPinLogin onLogin={vi.fn()} loading={false} error="Invalid PIN" />,
    );
    expect(screen.getByText('Invalid PIN')).toBeInTheDocument();
  });

  it('disables submit when loading', () => {
    render(<SellerPinLogin onLogin={vi.fn()} loading={true} error={null} />);
    expect(screen.getByRole('button', { name: 'Checking...' })).toBeDisabled();
  });

  it('disables submit when PIN is empty', () => {
    render(<SellerPinLogin onLogin={vi.fn()} loading={false} error={null} />);
    expect(screen.getByRole('button', { name: 'Log In' })).toBeDisabled();
  });
});
