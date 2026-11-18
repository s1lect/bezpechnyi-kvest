import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, pop } from '../anim';
import { BODY, C, DISPLAY } from '../theme';
import { Fill, RiseWords, Shield } from './common';

const COLORS = [C.signal, C.rescue, C.ok, C.alarm, C.cyber, C.people, C.home];

/** Сцена 8: фінал — логотип, гасло, адреса сайту й конфеті. */
export const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, fps, 0, 9);
  const url = pop(frame, fps, 40, 13);
  return (
    <Fill style={{ background: C.ink, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      {[...Array(90)].map((_, i) => {
        const x0 = random(`x${i}`) * 1920;
        const delay = random(`d${i}`) * 30;
        const t = Math.max(0, frame - 10 - delay);
        const y = -60 + t * (6 + random(`v${i}`) * 6) + 0.05 * t * t;
        const sway = Math.sin((t + i) / 10) * 30;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + sway,
              top: y,
              width: 14 + random(`w${i}`) * 12,
              height: 8 + random(`h${i}`) * 10,
              background: COLORS[i % COLORS.length],
              rotate: `${t * (random(`r${i}`) * 12 - 6)}deg`,
              borderRadius: i % 4 === 0 ? 10 : 2,
              opacity: frame > 10 + delay ? 1 : 0,
            }}
          />
        );
      })}
      <div style={{ display: 'grid', justifyItems: 'center', gap: 46, position: 'relative', zIndex: 1 }}>
        <div style={{ scale: interpolate(logo, [0, 1], [0.3, 1]), rotate: `${interpolate(logo, [0, 1], [-30, 0])}deg` }}>
          <Shield size={180} />
        </div>
        <RiseWords text="Тренуємо безпеку, поки все спокійно" size={92} color="#fff" at={12} gap={3} style={{ maxWidth: 1500 }} />
        <div
          style={{
            padding: '22px 48px',
            borderRadius: 999,
            background: C.signal,
            color: C.ink,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 44,
            border: `4px solid #fff`,
            scale: url,
            boxShadow: `0 0 0 ${interpolate(ease(frame, 55, 100), [0, 1], [0, 26])}px rgba(255,197,49,${0.35 * (1 - ease(frame, 55, 100))})`,
          }}
        >
          s1lect.github.io/bezpechnyi-kvest
        </div>
        <div style={{ fontFamily: BODY, fontSize: 34, color: 'rgba(255,255,255,0.7)', opacity: ease(frame, 60, 80) }}>
          Безпечний квест — відкритий освітній проєкт
        </div>
      </div>
    </Fill>
  );
};
