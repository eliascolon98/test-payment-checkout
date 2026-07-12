/**
 * Formats an amount expressed in COP cents into a display string.
 * e.g. 35990000 -> "$ 359.900"
 */
export const formatCOP = (amountInCents: number): string => {
  const units = Math.round(amountInCents / 100);
  const withThousands = units
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$ ${withThousands}`;
};
