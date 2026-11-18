/**
 * М'які синтезовані звуки без аудіофайлів.
 * Свідомо немає сирен і вибухів: платформа має бути травмочутливою.
 */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, duration: number, gain = 0.08, type: OscillatorType = 'sine') {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  correct() {
    tone(660, 0, 0.18);
    tone(880, 0.1, 0.28);
  },
  wrong() {
    tone(320, 0, 0.25, 0.06, 'triangle');
  },
  tap() {
    tone(520, 0, 0.08, 0.05, 'triangle');
  },
  beat() {
    tone(180, 0, 0.09, 0.12, 'sine');
  },
  finish() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.35, 0.07));
  },
};
