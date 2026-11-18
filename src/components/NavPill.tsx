import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Навігація з «повзунком»: жовта підкладка плавно перетікає до активної вкладки.
 * Позицію рахуємо за розмірами активного посилання (aria-current="page").
 */
export function NavPill({ children, label, watch }: { children: ReactNode; label: string; watch: string }) {
  const ref = useRef<HTMLElement>(null);
  const [box, setBox] = useState<{ x: number; w: number; visible: boolean }>({ x: 0, w: 0, visible: false });

  useLayoutEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const measure = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      if (!active) return setBox((b) => ({ ...b, visible: false }));
      setBox({ x: active.offsetLeft, w: active.offsetWidth, visible: true });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => ro.disconnect();
  }, [watch]);

  return (
    <nav ref={ref} className="topnav" aria-label={label}>
      <span
        className="topnav__pill"
        aria-hidden="true"
        style={{ transform: `translateX(${box.x}px)`, width: box.w, opacity: box.visible ? 1 : 0 }}
      />
      {children}
    </nav>
  );
}
