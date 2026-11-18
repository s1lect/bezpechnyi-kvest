import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motionAllowed } from '../lib/motion';

/** Легкий об'ємний нахил за курсором (до 4°). На дотикових екранах і без дозволу на рух — вимкнено. */
export function Tilt({ children, max = 4 }: { children: ReactNode; max?: number }) {
  const inner = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !motionAllowed()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (inner.current) inner.current.style.transform = `rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    });
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    if (inner.current) inner.current.style.transform = '';
  };

  return (
    <div className="tilt" onPointerMove={onMove} onPointerLeave={reset}>
      <div className="tilt__inner" ref={inner}>
        {children}
      </div>
    </div>
  );
}
