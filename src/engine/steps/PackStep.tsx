import { useState } from 'react';
import { evaluatePack, type Verdict } from '../../lib/pack';
import type { PackStep as Step } from '../../types';
import { useSay, useSfx } from '../hooks';
import type { Done } from '../types';
import { Feedback, Frame, NextButton } from '../ui';

export function PackStep({ step, onDone }: { step: Step; onDone: Done }) {
  const [chosen, setChosen] = useState<ReadonlySet<number>>(new Set());
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [attempts, setAttempts] = useState(0);
  const say = useSay();
  const fx = useSfx();
  const weight = [...chosen].reduce((s, i) => s + step.items[i].weight, 0);
  const over = weight > step.capacity;

  const toggle = (i: number) => {
    fx.tap();
    setVerdict(null);
    setChosen((c) => {
      const n = new Set(c);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  };

  const check = () => {
    setAttempts((a) => a + 1);
    const v = evaluatePack(step, chosen);
    if (v.ok) fx.correct();
    else fx.wrong();
    setVerdict(v);
    say(v.text, step.speaker);
  };

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="pack">
          <div
            className="pack__meter"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={step.capacity}
            aria-valuenow={weight}
            aria-label="Вага валізи"
          >
            <div className="pack__fill" style={{ width: `${Math.min(100, (weight / step.capacity) * 100)}%` }} data-over={over} />
            <span>
              {weight} / {step.capacity} кг
            </span>
          </div>
          <ul className="pack__grid">
            {step.items.map((it, i) => (
              <li key={it.name}>
                <button className="pack__item" aria-pressed={chosen.has(i)} onClick={() => toggle(i)}>
                  <span className="pack__check" aria-hidden="true" />
                  <span className="pack__name">{it.name}</span>
                  <span className="pack__w">{it.weight} кг</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {verdict && <Feedback ok={verdict.ok} text={verdict.text} />}
      {verdict?.ok ? (
        <NextButton onClick={() => onDone(attempts <= 1)} />
      ) : (
        <div className="dialog__actions">
          <button className="btn btn--signal" onClick={check} disabled={chosen.size === 0}>
            Перевірити валізу
          </button>
        </div>
      )}
    </Frame>
  );
}
