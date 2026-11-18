import { useNavigate } from 'react-router-dom';
import { WORLDS } from '../data/worlds';
import { questsByWorld } from '../data/quests';
import type { WorldId } from '../types';
import { loadProgress } from '../lib/progress';
import './CityMap.css';

const INK = '#172b4d';
const S = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

const TINT: Record<WorldId, string> = {
  home: '#ffe2cc',
  people: '#fbd6e8',
  cyber: '#cdf0f8',
  war: '#dcdfff',
  money: '#d2f2e2',
  health: '#fdd9da',
};

type Pos = Record<WorldId, { x: number; y: number }>;

const WIDE: Pos = {
  home: { x: 50, y: 50 },
  people: { x: 440, y: 24 },
  cyber: { x: 830, y: 50 },
  war: { x: 50, y: 390 },
  money: { x: 440, y: 410 },
  health: { x: 830, y: 390 },
};

const TALL: Pos = {
  home: { x: 30, y: 40 },
  people: { x: 370, y: 40 },
  cyber: { x: 30, y: 400 },
  war: { x: 370, y: 400 },
  money: { x: 30, y: 760 },
  health: { x: 370, y: 760 },
};

/** Вікно, яке час від часу «засвічується» ввечері. */
function Win({ x, y, w = 20, h = 22, d = 0 }: { x: number; y: number; w?: number; h?: number; d?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="#bfe0ff" {...S} className="amb-win" style={{ animationDelay: `${d}s` }} />;
}

function Buildings({ id, color }: { id: WorldId; color: string }) {
  switch (id) {
    case 'home':
      return (
        <g>
          {/* дим із комина */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="220" cy="26" r="7" fill="#c9d6ee" className="amb-smoke" style={{ animationDelay: `${i * 1.1}s` }} />
          ))}
          <path d="M40 150V95l45-38 45 38v55z" fill="#fff" {...S} />
          <path d="M30 100l55-52 55 52" fill={color} {...S} />
          <rect x="70" y="112" width="30" height="38" fill="#c08457" {...S} />
          <path d="M160 150v-70h70v70z" fill="#fff" {...S} />
          <path d="M150 84l45-40 45 40" fill={color} {...S} />
          <Win x={178} y={98} w={20} h={20} d={1.2} />
          <path d="M214 50v-18h12v28" fill="#9aa8c1" {...S} />
        </g>
      );
    case 'people':
      return (
        <g>
          <rect x="40" y="70" width="200" height="80" fill="#fff" {...S} />
          <path d="M110 70V44h60v26" fill={color} {...S} />
          <circle cx="140" cy="56" r="9" fill="#fff" {...S} />
          <path d="M140 50v6l4 3" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
          {[56, 88, 172, 204].map((x, i) => (
            <Win key={x} x={x} y={88} d={i * 0.9} />
          ))}
          <rect x="124" y="112" width="32" height="38" fill={color} {...S} />
          <path d="M140 44V18" {...S} />
          <path d="M141 20l26 8-26 8" fill="#ffc531" {...S} className="amb-flag" />
        </g>
      );
    case 'cyber':
      return (
        <g>
          <rect x="70" y="40" width="70" height="110" fill="#fff" {...S} />
          <rect x="150" y="70" width="70" height="80" fill={color} {...S} />
          {[0, 1, 2].map((r) => (
            <path
              key={r}
              d={`M84 ${62 + r * 26}h42`}
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              className="amb-data"
              style={{ animationDelay: `${r * 0.4}s` }}
            />
          ))}
          <path d="M105 40V18" {...S} />
          <circle cx="105" cy="16" r="3.5" fill={INK} />
          <path d="M94 10c6-6 16-6 22 0" {...S} fill="none" className="amb-wifi" style={{ animationDelay: '0s' }} />
          <path d="M86 2c11-11 27-11 38 0" {...S} fill="none" className="amb-wifi" style={{ animationDelay: '0.3s' }} />
          <rect x="166" y="88" width="38" height="24" rx="4" fill="#fff" {...S} />
          <path d="M173 100h8" stroke={color} strokeWidth="3" strokeLinecap="round" className="amb-cursor" />
        </g>
      );
    case 'war':
      return (
        <g>
          <path d="M40 150c0-50 40-80 100-80s100 30 100 80z" fill="#fff" {...S} />
          <path d="M110 150v-40h60v40" fill={color} {...S} />
          <g className="amb-float">
            <path d="M140 30l34 12v24c0 22-16 34-34 40-18-6-34-18-34-40V42z" fill={color} {...S} />
            <path d="M126 64l10 10 18-20" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      );
    case 'money':
      return (
        <g>
          <path d="M50 76l90-40 90 40z" fill={color} {...S} />
          <rect x="56" y="76" width="168" height="12" fill="#fff" {...S} />
          {[72, 112, 152, 192].map((x) => (
            <rect key={x} x={x} y="88" width="16" height="50" fill="#fff" {...S} />
          ))}
          <rect x="46" y="138" width="188" height="12" fill="#fff" {...S} />
          <g className="amb-coin">
            <circle cx="140" cy="60" r="10" fill="#ffc531" {...S} />
            <path d="M140 55v10" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      );
    case 'health':
      return (
        <g>
          <rect x="50" y="60" width="180" height="90" fill="#fff" {...S} />
          <rect x="110" y="30" width="60" height="44" fill="#fff" {...S} />
          <path d="M140 38v28M126 52h28" stroke={color} strokeWidth="8" strokeLinecap="round" className="amb-pulse" />
          {[68, 100, 160, 192].map((x, i) => (
            <Win key={x} x={x} y={84} w={20} h={20} d={0.5 + i * 1.3} />
          ))}
          <rect x="124" y="112" width="32" height="38" fill={color} {...S} />
        </g>
      );
  }
}

/** Хмари, птахи й машинки, що живуть на карті. */
function Ambient({ wide }: { wide: boolean }) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      {[
        { x: 120, y: 20, s: 1, d: 0 },
        { x: 640, y: 6, s: 0.8, d: -18 },
        { x: wide ? 980 : 520, y: 30, s: 0.9, d: -34 },
      ].map((c, i) => (
        <g key={i} className="amb-cloud" style={{ animationDelay: `${c.d}s` }}>
          <g transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <path d="M0 26a14 14 0 0 1 14-14 20 20 0 0 1 38-4 15 15 0 0 1 22 18z" fill="#fff" opacity=".9" />
          </g>
        </g>
      ))}
      <g className="amb-birds">
        <path
          d={wide ? 'M560 20l7-5 7 5M578 12l6-4 6 4' : 'M300 22l7-5 7 5M318 14l6-4 6 4'}
          stroke={INK}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Car({ color, className, y }: { color: string; className: string; y: number }) {
  return (
    <g className={className} pointerEvents="none" aria-hidden="true">
      <g transform={`translate(0 ${y})`}>
        <rect x="-16" y="-9" width="32" height="14" rx="5" fill={color} stroke={INK} strokeWidth="2.5" />
        <rect x="-8" y="-15" width="16" height="8" rx="3" fill="#bfe0ff" stroke={INK} strokeWidth="2.5" />
        <circle cx="-9" cy="6" r="3.5" fill={INK} />
        <circle cx="9" cy="6" r="3.5" fill={INK} />
      </g>
    </g>
  );
}

function District({ id, x, y }: { id: WorldId; x: number; y: number }) {
  const progress = loadProgress();
  const navigate = useNavigate();
  const w = WORLDS.find((v) => v.id === id)!;
  const quests = questsByWorld(id);
  const done = quests.filter((q) => progress[q.id]).length;
  return (
    <a
      href={`#/world/${id}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(`/world/${id}`, { viewTransition: true });
      }}
      className="district"
      aria-label={`${w.title}: квестів ${quests.length}, пройдено ${done}`}
    >
      <g transform={`translate(${x} ${y})`}>
        <g className="district__lift">
          <rect x="0" y="0" width="300" height="210" rx="26" fill={TINT[id]} className="district__plate" stroke={INK} strokeWidth="3.5" />
          <g transform="translate(10 16)">
            <Buildings id={id} color={w.hex} />
          </g>
        </g>
        <g transform="translate(150 226)">
          <rect x="-140" y="-25" width="280" height="50" rx="25" fill="#fff" stroke={INK} strokeWidth="3" className="district__label" />
          <circle cx="-112" cy="0" r="10" fill={w.hex} />
          <text x="-92" y="7" fontFamily="Unbounded, sans-serif" fontSize="20" fontWeight="700" fill={INK}>
            {w.title}
          </text>
        </g>
        {done > 0 && (
          <g transform="translate(278 18)">
            <circle r="20" fill="#1fa97a" stroke={INK} strokeWidth="3" />
            <text y="7" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="17" fill="#fff">
              {done}
            </text>
          </g>
        )}
      </g>
    </a>
  );
}

export function CityMap() {
  return (
    <>
      <svg className="citymap citymap--wide" viewBox="0 0 1180 660" role="group" aria-label="Карта міста: оберіть район, щоб почати">
        <rect width="1180" height="660" rx="28" fill="#e6eefc" />
        <path d="M-20 300c180 40 340-40 520 10s340 90 720-10v60c-380 100-560 30-720-10s-340 30-520-10z" fill="#9ccaf5" />
        <path
          d="M40 318c120 18 220-6 300-8M760 360c120 10 220-10 320-26"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".7"
          fill="none"
        />
        <path
          className="amb-flow"
          d="M-20 330c180 40 340-40 520 10s340 90 720-10"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray="18 46"
          strokeLinecap="round"
          fill="none"
          opacity=".8"
        />
        <g className="amb-boat" aria-hidden="true">
          <path d="M0 0h34l-6 10H6z" fill="#ff8a3d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M17 0v-18l12 14z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        <path d="M350 160h90M740 160h90M350 500h90M740 500h90" stroke="#fff" strokeWidth="26" strokeLinecap="round" />
        <Car color="#ffc531" className="amb-car amb-car--a" y={160} />
        <Car color="#e14b57" className="amb-car amb-car--b" y={500} />
        <Ambient wide />
        {[200, 590, 980].map((x) => (
          <g key={x}>
            <rect x={x - 22} y="296" width="44" height="74" rx="4" fill="#f3f7ff" {...S} />
            <path d={`M${x - 22} 314h44M${x - 22} 352h44`} stroke={INK} strokeWidth="2" />
          </g>
        ))}
        {WORLDS.map((w) => (
          <District key={w.id} id={w.id} {...WIDE[w.id]} />
        ))}
      </svg>
      <svg className="citymap citymap--tall" viewBox="0 0 700 1060" role="group" aria-label="Карта міста: оберіть район, щоб почати">
        <rect width="700" height="1060" rx="28" fill="#e6eefc" />
        <path d="M-20 330c160 30 260-20 380 0s220 40 360 0v50c-140 40-240 20-360 0s-220 30-380 0z" fill="#9ccaf5" />
        <path d="M-20 690c160 30 260-20 380 0s220 40 360 0v50c-140 40-240 20-360 0s-220 30-380 0z" fill="#9ccaf5" />
        <path
          className="amb-flow"
          d="M-20 352c160 30 260-20 380 0s220 40 360 0M-20 712c160 30 260-20 380 0s220 40 360 0"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray="18 46"
          strokeLinecap="round"
          fill="none"
          opacity=".8"
        />
        <Ambient wide={false} />
        {WORLDS.map((w) => (
          <District key={w.id} id={w.id} {...TALL[w.id]} />
        ))}
      </svg>
    </>
  );
}
