import { useMemo, useState } from 'react';
import { confettiFrom } from '../../lib/confetti';
import { seededShuffle } from '../../lib/shuffle';
import type { SortStep as Step } from '../../types';
import { useSay, useSfx } from '../hooks';
import type { Done } from '../types';
import { Feedback, Frame, NextButton } from '../ui';

export function SortStep({ step, onDone }: { step: Step; onDone: Done }) {
  const items = useMemo(() => seededShuffle(step.id, step.items), [step]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<0 | 1 | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [placed, setPlaced] = useState<{ text: string; bucket: 0 | 1; ok: boolean }[]>([]);
  const say = useSay();
  const fx = useSfx();
  const item = items[index];
  const finished = index >= items.length;

  const pick = (b: 0 | 1) => {
    if (answer !== null) return;
    setAnswer(b);
    if (b === item.bucket) fx.correct();
    else {
      fx.wrong();
      setMistakes((m) => m + 1);
    }
    say(item.explain, step.speaker);
  };

  const next = () => {
    if (index + 1 === items.length && mistakes === 0) confettiFrom(document.querySelector('.sort'), { count: 70, spread: 1.2, power: 1 });
    setPlaced((p) => [...p, { text: item.text, bucket: item.bucket, ok: answer === item.bucket }]);
    setAnswer(null);
    setIndex((i) => i + 1);
  };

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="sort">
          {step.buckets.map((b, bi) => {
            const inBucket = placed.filter((p) => p.bucket === bi);
            return (
              <section key={b} className={`bucket bucket--${bi}`} aria-label={b}>
                <h3>{b}</h3>
                {inBucket.length === 0 && <p className="bucket__empty">Тут з&apos;являться ситуації</p>}
                <ul>
                  {inBucket.map((p) => (
                    <li key={p.text} data-ok={p.ok}>
                      {p.text}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      }
    >
      {!finished ? (
        <>
          <div className="sort-card" key={item.text}>
            <span className="sort-card__count">
              {index + 1} з {items.length}
            </span>
            {item.text}
          </div>
          <div className="sort-actions">
            {step.buckets.map((b, bi) => {
              const state = answer === bi ? (bi === item.bucket ? 'btn--ok' : 'btn--bad') : 'btn--ghost';
              return (
                <button key={b} className={`btn ${state}`} onClick={() => pick(bi as 0 | 1)} aria-disabled={answer !== null}>
                  {b}
                </button>
              );
            })}
          </div>
          {answer !== null && <Feedback ok={answer === item.bucket} text={item.explain} />}
          {answer !== null && <NextButton onClick={next} label={index + 1 === items.length ? 'Готово' : 'Наступне'} />}
        </>
      ) : (
        <>
          <Feedback
            ok={mistakes === 0}
            title={mistakes === 0 ? 'Без жодної помилки!' : `Помилок: ${mistakes}.`}
            text="Подивись, як розподілилися ситуації. Позначені рискою — ті, де ти помилився."
          />
          <NextButton onClick={() => onDone(mistakes <= 1)} />
        </>
      )}
    </Frame>
  );
}
