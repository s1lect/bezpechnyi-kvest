/**
 * Чи можна зараз показувати декоративний рух.
 * Вимикаємо, якщо користувач просить «зменшити рух» у системі або ввімкнув спокійний режим.
 */
export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  if (document.documentElement.dataset.calm === 'true') return false;
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Запустити зміну DOM як View Transition, якщо браузер це вміє і рух дозволено. */
export function withViewTransition(update: () => void): void {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && motionAllowed()) doc.startViewTransition(update);
  else update();
}
