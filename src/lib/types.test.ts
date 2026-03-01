import { describe, it, expectTypeOf } from 'vitest';
import type { MerchEvent, Seller, Sale } from './types';

describe('MerchEvent type', () => {
  it('has required fields', () => {
    expectTypeOf<MerchEvent>().toHaveProperty('id');
    expectTypeOf<MerchEvent>().toHaveProperty('name');
    expectTypeOf<MerchEvent>().toHaveProperty('starts_at');
    expectTypeOf<MerchEvent>().toHaveProperty('ends_at');
    expectTypeOf<MerchEvent>().toHaveProperty('active');
    expectTypeOf<MerchEvent>().toHaveProperty('created_at');
  });

  it('active is boolean', () => {
    expectTypeOf<MerchEvent['active']>().toBeBoolean();
  });
});

describe('Seller type', () => {
  it('has pin field', () => {
    expectTypeOf<Seller>().toHaveProperty('pin');
  });

  it('pin is nullable string', () => {
    expectTypeOf<Seller['pin']>().toEqualTypeOf<string | null>();
  });
});

describe('Sale type', () => {
  it('has event_id field', () => {
    expectTypeOf<Sale>().toHaveProperty('event_id');
  });

  it('event_id is nullable string', () => {
    expectTypeOf<Sale['event_id']>().toEqualTypeOf<string | null>();
  });
});
