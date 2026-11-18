import { useEffect, useRef, useState } from 'react';
import { confettiFrom } from '../../lib/confetti';
import { bpmFromTaps, gaugeAngle } from '../../lib/rhythm';
import { useSettings } from '../../lib/settings-context';
import { sfx } from '../../lib/sound';
import type { RhythmStep as Step } from '../../types';
import { useSfx } from '../hooks';
import type { Done } from '../types';
import { Counter, Feedback, Frame, NextButton } from '../ui';

export function RhythmStep({ step, onDone }: { step: Step; onDone: Done }) {
  const [taps, setTaps] = useState<number[]>([]);
  const [good, setGood] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const [pressed, setPressed] = useState(false);
  const fx = useSfx();
  const { settings } = useSettings();
  const pressTimer = useRef<number | undefined>(undefined);

  const bpm = bpmFromTaps(taps);
  const inZone = bpm >= step.min && bpm <= step.max;
  const done = good >= step.beats;

  const tap = () => {
    if (done) return;
    setPressed(true);
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => setPressed(false), 90);
    fx.beat();
    const next = [...taps, performance.now()].slice(-8);
    const b = bpmFromTaps(next);
    if (b >= step.min && b <= step.max) {
      if (good + 1 === step.beats) confettiFrom(document.querySelector('.heart'), { count: 60, spread: 1.2, power: 0.9 });
      setGood((g) => g + 1);
    }
    setTaps(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !done) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!metronome || done) return;
    const id = window.setInterval(() => settings.sound && sfx.beat(), 60000 / 110);
    return () => window.clearInterval(id);
  }, [metronome, done, settings.sound]);

  useEffect(() => () => window.clearTimeout(pressTimer.current), []);

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="rhythm">
          <svg viewBox="0 0 240 140" className="gauge" aria-hidden="true">
            <path d="M20 120a100 100 0 0 1 200 0" fill="none" stroke="#e6eefc" strokeWidth="22" />
            <path
              d="M20 120a100 100 0 0 1 200 0"
              fill="none"
              stroke="#1fa97a"
              strokeWidth="22"
              pathLength="100"
              strokeDasharray="20 100"
              strokeDashoffset="-40"
            />
            <text x="20" y="138" fontSize="11" fill="#4a5d7e" textAnchor="middle">
              60
            </text>
            <text x="220" y="138" fontSize="11" fill="#4a5d7e" textAnchor="middle">
              160
            </text>
            <g transform={`rotate(${gaugeAngle(bpm)} 120 120)`} className="gauge__needle">
              <path d="M120 120V34" stroke="#172b4d" strokeWidth="6" strokeLinecap="round" />
            </g>
            <circle cx="120" cy="120" r="10" fill="#172b4d" />
          </svg>
          <div className="rhythm__bpm" data-zone={bpm ? (inZone ? 'ok' : 'bad') : ''} aria-live="polite">
            {bpm ? `${bpm} натискань/хв` : 'Почни натискати'}
          </div>
          <button className={pressed ? 'heart heart--down' : 'heart'} onClick={tap} disabled={done} aria-label="Натиснути на грудну клітку">
            <svg viewBox="0 0 24 24" width="64" height="64" aria-hidden="true">
              <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="currentColor" />
            </svg>
          </button>
          <p className="rhythm__hint">Або натискай пробіл</p>
        </div>
      }
    >
      <Counter value={Math.min(good, step.beats)} total={step.beats} label="натискань у правильному темпі">
        <button className="btn btn--ghost btn--small" onClick={() => setMetronome((m) => !m)} aria-pressed={metronome}>
          {metronome ? 'Вимкнути метроном' : 'Метроном-підказка'}
        </button>
      </Counter>
      {bpm > 0 && !done && (
        <Feedback
          ok={inZone}
          title={inZone ? 'Так тримати.' : bpm < step.min ? 'Повільно.' : 'Швидко.'}
          text={`Потрібно ${step.min}–${step.max} натискань за хвилину.`}
        />
      )}
      {done && (
        <>
          <Feedback ok title="Чудовий ритм!" text="Саме в такому темпі натискають на грудну клітку до приїзду медиків." />
          <NextButton onClick={() => onDone(true)} />
        </>
      )}
    </Frame>
  );
}
