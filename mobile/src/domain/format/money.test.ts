import { formatCOP } from './money';

describe('formatCOP', () => {
  it('formats cents into COP with thousand separators', () => {
    expect(formatCOP(35990000)).toBe('$ 359.900');
    expect(formatCOP(100000)).toBe('$ 1.000');
    expect(formatCOP(0)).toBe('$ 0');
  });
});
