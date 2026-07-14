import { clampQuantity } from './stock';

describe('clampQuantity', () => {
  it('clamps within [1, stock]', () => {
    expect(clampQuantity(3, 10)).toBe(3);
    expect(clampQuantity(0, 10)).toBe(1);
    expect(clampQuantity(15, 10)).toBe(10);
  });

  it('returns 0 when there is no stock', () => {
    expect(clampQuantity(5, 0)).toBe(0);
  });

  it('truncates decimals', () => {
    expect(clampQuantity(2.9, 10)).toBe(2);
  });
});
