import type { SceneId } from '../types';

/**
 * Пласкі геометричні сцени 1000×600.
 * Координати небезпек на сценах kitchen і field синхронізовані з hotspots у квестах (у відсотках).
 */
const INK = '#172b4d';
const S = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Window({ x, y, w, h, sky = '#bfe0ff' }: { x: number; y: number; w: number; h: number; sky?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={sky} {...S} />
      <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`} {...S} />
      <circle cx={x + w * 0.72} cy={y + h * 0.28} r={Math.min(w, h) * 0.1} fill="#fff6c9" />
    </g>
  );
}

function Classroom() {
  return (
    <>
      <rect width="1000" height="420" fill="#e6eefc" />
      <rect y="420" width="1000" height="180" fill="#c8b18f" />
      <path d="M0 420h1000" {...S} />
      <rect x="250" y="70" width="460" height="220" rx="10" fill="#2f5a4c" {...S} />
      <path d="M300 130h120M300 170h200M300 210h90" stroke="#e6f2ec" strokeWidth="6" strokeLinecap="round" />
      <path d="M560 120l30 60 30-60" stroke="#ffc531" strokeWidth="6" fill="none" strokeLinecap="round" />
      <Window x={790} y={80} w={160} h={200} />
      <Window x={50} y={80} w={150} h={200} />
      {[120, 420, 720].map((x) => (
        <g key={x}>
          <rect x={x} y="440" width="200" height="22" rx="4" fill="#f0d9b5" {...S} />
          <path d={`M${x + 20} 462v90M${x + 180} 462v90`} {...S} />
          <rect x={x + 60} y="420" width="80" height="20" rx="3" fill="#2b5be8" {...S} />
        </g>
      ))}
      <circle cx="480" cy="40" r="22" fill="#fff" {...S} />
      <path d="M480 26v14l10 6" {...S} fill="none" />
    </>
  );
}

function Corridor() {
  return (
    <>
      <rect width="1000" height="600" fill="#dde7f8" />
      <path d="M0 600 330 330h340L1000 600z" fill="#b9c6dc" />
      <rect x="330" y="120" width="340" height="210" fill="#eef3fc" {...S} />
      <path d="M0 0 330 120M1000 0 670 120M0 600 330 330M1000 600 670 330" {...S} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={70 + i * 85} y={150 + i * 28} width="60" height={260 - i * 55} fill="#5b6cff" opacity={0.9 - i * 0.15} {...S} />
      ))}
      <rect x="760" y="190" width="110" height="250" rx="6" fill="#ff8a3d" {...S} />
      <circle cx="850" cy="320" r="7" fill={INK} />
      <rect x="430" y="150" width="140" height="44" rx="6" fill="#1fa97a" {...S} />
      <text x="500" y="181" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontSize="22" fontWeight="700" fill="#fff">
        ВИХІД
      </text>
      <rect x="455" y="230" width="90" height="100" fill="#cfdcf2" {...S} />
    </>
  );
}

function Home() {
  return (
    <>
      <rect width="1000" height="440" fill="#f0e6ff" />
      <rect y="440" width="1000" height="160" fill="#d6c3a5" />
      <path d="M0 440h1000" {...S} />
      <Window x={90} y={90} w={240} h={220} sky="#2c3e74" />
      <circle cx="270" cy="140" r="18" fill="#fff6c9" />
      <rect x="430" y="320" width="330" height="90" rx="22" fill="#5b6cff" {...S} />
      <rect x="410" y="290" width="60" height="140" rx="20" fill="#4756d6" {...S} />
      <rect x="720" y="290" width="60" height="140" rx="20" fill="#4756d6" {...S} />
      <rect x="840" y="160" width="110" height="280" rx="6" fill="#c08457" {...S} />
      <circle cx="860" cy="310" r="7" fill={INK} />
      <path d="M560 70v80" {...S} />
      <path d="M520 150h80l-14 40h-52z" fill="#ffc531" {...S} />
      <rect x="470" y="470" width="260" height="60" rx="30" fill="#f9a8d4" opacity=".6" />
    </>
  );
}

function Kitchen() {
  return (
    <>
      <rect width="1000" height="380" fill="#e8f1ff" />
      <rect y="380" width="1000" height="220" fill="#dcc9ab" />
      <path d="M0 380h1000" {...S} />
      {/* холодильник */}
      <rect x="18" y="110" width="110" height="400" rx="10" fill="#f8fbff" {...S} />
      <path d="M18 250h110M108 160v50M108 290v60" {...S} />
      {/* верхні шафки */}
      <rect x="150" y="40" width="200" height="110" rx="6" fill="#ffc8a2" {...S} />
      <path d="M250 40v110" {...S} />
      {/* вікно */}
      <Window x={400} y={60} w={150} h={140} />
      <path d="M390 200h170" {...S} />
      <path d="M470 200c0-30 30-30 30-50" stroke="#1fa97a" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="455" y="185" width="40" height="22" rx="4" fill="#ff8a3d" {...S} />
      {/* стільниця */}
      <rect x="140" y="290" width="560" height="22" rx="4" fill="#9aa8c1" {...S} />
      <rect x="150" y="312" width="540" height="200" fill="#ffd9bd" {...S} />
      <path d="M330 312v200M510 312v200" {...S} />
      {/* плита й сковорідка (небезпека: pan 21%,44%) */}
      <rect x="150" y="290" width="160" height="22" fill="#4a5d7e" {...S} />
      <rect x="160" y="330" width="140" height="160" rx="6" fill="#4a5d7e" {...S} />
      <rect x="180" y="360" width="100" height="70" rx="6" fill="#26345a" {...S} />
      <ellipse cx="210" cy="280" rx="56" ry="12" fill="#2a2f3a" {...S} />
      <path d="M266 280h60" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <g className="amb-flicker">
        <path
          d="M168 274c4-26 16-20 14-44 14 14 10 26 18 30 2-22 12-34 10-56 18 20 18 40 16 52 8-6 10-18 8-28 14 14 16 32 10 46z"
          fill="#ff8a3d"
          stroke="#e14b57"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M192 274c2-12 8-10 8-22 8 8 6 16 10 18 2-10 6-14 6-22 8 10 8 18 6 26z" fill="#ffc531" />
      </g>
      {/* рушник (towel 33%,33%) */}
      <circle cx="330" cy="168" r="6" fill={INK} />
      <path d="M312 172h36l6 64h-48z" fill="#e14b57" {...S} />
      <path d="M312 196h42M310 214h46" stroke="#fff" strokeWidth="4" />
      {/* чайник і пошкоджений дріт (cable 58%,54%) */}
      <path d="M538 290l8-50h56l8 50z" fill="#12a4c9" {...S} />
      <path d="M610 254c22 0 22 30 0 30" {...S} fill="none" />
      <rect x="560" y="226" width="30" height="14" rx="5" fill={INK} />
      <path d="M574 312c0 20 10 18 6 34" stroke={INK} strokeWidth="5" fill="none" />
      <path d="M580 330l-10 -6M580 330l10 -8M582 334l-8 6M582 334l12 2" stroke="#ff8a3d" strokeWidth="4" strokeLinecap="round" />
      <path d="M580 346c-4 60 30 90 100 166" stroke={INK} strokeWidth="5" fill="none" />
      {/* подовжувач (strip 68%,86%) */}
      <rect x="626" y="504" width="120" height="26" rx="8" fill="#f8fbff" {...S} />
      {[640, 666, 692, 718].map((x) => (
        <g key={x}>
          <rect x={x} y="494" width="16" height="18" rx="3" fill={INK} />
          <path d={`M${x + 8} 494c0-30 ${x % 3 === 0 ? -20 : 20} -40 ${x % 2 ? 40 : -30} -70`} stroke={INK} strokeWidth="4" fill="none" />
        </g>
      ))}
      <path d="M746 517c40 0 60-30 90-30" stroke={INK} strokeWidth="5" fill="none" />
      {/* стіл і сірники (matches 86%,63%) */}
      <rect x="770" y="380" width="200" height="18" rx="4" fill="#c08457" {...S} />
      <path d="M790 398v150M950 398v150" {...S} />
      <rect x="840" y="364" width="44" height="18" rx="2" fill="#ffc531" {...S} />
      <path d="M848 364l4-8M860 364l2-10M872 364l3-7" stroke="#e14b57" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="920" cy="370" rx="26" ry="10" fill="#fff" {...S} />
    </>
  );
}

function Street() {
  return (
    <>
      <rect width="1000" height="600" fill="#cfe6ff" />
      <rect x="40" y="120" width="200" height="330" fill="#9aa8c1" {...S} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={62 + c * 60} y={150 + r * 70} width="36" height="40" fill="#e8f1ff" {...S} strokeWidth={3} />
        )),
      )}
      <rect x="560" y="90" width="400" height="360" fill="#7fd0e8" {...S} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${560 + i * 80} 90v360`} stroke={INK} strokeWidth="3" />
      ))}
      <path d="M560 210h400M560 330h400" stroke={INK} strokeWidth="3" />
      <path d="M600 130l60 60M760 250l50 50" stroke="#fff" strokeWidth="6" opacity=".7" strokeLinecap="round" />
      <rect x="330" y="290" width="140" height="160" fill="#f3f7ff" {...S} />
      <circle cx="400" cy="250" r="34" fill="#e14b57" {...S} />
      <text x="400" y="264" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontSize="38" fontWeight="800" fill="#fff">
        М
      </text>
      <path d="M345 450v-90h110v90" fill="#2a2f3a" {...S} />
      <path d="M360 450l10-20h60l10 20" stroke="#ffc531" strokeWidth="4" fill="none" />
      <rect y="450" width="1000" height="150" fill="#6b7790" />
      <path d="M0 450h1000" {...S} />
      <path d="M60 525h120M300 525h120M540 525h120M780 525h120" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      <path d="M270 450v-110h60" {...S} fill="none" />
      <rect x="250" y="300" width="80" height="44" rx="6" fill="#1fa97a" {...S} />
    </>
  );
}

function Field() {
  return (
    <>
      <rect width="1000" height="600" fill="#cfeaff" />
      <circle cx="140" cy="90" r="40" fill="#ffe38a" />
      <path d="M0 310c140-60 260-60 380-20s240 20 360-30 200 10 260 30v310H0z" fill="#9fd48f" {...S} />
      <path d="M0 360c200-30 400 10 600-10s300 20 400 10v240H0z" fill="#7cc26c" />
      {/* хата вдалині */}
      <path d="M60 300v-50l40-34 40 34v50z" fill="#fff" {...S} />
      <path d="M50 256l50-46 50 46" fill="#ff8a3d" {...S} />
      <path d="M380 140l16-8 16 8M440 110l12-6 12 6" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* дорога */}
      <path d="M40 600l260-300h70L300 600z" fill="#c9b48e" {...S} />
      {/* телефон на дорозі (phone 14%,84%) */}
      <rect x="120" y="492" width="44" height="26" rx="5" fill={INK} transform="rotate(-14 142 505)" />
      <rect x="126" y="496" width="32" height="18" rx="2" fill="#12a4c9" transform="rotate(-14 142 505)" />
      {/* металевий предмет у траві (object 33%,76%) */}
      <path d="M300 462l50-20 14 18-50 20z" fill="#8a7a62" {...S} />
      <ellipse cx="356" cy="451" rx="8" ry="12" fill="#6b5d48" {...S} transform="rotate(-22 356 451)" />
      <path d="M296 470c8-14 14-4 20-16M352 474c6-12 10 0 14-14" stroke="#4f9a40" strokeWidth="5" strokeLinecap="round" />
      {/* розтяжка (wire 55%,66%) */}
      <path d="M496 420v-40M606 412v-40" {...S} strokeWidth={6} />
      <path d="M496 392c40 6 70 4 110-6" stroke="#8a94a6" strokeWidth="3" fill="none" />
      {/* знак і стрічка (sign 79%,37%) */}
      <path d="M790 330V250" {...S} strokeWidth={6} />
      <path d="M790 170l46 80h-92z" fill="#e14b57" {...S} />
      <circle cx="790" cy="222" r="11" fill="#fff" />
      <path d="M782 238h16" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <rect x="748" y="268" width="84" height="32" rx="4" fill="#fff" {...S} strokeWidth={3} />
      <text x="790" y="291" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontSize="17" fontWeight="800" fill="#e14b57">
        МІНИ
      </text>
      <path d="M660 320l300-40" stroke="#e14b57" strokeWidth="6" strokeDasharray="22 14" />
      <path d="M660 320v40M960 280v40" {...S} />
      {/* пошкоджена техніка (tank 90%,66%) */}
      <path d="M850 400h110l18 26H836z" fill="#5d6b52" {...S} />
      <rect x="860" y="372" width="70" height="30" rx="6" fill="#6f7d62" {...S} />
      <path d="M930 380l46-14" {...S} strokeWidth={7} />
      <path d="M880 372l10-20 8 10 10-16" stroke="#4a4a4a" strokeWidth="4" fill="none" />
      <circle cx="860" cy="426" r="8" fill={INK} />
      <circle cx="900" cy="426" r="8" fill={INK} />
      <circle cx="940" cy="426" r="8" fill={INK} />
      {/* дерева */}
      {[480, 600, 690].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${290 + i * 4}v-40`} {...S} />
          <g className="amb-sway" style={{ animationDelay: `${i * 0.7}s` }}>
            <circle cx={x} cy={234 + i * 4} r="28" fill="#3d9b4f" {...S} />
          </g>
        </g>
      ))}
    </>
  );
}

function Person({
  x,
  y,
  body,
  hair = '#3b2a1a',
  scale = 1,
  flip = false,
}: {
  x: number;
  y: number;
  body: string;
  hair?: string;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <path d="M-8 0l-6 34M8 0l6 34" {...S} />
      <rect x="-16" y="-46" width="32" height="50" rx="12" fill={body} {...S} />
      <circle cx="0" cy="-62" r="16" fill="#f6c9a6" {...S} />
      <path d="M-16 -64c0-14 8-20 16-20s16 6 16 18c-6-6-14-8-22-6z" fill={hair} />
    </g>
  );
}

function Crossing() {
  return (
    <>
      <rect width="1000" height="600" fill="#ffe7c7" />
      <circle cx="840" cy="90" r="46" fill="#ffb169" opacity=".7" />
      {/* будинки вдалині */}
      <rect x="20" y="90" width="150" height="180" fill="#c3b2e6" {...S} />
      <rect x="560" y="60" width="180" height="210" fill="#9fc6e8" {...S} />
      <rect x="760" y="130" width="220" height="140" fill="#f2a7a7" {...S} />
      {[
        [50, 120],
        [110, 120],
        [50, 190],
        [110, 190],
        [590, 100],
        [660, 100],
        [590, 180],
        [660, 180],
        [790, 170],
        [870, 170],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="34" height="40" fill="#fff6d6" {...S} strokeWidth={3} />
      ))}
      {/* тротуари й дорога */}
      <rect y="270" width="1000" height="60" fill="#d7d2c8" {...S} />
      <rect y="330" width="1000" height="190" fill="#5f6b82" />
      <rect y="520" width="1000" height="80" fill="#d7d2c8" {...S} />
      <path d="M0 425h1000" stroke="#ffc531" strokeWidth="6" strokeDasharray="40 30" />
      {/* зебра */}
      {[300, 336, 372, 408, 444].map((x) => (
        <rect key={x} x={x} y="336" width="22" height="178" fill="#fff" />
      ))}
      {/* світлофор: червоний для пішоходів */}
      <path d="M252 330V150" {...S} strokeWidth={7} />
      <rect x="226" y="120" width="52" height="96" rx="10" fill={INK} />
      <circle cx="252" cy="146" r="16" fill="#e14b57" className="amb-blink-slow" />
      <circle cx="252" cy="190" r="16" fill="#3a4a6b" />
      <path d="M248 138a4 4 0 1 0 8 0 4 4 0 1 0-8 0M246 146h12l-2 12h-8z" fill="#fff" />
      {/* авто, що наближається */}
      <g transform="translate(70 360)">
        <g className="amb-idle">
          <rect x="0" y="20" width="170" height="44" rx="14" fill="#2b5be8" {...S} />
          <path d="M30 20l22-26h64l26 26z" fill="#bfe0ff" {...S} />
          <circle cx="40" cy="66" r="15" fill={INK} />
          <circle cx="130" cy="66" r="15" fill={INK} />
          <path d="M172 38h28M172 50h20" stroke="#ffc531" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
      {/* хлопчик переходить на червоне (red 34%,66%) */}
      <Person x={340} y={410} body="#ff8a3d" />
      {/* дитина на самокаті по зебрі (scooter 41%,80%) */}
      <g>
        <Person x={410} y={470} body="#20a36b" scale={0.85} />
        <path d="M392 508h40l8-52M432 456h14" {...S} fill="none" />
        <circle cx="394" cy="512" r="7" fill={INK} />
        <circle cx="432" cy="512" r="7" fill={INK} />
      </g>
      {/* дівчинка з телефоном і навушниками на краю тротуару (phone 54%,91%) */}
      <g>
        <Person x={540} y={562} body="#d9488f" hair="#7a3e1d" scale={0.9} />
        <path d="M526 498a16 16 0 0 1 28 0" stroke={INK} strokeWidth="5" fill="none" />
        <rect x="552" y="520" width="14" height="22" rx="3" fill={INK} />
      </g>
      {/* припарковане авто і дитина, що вибігає за м'ячем (ball 79%,78%) */}
      <g transform="translate(600 440)">
        <rect x="0" y="20" width="150" height="44" rx="14" fill="#e5484d" {...S} />
        <path d="M24 20l20-24h56l22 24z" fill="#bfe0ff" {...S} />
        <circle cx="34" cy="66" r="14" fill={INK} />
        <circle cx="118" cy="66" r="14" fill={INK} />
      </g>
      <Person x={790} y={490} body="#5b6cff" scale={0.8} flip />
      <circle cx="752" cy="496" r="13" fill="#fff" {...S} />
      <path d="M742 490l20 12M752 483v26" stroke="#e14b57" strokeWidth="3" />
      {/* дорослий переходить поза переходом (jaywalk 93%,63%) */}
      <Person x={930} y={400} body="#6b7790" hair="#2a1d14" flip />
    </>
  );
}

function Shelter() {
  return (
    <>
      <rect width="1000" height="600" fill="#3a4a6b" />
      <rect y="440" width="1000" height="160" fill="#2a3756" />
      <path d="M0 440h1000" stroke="#1b2540" strokeWidth="4" />
      {[160, 500, 840].map((x) => (
        <g key={x}>
          <path d={`M${x} 0v60`} stroke="#1b2540" strokeWidth="4" />
          <path d={`M${x - 30} 60h60l-10 26h-40z`} fill="#ffc531" stroke="#1b2540" strokeWidth="4" />
          <ellipse cx={x} cy="130" rx="150" ry="70" fill="#ffc531" opacity=".08" className="amb-glow" />
        </g>
      ))}
      <rect x="80" y="380" width="360" height="26" rx="6" fill="#c08457" stroke="#1b2540" strokeWidth="4" />
      <path d="M110 406v40M410 406v40" stroke="#1b2540" strokeWidth="4" />
      <rect x="560" y="380" width="360" height="26" rx="6" fill="#c08457" stroke="#1b2540" strokeWidth="4" />
      <path d="M590 406v40M890 406v40" stroke="#1b2540" strokeWidth="4" />
      <rect x="430" y="150" width="140" height="110" rx="10" fill="#f3f7ff" stroke="#1b2540" strokeWidth="4" />
      <path d="M455 185h90M455 210h60M455 235h75" stroke="#2b5be8" strokeWidth="6" strokeLinecap="round" />
      <rect x="100" y="320" width="54" height="60" rx="8" fill="#2b5be8" stroke="#1b2540" strokeWidth="4" />
      <rect x="760" y="330" width="60" height="50" rx="8" fill="#e14b57" stroke="#1b2540" strokeWidth="4" />
      <path d="M790 342v26M777 355h26" stroke="#fff" strokeWidth="6" />
    </>
  );
}

function Park() {
  return (
    <>
      <rect width="1000" height="600" fill="#d7efff" />
      <path d="M0 360c200-40 400-30 600-10s300 0 400-20v270H0z" fill="#9fd48f" {...S} />
      <path d="M380 600c40-120 120-200 260-240h60c-120 60-180 140-200 240z" fill="#e6d3ad" {...S} />
      <path d="M680 360v-60l70-60 70 60v60z" fill="#fff" {...S} />
      <path d="M664 304l86-78 86 78" fill="#5b6cff" {...S} />
      <rect x="730" y="310" width="40" height="50" fill="#c08457" {...S} />
      {[90, 220, 920].map((x) => (
        <g key={x}>
          <path d={`M${x} 380v-70`} {...S} strokeWidth={6} />
          <g className="amb-sway">
            <circle cx={x} cy="270" r="54" fill="#3d9b4f" {...S} />
          </g>
        </g>
      ))}
      <path d="M480 300c20-20 40-20 60 0" stroke="#f9a8d4" strokeWidth="10" fill="none" strokeLinecap="round" />
    </>
  );
}

function PhoneBg() {
  return (
    <>
      <rect width="1000" height="600" fill="#dff5fb" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={(i * 137) % 1000} cy={(i * 211) % 600} r={30 + (i % 4) * 22} fill="#12a4c9" opacity=".08" />
      ))}
      <path d="M80 520c120-80 260-80 380-10M560 90c120 40 240 30 360-20" stroke="#12a4c9" strokeWidth="4" opacity=".25" fill="none" />
    </>
  );
}

export function Scene({
  id,
  className,
  fit = 'slice',
  children,
}: {
  id: SceneId;
  className?: string;
  fit?: 'slice' | 'meet';
  children?: React.ReactNode;
}) {
  const map: Record<SceneId, React.ReactNode> = {
    classroom: <Classroom />,
    corridor: <Corridor />,
    home: <Home />,
    kitchen: <Kitchen />,
    street: <Street />,
    field: <Field />,
    shelter: <Shelter />,
    park: <Park />,
    phone: <PhoneBg />,
    crossing: <Crossing />,
  };
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio={`xMidYMid ${fit}`} aria-hidden={children ? undefined : true}>
      {map[id]}
      {children}
    </svg>
  );
}
