import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AdminPinGate } from './AdminPinGate';

describe('AdminPinGate', () => {
  it('renders PIN input and unlock button', () => {
    render(<AdminPinGate correctPin="1234" onUnlock={vi.fn()} />);
    expect(screen.getByLabelText('Admin PIN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unlock' })).toBeInTheDocument();
  });

  it('calls onUnlock with correct PIN', async () => {
    const user = userEvent.setup();
    const onUnlock = vi.fn();
    render(<AdminPinGate correctPin="1234" onUnlock={onUnlock} />);

    await user.type(screen.getByLabelText('Admin PIN'), '1234');
    await user.click(screen.getByRole('button', { name: 'Unlock' }));

    expect(onUnlock).toHaveBeenCalledOnce();
  });

  it('shows error on wrong PIN', async () => {
    const user = userEvent.setup();
    render(<AdminPinGate correctPin="1234" onUnlock={vi.fn()} />);

    await user.type(screen.getByLabelText('Admin PIN'), '9999');
    await user.click(screen.getByRole('button', { name: 'Unlock' }));

    expect(screen.getByText(/incorrect admin pin/i)).toBeInTheDocument();
  });

  it('disables submit when PIN is empty', () => {
    render(<AdminPinGate correctPin="1234" onUnlock={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Unlock' })).toBeDisabled();
  });
});
