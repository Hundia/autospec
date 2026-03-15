/**
 * Format a quantity number into a human-readable string.
 * Converts common decimal fractions to Unicode fraction characters.
 * Examples: 0.5 → "½", 0.25 → "¼", 1.5 → "1 ½"
 */
export function formatQuantity(quantity: number): string {
  const fractions: [number, string][] = [
    [0.25, '¼'],
    [0.33, '⅓'],
    [0.5, '½'],
    [0.67, '⅔'],
    [0.75, '¾'],
  ];

  const whole = Math.floor(quantity);
  const decimal = quantity - whole;

  const fraction = fractions.find(([val]) => Math.abs(decimal - val) < 0.03);

  if (fraction && whole > 0) return `${whole} ${fraction[1]}`;
  if (fraction) return fraction[1];
  if (decimal === 0) return `${whole}`;

  // Return clean decimal without unnecessary trailing zeros
  return parseFloat(quantity.toFixed(2)).toString();
}
