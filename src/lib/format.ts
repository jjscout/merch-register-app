export function formatCents(cents: number): string {
  const dollars = (Math.abs(cents) / 100).toFixed(2);
  return cents < 0 ? `-$${dollars}` : `$${dollars}`;
}
