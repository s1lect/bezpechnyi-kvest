import { Easing, interpolate, spring } from 'remotion';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0→1 з плавним «пружинним» входом, починаючи з кадру `at`. */
export const pop = (frame: number, fps: number, at: number, damping = 14) =>
  spring({ frame: frame - at, fps, config: { damping, mass: 0.8, stiffness: 140 } });

/** 0→1 з кривою ease-out між кадрами. */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...CLAMP, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });

/** 1→0 наприкінці сцени. */
export const fadeOutAt = (frame: number, from: number, to: number) => interpolate(frame, [from, to], [1, 0], CLAMP);

export const lerp = (k: number, a: number, b: number) => a + (b - a) * k;
