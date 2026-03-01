import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SaleConfirmation } from './SaleConfirmation';

describe('SaleConfirmation', () => {
  it('renders product name, quantity, formatted total, and payment method', () => {
    render(
      <SaleConfirmation
        productName="Classic T-Shirt"
        quantity={3}
        totalCents={7500}
        paymentMethod="card"
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText(/Classic T-Shirt/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
    expect(screen.getByText(/card/i)).toBeInTheDocument();
  });

  it('shows a success message', () => {
    render(
      <SaleConfirmation
        productName="Hoodie"
        quantity={1}
        totalCents={4500}
        paymentMethod="cash"
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText(/sale recorded/i)).toBeInTheDocument();
  });

  it('calls onDone when done button is clicked', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    render(
      <SaleConfirmation
        productName="Hoodie"
        quantity={1}
        totalCents={4500}
        paymentMethod="cash"
        onDone={onDone}
      />,
    );

    await user.click(screen.getByRole('button', { name: /new sale/i }));

    expect(onDone).toHaveBeenCalledOnce();
  });
});
