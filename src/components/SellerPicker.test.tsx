import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SellerPicker } from './SellerPicker';
import type { Seller } from '../lib/types';

const mockSellers: Seller[] = [
  { id: 'seller-1', name: 'Alice', created_at: '2024-01-01' },
  { id: 'seller-2', name: 'Bob', created_at: '2024-01-01' },
  { id: 'seller-3', name: 'Charlie', created_at: '2024-01-01' },
];

describe('SellerPicker', () => {
  it('renders a heading prompting seller selection', () => {
    render(<SellerPicker sellers={mockSellers} onSelect={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /select.+seller/i }),
    ).toBeInTheDocument();
  });

  it('renders a button for each seller', () => {
    render(<SellerPicker sellers={mockSellers} onSelect={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bob' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Charlie' })).toBeInTheDocument();
  });

  it('calls onSelect with the seller id when a button is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SellerPicker sellers={mockSellers} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Bob' }));

    expect(onSelect).toHaveBeenCalledWith('seller-2');
  });
});
