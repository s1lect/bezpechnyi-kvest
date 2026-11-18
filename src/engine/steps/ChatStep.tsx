import { useMemo, useState } from 'react';
import { splitByFlags } from '../../lib/text';
import type { ChatStep as Step } from '../../types';
import { useSay, useSfx } from '../hooks';
import type { Done } from '../types';
import { Counter, Feedback, Frame, NextButton } from '../ui';

export function ChatStep({ step, onDone }: { step: Step; onDone: Done }) {
  const allFlags = useMemo(() => step.messages.flatMap((m) => m.flags ?? []), [step]);
  const [found, setFound] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const say = useSay();
  const fx = useSfx();
  const done = found.length === allFlags.length;
  const lastFlag = allFlags.find((f) => f.fragment === last);

  const hit = (fragment: string) => {
    if (found.includes(fragment)) return;
    const f = allFlags.find((x) => x.fragment === fragment)!;
    fx.correct();
    setFound((x) => [...x, fragment]);
    setLast(fragment);
    say(f.explain, step.speaker);
  };

  const miss = () => {
    if (done) return;
    fx.wrong();
    setMisses((x) => x + 1);
  };

  return (
    <Frame
      scene="phone"
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="phone">
          <div className="phone__notch" aria-hidden="true" />
          <div className="phone__head">
            <div className="phone__avatar" aria-hidden="true">
              {step.contact[0]}
            </div>
            <div>
              <strong>{step.contact}</strong>
              <small>{step.contactNote}</small>
            </div>
          </div>
          <div className="phone__body">
            {step.messages.map((m, i) => (
              <div key={i} className={`bubble bubble--${m.from}`} onClick={miss}>
                {m.author && <span className="bubble__author">{m.author}</span>}
                {splitByFlags(
                  m.text,
                  (m.flags ?? []).map((f) => f.fragment),
                ).map((p, j) =>
                  p.flag ? (
                    <span
                      key={j}
                      role="button"
                      tabIndex={found.includes(p.flag) ? -1 : 0}
                      className={found.includes(p.flag) ? 'flag flag--found' : 'flag'}
                      aria-pressed={found.includes(p.flag)}
                      onClick={(e) => {
                        e.stopPropagation();
                        hit(p.flag!);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          hit(p.flag!);
                        }
                      }}
                    >
                      {p.text}
                    </span>
                  ) : (
                    <span key={j}>{p.text}</span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <Counter value={found.length} total={allFlags.length} label="підозрілих місць" />
      {lastFlag && <Feedback ok title={`«${lastFlag.fragment}».`} text={lastFlag.explain} />}
      {done && <NextButton onClick={() => onDone(misses <= 2)} />}
    </Frame>
  );
}
