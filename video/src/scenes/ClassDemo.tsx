import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, pop } from '../anim';
import { BODY, C, DISPLAY } from '../theme';
import { Fill, RiseWords } from './common';

const OPTIONS = [
  { t: 'Беру речі й чекаю команди вчителя', votes: 19, ok: true },
  { t: 'Спершу дочитую новини', votes: 5, ok: false },
  { t: 'Біжу в укриття першим', votes: 3, ok: false },
];

/** Сцена 6: класний режим на проєкторі — голоси учнів ростуть, правильна відповідь підсвічується. */
export const ClassDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const screen = pop(frame, fps, 0, 16);
  const reveal = frame >= 110;
  const qr = pop(frame, fps, 120, 12);
  return (
    <Fill style={{ background: C.paper }}>
      <div style={{ position: 'absolute', left: 120, top: 110, width: 1180 }}>
        <RiseWords text="Урок на 45 хвилин — уже готовий" size={76} at={2} gap={3} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 300,
          width: 1100,
          padding: 46,
          borderRadius: 30,
          border: `4px solid ${C.ink}`,
          background: '#fff',
          boxShadow: `0 14px 0 ${C.ink}`,
          opacity: screen,
          translate: `0 ${interpolate(screen, [0, 1], [60, 0])}px`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 34 }}>Повітряна тривога</div>
          <div style={{ padding: '8px 22px', borderRadius: 999, background: C.signal, fontWeight: 700, fontSize: 26, border: `3px solid ${C.ink}` }}>Класний режим</div>
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, marginBottom: 28, fontWeight: 500 }}>Під час уроку лунає сигнал тривоги. Що робиш?</div>
        <div style={{ display: 'grid', gap: 18 }}>
          {OPTIONS.map((o, i) => {
            const v = Math.round(o.votes * ease(frame, 30 + i * 6, 95 + i * 6));
            const isOk = reveal && o.ok;
            const k = pop(frame, fps, 110, 10);
            return (
              <div
                key={o.t}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '20px 26px',
                  borderRadius: 20,
                  border: `3px solid ${isOk ? C.ok : C.ink}`,
                  background: isOk ? C.okSoft : '#fff',
                  overflow: 'hidden',
                  scale: isOk ? interpolate(k, [0, 0.5, 1], [1, 1.03, 1]) : 1,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${(v / 27) * 100}%`,
                    background: isOk ? 'rgba(31,169,122,0.18)' : 'rgba(43,91,232,0.08)',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    fontSize: 26,
                    background: isOk ? C.ok : C.paper2,
                    color: isOk ? '#fff' : C.ink,
                    border: `3px solid ${isOk ? C.ok : C.ink}`,
                  }}
                >
                  {isOk ? '✓' : i + 1}
                </span>
                <span style={{ position: 'relative', flex: 1, fontSize: 32, fontFamily: BODY }}>{o.t}</span>
                <span style={{ position: 'relative', fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, minWidth: 60, textAlign: 'right' }}>{v}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 140,
          top: 330,
          width: 460,
          padding: 36,
          borderRadius: 30,
          border: `4px solid ${C.ink}`,
          background: '#fff',
          boxShadow: `0 14px 0 ${C.ink}`,
          scale: qr,
          rotate: `${interpolate(qr, [0, 1], [-10, 3])}deg`,
          display: 'grid',
          justifyItems: 'center',
          gap: 22,
        }}
      >
        <svg viewBox="0 0 21 21" width={300} height={300} shapeRendering="crispEdges">
          {[...Array(21 * 21)].map((_, n) => {
            const x = n % 21;
            const y = Math.floor(n / 21);
            const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x >= a + 2 && x <= a + 4 && y >= b + 2 && y <= b + 4));
            const inFinderZone = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
            const on = inFinderZone ? finder(0, 0) || finder(14, 0) || finder(0, 14) : ((x * 7 + y * 13 + x * y) % 5) < 2;
            return on ? <rect key={n} x={x} y={y} width={1} height={1} fill={C.ink} /> : null;
          })}
        </svg>
        <div style={{ fontSize: 30, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>Або кожен учень — на своєму телефоні</div>
      </div>
    </Fill>
  );
};
