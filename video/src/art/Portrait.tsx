import type { SpeakerId } from './types';

const SKIN = '#f6c9a6';
const SKIN_2 = '#e5a882';
const INK = '#172b4d';

function Face({ hair, hairBack, body }: { hair: React.ReactNode; hairBack?: React.ReactNode; body: string }) {
  return (
    <>
      <path d="M18 120c4-26 22-38 42-38s38 12 42 38z" fill={body} />
      {hairBack}
      <rect x="52" y="70" width="16" height="16" rx="6" fill={SKIN_2} />
      <circle cx="60" cy="52" r="26" fill={SKIN} />
      <circle cx="51" cy="54" r="2.6" fill={INK} />
      <circle cx="69" cy="54" r="2.6" fill={INK} />
      <path d="M53 64c4 4 10 4 14 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="61" r="4" fill="#f59e9e" opacity=".55" />
      <circle cx="76" cy="61" r="4" fill="#f59e9e" opacity=".55" />
      {hair}
    </>
  );
}

export function Portrait({ id, size = 72 }: { id: SpeakerId; size?: number }) {
  let art: React.ReactNode;
  switch (id) {
    case 'olya':
      art = (
        <Face
          body="#1d43b8"
          hairBack={<path d="M34 50c0 22 4 34 10 38h32c6-4 10-16 10-38z" fill="#7a3e1d" />}
          hair={
            <>
              <path d="M30 46c0-18 13-30 30-30s30 12 30 30z" fill="#ffc531" stroke={INK} strokeWidth="2.5" />
              <rect x="26" y="42" width="68" height="8" rx="4" fill="#ffc531" stroke={INK} strokeWidth="2.5" />
              <rect x="56" y="18" width="8" height="24" rx="3" fill="#e14b57" />
              <path d="M40 102h40" stroke="#ffc531" strokeWidth="5" />
            </>
          }
        />
      );
      break;
    case 'taras':
      art = (
        <Face body="#d9488f" hair={<path d="M33 48c-2-20 12-28 27-28 16 0 30 8 27 26-8-8-20-12-34-8-8 2-14 6-20 10z" fill="#2a1d14" />} />
      );
      break;
    case 'mama':
      art = (
        <Face
          body="#20a36b"
          hairBack={<circle cx="60" cy="24" r="12" fill="#5a3a22" />}
          hair={<path d="M34 50c0-20 12-30 26-30s26 10 26 30c-6-10-16-16-26-16s-20 6-26 16z" fill="#5a3a22" />}
        />
      );
      break;
    case 'student':
      art = <Face body="#2b5be8" hair={<path d="M34 46c0-18 12-26 26-26s26 8 26 26c-10-6-16-10-26-10s-16 4-26 10z" fill="#3b2a1a" />} />;
      break;
    case 'kit':
      art = (
        <>
          <path d="M18 120c4-26 22-38 42-38s38 12 42 38z" fill="#12a4c9" />
          <path d="M32 40 30 10l22 18M88 40l2-30-22 18" fill="#8a94a6" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="60" cy="54" r="30" fill="#8a94a6" stroke={INK} strokeWidth="2.5" />
          <rect x="34" y="42" width="52" height="18" rx="9" fill="#12a4c9" stroke={INK} strokeWidth="2.5" />
          <rect x="40" y="46" width="14" height="4" rx="2" fill="#bdf3ff" />
          <path d="M56 70l4 4 4-4" fill="#f59e9e" />
          <path d="M60 74v4M48 74h-16M48 78l-14 4M72 74h16M72 78l14 4" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </>
      );
      break;
    case 'sova':
      art = (
        <>
          <path d="M22 120c0-30 16-46 38-46s38 16 38 46z" fill="#20a36b" />
          <path d="M28 70c0-30 14-48 32-48s32 18 32 48c0 18-14 30-32 30S28 88 28 70z" fill="#a0723f" stroke={INK} strokeWidth="2.5" />
          <path d="M32 30 40 18l8 10M88 30l-8-12-8 10" fill="#a0723f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="47" cy="56" r="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="73" cy="56" r="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="47" cy="57" r="4" fill={INK} />
          <circle cx="73" cy="57" r="4" fill={INK} />
          <path d="M59 56h2" stroke={INK} strokeWidth="2.5" />
          <path d="M55 68l5 8 5-8z" fill="#ffc531" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M44 86c5 3 11 4 16 4s11-1 16-4" stroke="#d9b98c" strokeWidth="3" fill="none" />
        </>
      );
      break;
    case 'stranger':
      art = (
        <>
          <circle cx="60" cy="60" r="56" fill="#dfe6f3" />
          <rect x="38" y="20" width="44" height="80" rx="9" fill={INK} />
          <rect x="43" y="28" width="34" height="58" rx="4" fill="#4a5d7e" />
          <text x="60" y="70" textAnchor="middle" fontSize="36" fontWeight="800" fill="#ffc531" fontFamily="Unbounded, sans-serif">
            ?
          </text>
        </>
      );
      break;
    default:
      art = (
        <>
          <circle cx="60" cy="60" r="56" fill="#ffc531" />
          <path d="M34 40h52v36H58l-14 12V76H34z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M44 52h32M44 63h22" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      );
  }
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ overflow: 'hidden', borderRadius: '50%', background: '#e6eefc' }}
    >
      {art}
    </svg>
  );
}
