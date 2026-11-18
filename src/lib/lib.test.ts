import { describe, expect, it } from 'vitest';
import { evaluatePack } from './pack';
import { estimatePassword } from './password';
import { bpmFromTaps, gaugeAngle } from './rhythm';
import { seededOrder, seededShuffle } from './shuffle';
import { splitByFlags } from './text';

describe('seededOrder', () => {
  it('повертає перестановку', () => {
    for (const n of [1, 2, 3, 5, 10]) {
      expect([...seededOrder('x', n)].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it('детермінований для однакового зерна', () => {
    expect(seededOrder('питання-1', 4)).toEqual(seededOrder('питання-1', 4));
  });

  it('різні зерна дають різні порядки', () => {
    const orders = new Set(Array.from({ length: 30 }, (_, i) => seededOrder(`q${i}`, 3).join()));
    expect(orders.size).toBeGreaterThan(3);
  });

  it('seededShuffle не змінює вхідний масив', () => {
    const src = ['a', 'b', 'c'];
    seededShuffle('z', src);
    expect(src).toEqual(['a', 'b', 'c']);
  });
});

describe('estimatePassword', () => {
  it('порожній пароль', () => {
    expect(estimatePassword('').level).toBe(0);
  });

  it('популярні паролі ненадійні', () => {
    for (const pw of ['qwerty123', 'password', '123456', 'україна1']) {
      expect(estimatePassword(pw).level).toBe(0);
    }
  });

  it('довга фраза-пароль дуже надійна', () => {
    const est = estimatePassword('зелений-кіт-їсть-кавун');
    expect(est.level).toBe(3);
    expect(est.tips).toHaveLength(0);
  });

  it('довший пароль надійніший', () => {
    expect(estimatePassword('mnbvtrxz').bits).toBeLessThan(estimatePassword('mnbvtrxzlkjp').bits);
  });

  it('дає поради для короткого пароля', () => {
    expect(estimatePassword('Kit7').tips.length).toBeGreaterThan(0);
  });
});

describe('splitByFlags', () => {
  it('виділяє фрагменти в правильному порядку', () => {
    const parts = splitByFlags('Заберіть приз за 10 хвилин тут: site.xyz', ['site.xyz', 'за 10 хвилин']);
    expect(parts.map((p) => p.text).join('')).toBe('Заберіть приз за 10 хвилин тут: site.xyz');
    expect(parts.filter((p) => p.flag).map((p) => p.flag)).toEqual(['за 10 хвилин', 'site.xyz']);
  });

  it('текст без фрагментів лишається цілим', () => {
    expect(splitByFlags('Привіт', [])).toEqual([{ text: 'Привіт' }]);
  });

  it('кожен фрагмент виділяється один раз', () => {
    const parts = splitByFlags('код код', ['код']);
    expect(parts.filter((p) => p.flag)).toHaveLength(1);
  });
});

describe('ритм', () => {
  it('рахує темп за інтервалами', () => {
    const taps = [0, 500, 1000, 1500, 2000];
    expect(bpmFromTaps(taps)).toBe(120);
  });

  it('потребує щонайменше 3 натискання', () => {
    expect(bpmFromTaps([0, 500])).toBe(0);
  });

  it('стрілка в межах шкали', () => {
    expect(gaugeAngle(110)).toBe(0);
    expect(gaugeAngle(400)).toBe(90);
    expect(gaugeAngle(20)).toBe(-90);
  });
});

describe('evaluatePack', () => {
  const step = {
    capacity: 5,
    items: [
      { name: 'Вода', weight: 2, essential: true, note: '' },
      { name: 'Ліхтар', weight: 1, essential: true, note: '' },
      { name: 'Ноутбук', weight: 3, essential: false, note: 'Залиш вдома.' },
    ],
  };

  it('успіх, коли все необхідне є', () => {
    expect(evaluatePack(step, new Set([0, 1])).ok).toBe(true);
  });

  it('провал при перевищенні ваги', () => {
    expect(evaluatePack(step, new Set([0, 1, 2])).ok).toBe(false);
  });

  it('провал, коли бракує необхідного', () => {
    const v = evaluatePack(step, new Set([0]));
    expect(v.ok).toBe(false);
    expect(v.text).toContain('ліхтар');
  });
});
