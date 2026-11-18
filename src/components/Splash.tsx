import { useEffect, useLayoutEffect, useState } from 'react';
import { motionAllowed } from '../lib/motion';
import './Splash.css';

const KEY = 'bk.splash.seen';
const TITLE = 'Безпечний квест';

function seenThisSession(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return true;
  }
}

/**
 * Заставка при першому відкритті сайту в сесії: щит малюється, галочка прокреслюється,
 * назва з'являється по літерах, потім екран розкривається колом.
 * Не показується в спокійному режимі, при «зменшити рух» і вдруге за сесію. Пропускається кліком або клавішею.
 */
export function Splash() {
  const [phase, setPhase] = useState<'off' | 'in' | 'out'>(() => (!seenThisSession() && motionAllowed() ? 'in' : 'off'));

  // Поки заставка закриває екран, анімації сторінки стоять на паузі й стартують разом із розкриттям.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (phase === 'in') root.dataset.splash = 'on';
    else delete root.dataset.splash;
  }, [phase]);

  useEffect(() => {
    if (phase === 'off') return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* немає сховища — нічого страшного */
    }
    if (phase === 'in') {
      const t = window.setTimeout(() => setPhase('out'), 1700);
      const skip = () => setPhase('out');
      window.addEventListener('keydown', skip, { once: true });
      window.addEventListener('pointerdown', skip, { once: true });
      return () => {
        window.clearTimeout(t);
        window.removeEventListener('keydown', skip);
        window.removeEventListener('pointerdown', skip);
      };
    }
    const t = window.setTimeout(() => setPhase('off'), 750);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === 'off') return null;

  return (
    <div className={`splash splash--${phase}`} aria-hidden="true">
      <div className="splash__inner">
        <svg viewBox="0 0 48 48" className="splash__logo">
          <path className="splash__shield" d="M24 3l17 6v13c0 11-7.5 19-17 23C14.5 41 7 33 7 22V9z" />
          <path className="splash__check" d="M17 24l5 5 10-11" />
        </svg>
        <div className="splash__title">
          {[...TITLE].map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.55 + i * 0.035}s` }}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>
        <div className="splash__bar">
          <span />
        </div>
      </div>
    </div>
  );
}
