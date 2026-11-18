import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, pop } from '../anim';
import { BODY, C, DISPLAY } from '../theme';
import { Chip, Fill, RiseWords } from './common';

type Part = { t: string; flag?: number };
const MESSAGES: { parts: Part[]; at: number }[] = [
  { parts: [{ t: 'Вітаємо! ' }, { t: 'Ви виграли 5000 скінів', flag: 70 }, { t: '!' }], at: 14 },
  { parts: [{ t: 'Заберіть приз ' }, { t: 'протягом 10 хвилин', flag: 92 }, { t: ': ' }, { t: 'gamest0re-free.xyz', flag: 114 }], at: 30 },
  { parts: [{ t: 'Введіть логін і пароль від ігрового акаунта.' }], at: 46 },
];

/** Сцена 5: телефон, повідомлення шахрая і підозрілі фрагменти, які підсвічуються маркером. */
export const ChatDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = pop(frame, fps, 0, 15);
  const flags = [70, 92, 114].filter((f) => frame >= f).length;
  return (
    <Fill style={{ background: '#dff5fb' }}>
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: (i * 311) % 1920,
            top: (i * 197) % 1080,
            width: 160 + (i % 3) * 120,
            height: 160 + (i % 3) * 120,
            borderRadius: '50%',
            background: C.cyber,
            opacity: 0.08,
            translate: `0 ${Math.sin((frame + i * 20) / 40) * 20}px`,
          }}
        />
      ))}
      <div style={{ position: 'absolute', left: 140, top: 230, width: 820 }}>
        <Chip color={C.cyber}>Квест «Фішинг-детектив»</Chip>
        <RiseWords text="Помічаємо пастки до того, як у них потрапити" size={78} at={6} gap={3} style={{ marginTop: 40 }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 50, opacity: ease(frame, 60, 75) }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 100, color: flags === 3 ? C.alarm : C.ink }}>{flags}/3</span>
          <span style={{ fontSize: 40, color: C.inkSoft, fontWeight: 600 }}>підозрілих місця</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 220,
          top: 120,
          width: 560,
          borderRadius: 56,
          border: `5px solid ${C.ink}`,
          background: '#fff',
          padding: 18,
          boxShadow: `0 16px 0 ${C.ink}`,
          translate: `0 ${interpolate(phone, [0, 1], [500, 0])}px`,
          rotate: `${interpolate(phone, [0, 1], [8, -2])}deg`,
        }}
      >
        <div style={{ width: 130, height: 12, borderRadius: 6, background: C.ink, margin: '4px auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 18px 22px', borderBottom: `3px solid ${C.paper2}` }}>
          <div style={{ width: 68, height: 68, borderRadius: 34, background: C.cyber, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 32 }}>G</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 32 }}>GameStore Official</div>
            <div style={{ color: C.inkSoft, fontSize: 26 }}>Не в контактах</div>
          </div>
        </div>
        <div style={{ background: '#eef8fb', borderRadius: '0 0 40px 40px', padding: '26px 18px 34px', display: 'grid', gap: 18, minHeight: 520 }}>
          {MESSAGES.map((m, i) => {
            const k = pop(frame, fps, m.at, 14);
            return (
              <div
                key={i}
                style={{
                  maxWidth: '90%',
                  padding: '18px 22px',
                  background: '#fff',
                  border: `2px solid #c9d6ee`,
                  borderRadius: '28px 28px 28px 8px',
                  fontFamily: BODY,
                  fontSize: 32,
                  lineHeight: 1.45,
                  opacity: k,
                  translate: `0 ${interpolate(k, [0, 1], [30, 0])}px`,
                  scale: interpolate(k, [0, 1], [0.9, 1]),
                  transformOrigin: 'left bottom',
                }}
              >
                {m.parts.map((p, j) => {
                  if (p.flag === undefined) return <span key={j}>{p.t}</span>;
                  const h = ease(frame, p.flag, p.flag + 12);
                  return (
                    <span
                      key={j}
                      style={{
                        backgroundImage: `linear-gradient(${C.alarmSoft}, ${C.alarmSoft}), linear-gradient(${C.alarm}, ${C.alarm})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${h * 100}% 100%, ${h * 100}% 4px`,
                        backgroundPosition: '0 0, 0 100%',
                        borderRadius: 6,
                        fontWeight: h > 0.5 ? 700 : 400,
                      }}
                    >
                      {p.t}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Fill>
  );
};
