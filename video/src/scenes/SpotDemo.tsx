import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, pop } from '../anim';
import { Portrait } from '../art/Portrait';
import { Scene } from '../art/Scene';
import { BODY, C, DISPLAY } from '../theme';
import { Chip, Fill } from './common';

const SPOTS = [
  { x: 21, y: 44, r: 7, label: 'Сковорідка без нагляду', at: 40 },
  { x: 33, y: 33, r: 6, label: 'Рушник біля плити', at: 62 },
  { x: 58, y: 54, r: 6, label: 'Пошкоджений дріт', at: 84 },
  { x: 68, y: 86, r: 7, label: 'Перевантажений подовжувач', at: 106 },
  { x: 86, y: 63, r: 6, label: 'Сірники на краю столу', at: 128 },
];

/** Сцена 4: учень знаходить небезпеки на кухні — кола, хвилі, галочки, лічильник. */
export const SpotDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const found = SPOTS.filter((s) => frame >= s.at);
  const last = found[found.length - 1];
  const card = pop(frame, fps, 10, 16);
  const stage = pop(frame, fps, 0, 18);
  return (
    <Fill style={{ background: C.paper }}>
      <div style={{ position: 'absolute', left: 100, top: 70 }}>
        <Chip color={C.home} at={0}>
          Квест «Кухня без пожежі»
        </Chip>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 170,
          width: 1100,
          height: 660,
          borderRadius: 32,
          border: `4px solid ${C.ink}`,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: `0 14px 0 ${C.ink}`,
          scale: interpolate(stage, [0, 1], [0.92, 1]),
          opacity: stage,
        }}
      >
        <Scene id="kitchen" fit="meet">
          {SPOTS.map((s) => {
            const k = pop(frame, fps, s.at, 12);
            const ripple = ease(frame, s.at, s.at + 22);
            if (frame < s.at) return null;
            return (
              <g key={s.label}>
                <circle cx={s.x * 10} cy={s.y * 6} r={s.r * 10 * interpolate(k, [0, 1], [0.5, 1])} fill="rgba(31,169,122,0.18)" stroke={C.ok} strokeWidth="5" />
                <circle cx={s.x * 10} cy={s.y * 6} r={s.r * 10 * (0.6 + ripple * 1.2)} fill="none" stroke={C.ok} strokeWidth="4" opacity={1 - ripple} />
                <g transform={`translate(${s.x * 10 + s.r * 7} ${s.y * 6 - s.r * 7}) scale(${k})`}>
                  <circle r="20" fill={C.ok} stroke={C.ink} strokeWidth="3" />
                  <path d="M-9 0l6 7 12-14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            );
          })}
        </Scene>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 100,
          top: 170,
          width: 560,
          padding: 44,
          borderRadius: 32,
          border: `4px solid ${C.ink}`,
          background: '#fff',
          boxShadow: `0 14px 0 ${C.ink}`,
          translate: `${interpolate(card, [0, 1], [80, 0])}px 0`,
          opacity: card,
          display: 'grid',
          gap: 26,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ borderRadius: '50%', border: `4px solid ${C.ink}`, overflow: 'hidden', width: 96, height: 96 }}>
            <Portrait id="olya" size={88} />
          </div>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 36 }}>Оля</div>
            <div style={{ fontSize: 28, color: C.inkSoft }}>рятувальниця</div>
          </div>
        </div>
        <div style={{ fontSize: 38, lineHeight: 1.35, fontWeight: 500 }}>Знайди на кухні 5 небезпек.</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span
            key={found.length}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 1,
              color: found.length === 5 ? C.ok : C.ink,
              scale: last ? interpolate(frame - last.at, [0, 6, 14], [1.35, 1.1, 1], { extrapolateRight: 'clamp' }) : 1,
              transformOrigin: 'left bottom',
              display: 'inline-block',
            }}
          >
            {found.length}/5
          </span>
          <span style={{ fontSize: 32, color: C.inkSoft, fontWeight: 600 }}>знайдено</span>
        </div>
        <div
          style={{
            minHeight: 110,
            padding: '22px 26px',
            borderRadius: 18,
            background: last ? C.okSoft : C.paper2,
            borderLeft: `10px solid ${last ? C.ok : C.paper2}`,
            fontFamily: BODY,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {last ? `✓ ${last.label}` : ' '}
        </div>
      </div>
    </Fill>
  );
};
