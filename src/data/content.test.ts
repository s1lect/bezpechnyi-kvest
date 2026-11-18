/**
 * Автоматична перевірка змісту квестів.
 * Ловить помилки, які легко зробити, редагуючи тексти: дублікати id, питання без правильної відповіді,
 * фрагменти чату, яких немає в повідомленні, валізу, яку неможливо зібрати, накладені зони пошуку тощо.
 */
import { describe, expect, it } from 'vitest';
import { gradedCount } from '../engine/scoring';
import { EMERGENCY, SUPPORT } from './hotlines';
import { QUESTS } from './quests';
import { SPEAKERS, WORLDS } from './worlds';

const SPOT_SCENES = new Set(['kitchen', 'field', 'crossing']);
const KNOWN_NUMBERS = new Set([...EMERGENCY, ...SUPPORT].map((h) => h.number.replace(/\s/g, '')));

describe('каталог', () => {
  it('id квестів унікальні й придатні для адреси', () => {
    const ids = QUESTS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('у кожному районі щонайменше два квести', () => {
    for (const w of WORLDS) {
      expect(QUESTS.filter((q) => q.world === w.id).length, w.title).toBeGreaterThanOrEqual(2);
    }
  });
});

describe.each(QUESTS.map((q) => [q.title, q] as const))('квест «%s»', (_title, q) => {
  it('має метадані для вчителя', () => {
    expect(WORLDS.some((w) => w.id === q.world)).toBe(true);
    expect(q.outcomes.length).toBeGreaterThanOrEqual(3);
    expect(q.lesson.discussion.length).toBeGreaterThanOrEqual(2);
    expect(q.reviewBy.length).toBeGreaterThan(0);
    const minutes = q.lesson.stages.reduce((s, x) => s + x.minutes, 0);
    expect(minutes, 'тривалість уроку').toBeGreaterThanOrEqual(40);
    expect(minutes, 'тривалість уроку').toBeLessThanOrEqual(45);
  });

  it('id кроків унікальні, останній крок — підсумок правил', () => {
    const ids = q.steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(q.steps.at(-1)?.kind).toBe('rule');
    expect(gradedCount(q)).toBeGreaterThanOrEqual(2);
  });

  it('персонажі відомі', () => {
    for (const s of q.steps) if (s.speaker) expect(SPEAKERS[s.speaker], s.id).toBeDefined();
  });

  it('кроки коректні', () => {
    for (const s of q.steps) {
      switch (s.kind) {
        case 'choice': {
          expect(s.options.length, s.id).toBeGreaterThanOrEqual(2);
          expect(s.options.filter((o) => o.correct).length, `${s.id}: рівно одна правильна відповідь`).toBe(1);
          for (const o of s.options) expect(o.feedback.length, s.id).toBeGreaterThan(10);
          break;
        }
        case 'spot': {
          expect(SPOT_SCENES.has(s.scene), s.id).toBe(true);
          for (const h of s.hotspots) {
            expect(h.x - h.r, `${h.id} в межах`).toBeGreaterThanOrEqual(0);
            expect(h.x + h.r, `${h.id} в межах`).toBeLessThanOrEqual(100);
            expect(h.y, `${h.id} в межах`).toBeGreaterThan(0);
            expect(h.y, `${h.id} в межах`).toBeLessThan(100);
          }
          // зони не повинні суттєво перекриватися (у пікселях ілюстрації 1000×600)
          for (let i = 0; i < s.hotspots.length; i++)
            for (let j = i + 1; j < s.hotspots.length; j++) {
              const a = s.hotspots[i];
              const b = s.hotspots[j];
              const d = Math.hypot((a.x - b.x) * 10, (a.y - b.y) * 6);
              expect(d, `${a.id} і ${b.id} перекриваються`).toBeGreaterThan((a.r + b.r) * 10 * 0.7);
            }
          break;
        }
        case 'sort': {
          expect(
            s.items.some((i) => i.bucket === 0),
            s.id,
          ).toBe(true);
          expect(
            s.items.some((i) => i.bucket === 1),
            s.id,
          ).toBe(true);
          break;
        }
        case 'pack': {
          const essential = s.items.filter((i) => i.essential).reduce((a, i) => a + i.weight, 0);
          expect(essential, `${s.id}: усе необхідне вміщається`).toBeLessThanOrEqual(s.capacity);
          expect(
            s.items.some((i) => !i.essential),
            s.id,
          ).toBe(true);
          break;
        }
        case 'chat': {
          const flags = s.messages.flatMap((m) => (m.flags ?? []).map((f) => ({ f, text: m.text })));
          expect(flags.length, s.id).toBeGreaterThan(0);
          for (const { f, text } of flags) expect(text, `фрагмент «${f.fragment}»`).toContain(f.fragment);
          break;
        }
        case 'rhythm': {
          expect(s.min).toBeLessThan(s.max);
          break;
        }
        case 'breathe': {
          expect(s.cycles).toBeGreaterThan(0);
          for (const p of s.pattern) expect(p).toBeGreaterThan(0);
          break;
        }
        default:
          break;
      }
    }
  });

  it('усі короткі номери телефонів у тексті є в довіднику', () => {
    const text = JSON.stringify(q);
    const numbers = text.match(/\b1\d{2}(?:\s?\d{3})?\b/g) ?? [];
    for (const n of numbers) {
      const clean = n.replace(/\s/g, '');
      // відсіюємо числа, які не є номерами (100–120 натискань тощо)
      if (!/^(10[1-4]|112|116\d{3})$/.test(clean)) continue;
      expect(KNOWN_NUMBERS.has(clean), `номер ${n}`).toBe(true);
    }
  });
});
