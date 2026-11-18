import { useEffect, useState } from 'react';
import { motionAllowed } from './motion';

/** Плавний лічильник від 0 до target (easeOutCubic). Без дозволу на рух одразу показує результат. */
export function useCountUp(target: number, duration = 900, delay = 300): number {
  const [animate] = useState(motionAllowed);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const timer = window.setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / duration);
        setValue(Math.round(target * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [animate, target, duration, delay]);

  return animate ? value : target;
}
