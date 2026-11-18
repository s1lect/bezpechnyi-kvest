/** Скелетон сторінки під час підвантаження: показує форму майбутнього вмісту, а не порожнечу. */
export function Loading() {
  return (
    <div className="container page skeleton" role="status" aria-live="polite">
      <span className="sr-only">Завантаження…</span>
      <div className="skeleton__line skeleton__line--title" />
      <div className="skeleton__line skeleton__line--lead" />
      <div className="skeleton__line skeleton__line--lead skeleton__line--short" />
      <div className="skeleton__grid">
        <div className="skeleton__card" />
        <div className="skeleton__card" />
        <div className="skeleton__card" />
      </div>
    </div>
  );
}
