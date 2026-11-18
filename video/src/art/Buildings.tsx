import type { WorldId } from './types';

const INK = '#172b4d';
const S = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Вікно, яке час від часу «засвічується» ввечері. */
function Win({ x, y, w = 20, h = 22, d = 0 }: { x: number; y: number; w?: number; h?: number; d?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="#bfe0ff" {...S} className="amb-win" style={{ animationDelay: `${d}s` }} />;
}

export function Buildings({ id, color }: { id: WorldId; color: string }) {
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

