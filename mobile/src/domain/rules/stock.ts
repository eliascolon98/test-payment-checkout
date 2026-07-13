/**
 * Clamps a requested quantity to the valid range [1, stock].
 * Pure domain rule, independent of UI or state.
 */
export const clampQuantity = (requested: number, stock: number): number => {
  if (stock <= 0) {
    return 0;
  }
  return Math.min(Math.max(1, Math.trunc(requested)), stock);
};
