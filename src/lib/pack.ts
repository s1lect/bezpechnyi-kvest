import type { PackStep } from '../types';

/** Результат перевірки тривожної валізи: усі обов'язкові речі є і ліміт ваги не перевищено. */
export interface Verdict {
  ok: boolean;
  text: string;
}

export function evaluatePack(step: Pick<PackStep, 'capacity' | 'items'>, chosen: ReadonlySet<number>): Verdict {
  const weight = [...chosen].reduce((s, i) => s + step.items[i].weight, 0);
  if (weight > step.capacity) {
    return { ok: false, text: `Валіза важить ${weight} кг при ліміті ${step.capacity}. Прибери щось важке й не обов'язкове.` };
  }
  const missing = step.items.filter((it, i) => it.essential && !chosen.has(i));
  if (missing.length) {
    return {
      ok: false,
      text: `Бракує важливого: ${missing.map((m) => m.name.toLowerCase()).join(', ')}. ${missing[0].note}`,
    };
  }
  const extras = step.items.filter((it, i) => !it.essential && chosen.has(i));
  return { ok: true, text: extras.length ? `Усе необхідне є. ${extras[0].note}` : 'Усе необхідне є, і валіза легка. Ідеально!' };
}
