import { motionAllowed } from './motion';

const COLORS = ['#ffc531', '#2b5be8', '#1fa97a', '#e14b57', '#12a4c9', '#d9488f', '#ff8a3d'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  shape: 0 | 1;
}

/**
 * Легке конфеті на canvas без бібліотек. Полотно створюється на час анімації й одразу прибирається.
 * Не запускається в спокійному режимі та при «зменшити рух».
 */
export function confetti({
  x,
  y,
  count = 60,
  spread = 1,
  power = 1,
}: {
  x: number;
  y: number;
  count?: number;
  spread?: number;
  power?: number;
}) {
  if (!motionAllowed()) return;
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: '900' });
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const parts: Particle[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * spread;
    const speed = (6 + Math.random() * 7) * power;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.3 ? 0 : 1,
    };
  });

  const start = performance.now();
  const DURATION = 1800;
  const tick = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const fade = Math.max(0, 1 - Math.max(0, t - DURATION * 0.6) / (DURATION * 0.4));
    for (const p of parts) {
      p.vy += 0.28;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 0) ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      else {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (t < DURATION) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

/** Конфеті з центру елемента. */
export function confettiFrom(el: Element | null, opts: { count?: number; spread?: number; power?: number } = {}) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, ...opts });
}
