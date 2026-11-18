/**
 * Детерміноване перемішування за рядком-зерном (FNV-1a + xorshift).
 * Позиція правильної відповіді відрізняється між питаннями, але однакова
 * на всіх пристроях класу — учні бачать варіанти в тому ж порядку, що й на проєкторі.
 */
export function seededOrder(seed: string, n: number): number[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function seededShuffle<T>(seed: string, items: readonly T[]): T[] {
  return seededOrder(seed, items.length).map((i) => items[i]);
}
