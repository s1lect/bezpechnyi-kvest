import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, pop } from '../anim';
import { BODY, C, DISPLAY } from '../theme';
import { Fill, Shield } from './common';

const TITLE = 'Безпечний квест';

/** Сцена 1: щит малюється лінією, галочка прокреслюється, назва виринає по літерах. */
export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, fps, 34, 10);
  return (
    <Fill style={{ background: C.ink, display: 'grid', placeItems: 'center' }}>
      {/* м'яке світло й сітка точок, що повільно пливе */}
      <div
        style={{
          position: 'absolute',
          inset: -200,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 2px, transparent 2px)',
          backgroundSize: '48px 48px',
          translate: `${-frame * 0.4}px ${-frame * 0.25}px`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,197,49,0.22), transparent 60%)',
          scale: interpolate(frame, [0, 150], [0.7, 1.1]),
        }}
      />
      <div style={{ display: 'grid', justifyItems: 'center', gap: 40 }}>
        <div style={{ scale: interpolate(logo, [0, 1], [1, 1.0]), rotate: `${interpolate(logo, [0, 0.5, 1], [0, -6, 0])}deg` }}>
          <Shield size={220} draw={ease(frame, 0, 26)} fill={ease(frame, 18, 30)} check={ease(frame, 28, 40)} />
        </div>
        <div style={{ display: 'flex', overflow: 'hidden', paddingBottom: 10 }}>
          {[...TITLE].map((ch, i) => {
            const k = pop(frame, fps, 30 + i * 1.6, 15);
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 110,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  translate: `0 ${interpolate(k, [0, 1], [120, 0])}%`,
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            fontFamily: BODY,
            fontSize: 44,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.78)',
            opacity: ease(frame, 62, 85),
            translate: `0 ${interpolate(ease(frame, 62, 85), [0, 1], [24, 0])}px`,
          }}
        >
          Інтерактивні квести з безпеки для шкіл НУШ
        </div>
      </div>
    </Fill>
  );
};
