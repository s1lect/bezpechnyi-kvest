import { useEffect, useRef, useState } from 'react';
import type { BreatheStep as Step } from '../../types';
import { useSay } from '../hooks';
import type { Done } from '../types';
import { Feedback, Frame, NextButton } from '../ui';

const PHASES = ['Вдих', 'Затримай', 'Видих', 'Затримай'] as const;
const SPOKEN = ['Вдих', 'Затримай дихання', 'Видих', 'Затримай'];

/** Дихання «квадратом»: точка обходить квадрат, коло росте на вдиху й зменшується на видиху. */
export function BreatheStep({ step, onDone }: { step: Step; onDone: Done }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const say = useSay();
  const lastPhase = useRef(-1);

  const cycleLen = step.pattern.reduce((a, b) => a + b, 0);
  const total = cycleLen * step.cycles;
  const done = elapsed >= total;

  // поточна фаза
  const t = elapsed % cycleLen;
  let phase = 0;
  let acc = 0;
  while (phase < 3 && t >= acc + step.pattern[phase]) {
    acc += step.pattern[phase];
    phase++;
  }
  const phaseT = t - acc;
  const phaseLen = step.pattern[phase];
  const left = Math.max(1, Math.ceil(phaseLen - phaseT));
  const cycle = Math.min(step.cycles, Math.floor(elapsed / cycleLen) + 1);

  // масштаб кола: 0.55 → 1 на вдиху, тримаємо, 1 → 0.55 на видиху
  const k = phaseT / phaseLen;
  const scale = phase === 0 ? 0.55 + 0.45 * k : phase === 1 ? 1 : phase === 2 ? 1 - 0.45 * k : 0.55;

  // позиція точки на квадраті (обхід за годинниковою стрілкою)
  const side = 160;
  const pos = [
    { x: 40 + side * k, y: 40 },
    { x: 40 + side, y: 40 + side * k },
    { x: 40 + side - side * k, y: 40 + side },
    { x: 40, y: 40 + side - side * k },
  ][phase];

  useEffect(() => {
    if (!running || done) return;
    const start = performance.now() - elapsed * 1000;
    const id = window.setInterval(() => setElapsed((performance.now() - start) / 1000), 50);
    return () => window.clearInterval(id);
    // старт лише при запуску
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, done]);

  useEffect(() => {
    if (!running || done) return;
    const key = Math.floor(elapsed / cycleLen) * 4 + phase;
    if (key !== lastPhase.current) {
      lastPhase.current = key;
      say(SPOKEN[phase], step.speaker);
    }
  }, [running, done, elapsed, cycleLen, phase, say, step.speaker]);

  return (
    <Frame
      scene={step.scene ?? 'park'}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="breathe">
          <svg viewBox="0 0 240 240" className="breathe__svg" aria-hidden="true">
            <rect x="40" y="40" width={side} height={side} rx="18" fill="none" stroke="#c9d6ee" strokeWidth="6" />
            <circle
              cx="120"
              cy="120"
              r="70"
              fill="#d6f5ea"
              stroke="#1fa97a"
              strokeWidth="4"
              style={{ transform: `scale(${running ? scale : 0.55})`, transformOrigin: '120px 120px' }}
            />
            {running && !done && <circle cx={pos.x} cy={pos.y} r="11" fill="#ffc531" stroke="#172b4d" strokeWidth="3" />}
          </svg>
          <div className="breathe__label" aria-live="polite">
            {done ? 'Готово' : running ? PHASES[phase] : 'Готовий?'}
            {running && !done && <span className="breathe__count">{left}</span>}
          </div>
          {running && !done && (
            <p className="breathe__cycle">
              Коло {cycle} з {step.cycles}
            </p>
          )}
        </div>
      }
    >
      {!running && (
        <div className="dialog__actions">
          <button className="btn btn--signal" onClick={() => setRunning(true)}>
            Почати вправу
          </button>
          <button className="btn btn--ghost" onClick={() => onDone(null)}>
            Пропустити
          </button>
        </div>
      )}
      {running && !done && (
        <div className="dialog__actions">
          <button className="btn btn--ghost" onClick={() => onDone(null)}>
            Завершити раніше
          </button>
        </div>
      )}
      {done && (
        <>
          <Feedback ok title="Молодець." text="Цю вправу можна робити будь-де: в укритті, перед контрольною, коли серце калатає." />
          <NextButton onClick={() => onDone(null)} />
        </>
      )}
    </Frame>
  );
}
