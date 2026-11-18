import { useEffect, useMemo, useState } from 'react';
import { seededShuffle } from '../../lib/shuffle';
import type { ChoiceStep as Step } from '../../types';
import { useSay, useSfx } from '../hooks';
import type { Done } from '../types';
import { Feedback, Frame, NextButton } from '../ui';

export function ChoiceStep({ step: raw, onDone, classMode }: { step: Step; onDone: Done; classMode: boolean }) {
  const options = useMemo(() => seededShuffle(raw.id + raw.text, raw.options), [raw]);
  const correctIndex = options.findIndex((o) => o.correct);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<ReadonlySet<number>>(new Set());
  const [solved, setSolved] = useState(false);
  const [votes, setVotes] = useState<number[]>(() => options.map(() => 0));
  const say = useSay();
  const fx = useSfx();
  // Пояснення читає оповідач, а не «шахрай» з телефону.
  const explainer = raw.speaker === 'stranger' ? 'narrator' : (raw.speaker ?? 'narrator');

  const choose = (i: number) => {
    if (solved || classMode) return;
    setPicked(i);
    if (options[i].correct) {
      fx.correct();
      setSolved(true);
    } else {
      fx.wrong();
      setWrong((w) => new Set(w).add(i));
    }
    say(options[i].feedback, explainer);
  };

  const reveal = () => {
    setPicked(correctIndex);
    setSolved(true);
    fx.correct();
    say(options[correctIndex].feedback, explainer);
  };

  const vote = (i: number, delta: number) => setVotes((v) => v.map((x, j) => (j === i ? Math.max(0, x + delta) : x)));

  useEffect(() => {
    if (classMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) choose(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const maxVotes = Math.max(...votes);
  const classRight = votes[correctIndex] > 0 && votes[correctIndex] === maxVotes;

  return (
    <Frame scene={raw.scene} speaker={raw.speaker} text={raw.text} audio={raw.audio}>
      <ol className="options">
        {options.map((o, i) => {
          const state = solved && i === correctIndex ? 'ok' : wrong.has(i) ? 'bad' : '';
          return (
            <li key={o.text} className="option-row">
              <button
                className={state ? `option option--${state}` : 'option'}
                onClick={() => choose(i)}
                aria-disabled={solved || classMode}
                tabIndex={classMode ? -1 : 0}
              >
                <span className="option__key" aria-hidden="true">
                  {state === 'ok' ? '✓' : state === 'bad' ? '×' : i + 1}
                </span>
                <span>{o.text}</span>
              </button>
              {classMode && (
                <div className="votes" role="group" aria-label={`Голоси за варіант ${i + 1}`}>
                  <button className="icon-btn" onClick={() => vote(i, -1)} aria-label="Мінус голос" disabled={solved}>
                    −
                  </button>
                  <output aria-live="polite">{votes[i]}</output>
                  <button className="icon-btn" onClick={() => vote(i, 1)} aria-label="Плюс голос" disabled={solved}>
                    +
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {picked !== null && <Feedback ok={options[picked].correct} text={options[picked].feedback} />}
      {classMode && !solved && (
        <div className="dialog__actions">
          <button className="btn btn--rescue" onClick={reveal}>
            Відкрити відповідь
          </button>
        </div>
      )}
      {solved && <NextButton onClick={() => onDone(classMode ? classRight : wrong.size === 0)} />}
    </Frame>
  );
}
