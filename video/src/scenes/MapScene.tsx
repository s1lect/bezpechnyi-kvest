import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ease, pop } from '../anim';
import { Buildings } from '../art/Buildings';
import type { WorldId } from '../art/types';
import { BODY, C, DISPLAY } from '../theme';
import { Fill, RiseWords } from './common';

const INK = C.ink;
const DISTRICTS: { id: WorldId; title: string; hex: string; tint: string; x: number; y: number }[] = [
  { id: 'home', title: 'Дім і вулиця', hex: C.home, tint: '#ffe2cc', x: 50, y: 50 },
  { id: 'people', title: 'Стосунки', hex: C.people, tint: '#fbd6e8', x: 440, y: 24 },
  { id: 'cyber', title: 'Інтернет', hex: C.cyber, tint: '#cdf0f8', x: 830, y: 50 },
  { id: 'war', title: 'Воєнний час', hex: C.war, tint: '#dcdfff', x: 50, y: 390 },
  { id: 'money', title: 'Гроші', hex: C.money, tint: '#d2f2e2', x: 440, y: 410 },
  { id: 'health', title: "Здоров'я", hex: C.health, tint: '#fdd9da', x: 830, y: 390 },
];

/** Сцена 3: місто збирається по районах, річка тече, лічильник квестів біжить. */
export const MapScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.round(13 * ease(frame, 40, 110));
  const camera = interpolate(frame, [0, 180], [1.04, 1]);
  return (
    <Fill style={{ background: C.paper }}>
      <div style={{ position: 'absolute', left: 120, top: 150, width: 520 }}>
        <RiseWords text="Шість районів міста" size={84} at={2} gap={4} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 50, opacity: ease(frame, 30, 50) }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 200, lineHeight: 1, color: C.ink }}>{count}</span>
          <span style={{ fontFamily: BODY, fontSize: 48, color: C.inkSoft, fontWeight: 600 }}>квестів</span>
        </div>
        <div style={{ fontFamily: BODY, fontSize: 40, color: C.inkSoft, marginTop: 30, opacity: ease(frame, 70, 95), lineHeight: 1.4 }}>
          Від пожежі на кухні до шахраїв у месенджерах
        </div>
      </div>
      <svg viewBox="0 0 1180 660" style={{ position: 'absolute', right: 70, top: 170, width: 1180, scale: camera }}>
        <rect width="1180" height="660" rx="28" fill={C.paper2} stroke={INK} strokeWidth="4" />
        <path
          d="M-20 300c180 40 340-40 520 10s340 90 720-10v60c-380 100-560 30-720-10s-340 30-520-10z"
          fill="#9ccaf5"
          opacity={ease(frame, 0, 20)}
        />
        <path
          d="M-20 330c180 40 340-40 520 10s340 90 720-10"
          stroke="#fff"
          strokeWidth="4"
          strokeDasharray="18 46"
          strokeDashoffset={-frame * 1.2}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M350 160h90M740 160h90M350 500h90M740 500h90"
          stroke="#fff"
          strokeWidth="26"
          strokeLinecap="round"
          opacity={ease(frame, 30, 50)}
        />
        {DISTRICTS.map((d, i) => {
          const k = pop(frame, fps, 8 + i * 7, 11);
          const label = pop(frame, fps, 22 + i * 7, 14);
          return (
            <g key={d.id} transform={`translate(${d.x} ${d.y})`}>
              <g
                style={{
                  translate: `0 ${interpolate(k, [0, 1], [60, 0])}px`,
                  scale: interpolate(k, [0, 1], [0.7, 1]),
                  opacity: Math.min(1, k * 1.5),
                  transformOrigin: '150px 210px',
                  transformBox: 'view-box',
                }}
              >
                <rect width="300" height="210" rx="26" fill={d.tint} stroke={INK} strokeWidth="3.5" />
                <g transform="translate(10 16)">
                  <Buildings id={d.id} color={d.hex} />
                </g>
              </g>
              <g transform="translate(150 226)" style={{ scale: label, transformOrigin: '0 0', transformBox: 'view-box' }}>
                <rect x="-140" y="-25" width="280" height="50" rx="25" fill="#fff" stroke={INK} strokeWidth="3" />
                <circle cx="-112" cy="0" r="10" fill={d.hex} />
                <text x="-92" y="7" fontFamily={DISPLAY} fontSize="20" fontWeight="700" fill={INK}>
                  {d.title}
                </text>
              </g>
            </g>
          );
        })}
        {/* машинка їде дорогою */}
        <g transform={`translate(${interpolate(frame, [60, 170], [352, 436], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} 160)`} opacity={ease(frame, 55, 65)}>
          <rect x="-16" y="-9" width="32" height="14" rx="5" fill={C.signal} stroke={INK} strokeWidth="2.5" />
          <rect x="-8" y="-15" width="16" height="8" rx="3" fill="#bfe0ff" stroke={INK} strokeWidth="2.5" />
          <circle cx="-9" cy="6" r="3.5" fill={INK} />
          <circle cx="9" cy="6" r="3.5" fill={INK} />
        </g>
      </svg>
    </Fill>
  );
};
