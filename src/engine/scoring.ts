import type { Quest, Step } from '../types';

/** Типи кроків, за які нараховується бал (з першої спроби). */
export const GRADED_KINDS: ReadonlySet<Step['kind']> = new Set(['choice', 'spot', 'sort', 'pack', 'chat', 'rhythm']);

export const gradedCount = (quest: Quest): number => quest.steps.filter((s) => GRADED_KINDS.has(s.kind)).length;

export function verdict(score: number, total: number): string {
  if (total === 0 || score === total) return 'Бездоганно. Ти знаєш, що робити, і можеш навчити інших.';
  if (score >= total / 2) return 'Добрий результат. Пройди ще раз, щоб закріпити правила.';
  return 'Помилки на тренуванні — це нормально. Саме для цього воно й потрібне. Спробуй ще раз.';
}
