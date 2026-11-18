import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { pop } from '../anim';
import { BODY, C, DISPLAY } from '../theme';
import { Fill, RiseWords } from './common';

const ITEMS = [
  { t: 'Озвучення українською', c: C.rescue, icon: 'M4 9v6h4l5 4V5L8 9z M16 8.5a5 5 0 0 1 0 7 M18.5 6a8.5 8.5 0 0 1 0 12' },
  { t: 'Працює без інтернету', c: C.ok, icon: 'M3 9a14 14 0 0 1 18 0 M6.5 12.5a9 9 0 0 1 11 0 M10 16a4 4 0 0 1 4 0 M12 20h.01' },
  { t: 'Без реєстрації й реклами', c: C.people, icon: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12l2 2 4-4' },
  { t: 'Спокійний режим', c: C.home, icon: 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z' },
];

/** Сцена 7: чотири головні переваги з'являються плитками. */
export const Features = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Fill style={{ background: C.paper, padding: '150px 140px' }}>
      <RiseWords text="Для кожної школи. Безкоштовно." size={80} at={2} gap={3} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 34, marginTop: 90 }}>
        {ITEMS.map((it, i) => {
          const k = pop(frame, fps, 18 + i * 7, 12);
          return (
            <div
              key={it.t}
              style={{
                padding: '46px 36px',
                borderRadius: 34,
                border: `4px solid ${C.ink}`,
                background: '#fff',
                boxShadow: `0 14px 0 ${it.c}`,
                translate: `0 ${interpolate(k, [0, 1], [120, 0])}px`,
                opacity: Math.min(1, k * 1.4),
                rotate: `${interpolate(k, [0, 1], [i % 2 ? 6 : -6, 0])}deg`,
              }}
            >
              <div style={{ width: 110, height: 110, borderRadius: 30, background: it.c, display: 'grid', placeItems: 'center', border: `4px solid ${C.ink}` }}>
                <svg viewBox="0 0 24 24" width={60} height={60}>
                  <path d={it.icon} fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, lineHeight: 1.2, marginTop: 36 }}>{it.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: BODY, fontSize: 36, color: C.inkSoft, marginTop: 70, opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        Відкритий код і відкритий зміст. Конспекти уроків за програмою НУШ.
      </div>
    </Fill>
  );
};
