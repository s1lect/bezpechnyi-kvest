import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Доступні вкладки (WAI-ARIA Tabs): стрілки, Home/End, індикатор перетікає між вкладками,
 * а панель в'їжджає з того боку, куди рухається користувач.
 */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ind, setInd] = useState({ x: 0, w: 0 });
  const uid = useId();

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [active]);

  const select = (i: number) => {
    setDir(i >= active ? 1 : -1);
    setActive(i);
  };

  const onKey = (e: KeyboardEvent) => {
    const last = items.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key]);
    tabRefs.current[map[e.key]]?.focus();
  };

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label={label} ref={listRef} onKeyDown={onKey}>
        <span className="tabs__indicator" aria-hidden="true" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} />
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`${uid}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            className="tabs__tab"
            onClick={() => select(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        key={items[active].id}
        role="tabpanel"
        id={`${uid}-panel-${items[active].id}`}
        aria-labelledby={`${uid}-tab-${items[active].id}`}
        className={dir === 1 ? 'tabs__panel tabs__panel--fwd' : 'tabs__panel tabs__panel--back'}
        tabIndex={0}
      >
        {items[active].content}
      </div>
    </div>
  );
}
