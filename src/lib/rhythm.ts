/** Темп за останніми натисканнями (мітки часу в мс). Потрібно щонайменше 3 натискання. */
export function bpmFromTaps(taps: readonly number[], window = 5): number {
  if (taps.length < 3) return 0;
  const recent = taps.slice(-window);
  const intervals = recent.slice(1).map((t, i) => t - recent[i]);
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  return avg > 0 ? Math.round(60000 / avg) : 0;
}

/** Кут стрілки на шкалі −90…90° для діапазону 60–160 уд/хв (центр 110). */
export function gaugeAngle(bpm: number): number {
  if (!bpm) return -90;
  return Math.max(-90, Math.min(90, ((bpm - 110) / 50) * 90));
}
