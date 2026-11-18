import type { CSSProperties, ReactNode } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { pop } from '../anim';
import { BODY, C, DISPLAY } from '../theme';

export const Fill = ({ children, style }: { children?: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: BODY, color: C.ink, ...style }}>{children}</div>
);

/** Слова заголовка по черзі виринають з-під лінії. */
export const RiseWords = ({
  text,
  at = 0,
  size = 96,
  color = C.ink,
  gap = 4,
  style,
}: {
  text: string;
  at?: number;
  size?: number;
  color?: string;
  gap?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: '-0.02em', color, ...style }}>
      {text.split(' ').map((w, i) => {
        const k = pop(frame, fps, at + i * gap, 16);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}>
            <span
              style={{
                display: 'inline-block',
                translate: `0 ${interpolate(k, [0, 1], [135, 0])}%`,
                rotate: `${interpolate(k, [0, 1], [6, 0])}deg`,
              }}
            >
              {w}
            </span>
            {' '}
          </span>
        );
      })}
    </div>
  );
};

/** Логотип-щит. progress 0→1 керує прокресленням контуру та галочки. */
export const Shield = ({ size = 160, draw = 1, fill = 1, check = 1 }: { size?: number; draw?: number; fill?: number; check?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{ overflow: 'visible' }}>
    <path
      d="M24 3l17 6v13c0 11-7.5 19-17 23C14.5 41 7 33 7 22V9z"
      fill={C.signal}
      fillOpacity={fill}
      stroke={C.signal}
      strokeWidth={2.5}
      strokeLinejoin="round"
      strokeDasharray={130}
      strokeDashoffset={130 * (1 - draw)}
    />
    <path
      d="M17 24l5 5 10-11"
      fill="none"
      stroke={C.ink}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={30}
      strokeDashoffset={30 * (1 - check)}
    />
  </svg>
);

/** Пігулка-підпис над заголовком сцени. */
export const Chip = ({ children, color, at = 0 }: { children: ReactNode; color: string; at?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = pop(frame, fps, at);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 26px 12px 18px',
        borderRadius: 999,
        background: '#fff',
        border: `3px solid ${C.ink}`,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 30,
        scale: interpolate(k, [0, 1], [0.6, 1]),
        opacity: k,
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: 9, background: color }} />
      {children}
    </div>
  );
};
