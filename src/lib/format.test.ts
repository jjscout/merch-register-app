import { describe, it, expect } from 'vitest';
import { formatCents } from './format';

describe('formatCents', () => {
  it('formats whole dollars', () => {
    expect(formatCents(2500)).toBe('$25.00');
  });

  it('formats cents only', () => {
    expect(formatCents(99)).toBe('$0.99');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('$0.00');
  });

  it('formats single cent', () => {
    expect(formatCents(1)).toBe('$0.01');
  });

  it('formats large amounts', () => {
    expect(formatCents(10000)).toBe('$100.00');
  });
});
