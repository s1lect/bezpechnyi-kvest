import { useState } from 'react';
import { Scene } from '../../components/Scene';
import type { SpotStep as Step } from '../../types';
import { useSay, useSfx } from '../hooks';
import type { Done } from '../types';
import { Counter, Feedback, Frame, NextButton } from '../ui';

/** Ілюстрація має розмір 1000×600, координати небезпек задані у відсотках. */
const W = 10;
const H = 6;

export function SpotStep({ step, onDone }: { step: Step; onDone: Done }) {
  const [found, setFound] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const say = useSay();
  const fx = useSfx();
  const all = found.length === step.hotspots.length;
  const lastSpot = step.hotspots.find((h) => h.id === last);
  const nextHint = step.hotspots.find((h) => !found.includes(h.id));

  const hit = (id: string) => {
    if (found.includes(id)) return;
    const h = step.hotspots.find((x) => x.id === id)!;
    fx.correct();
    setFound((f) => [...f, id]);
    setLast(id);
    setHint(false);
    say(`${h.label}. ${h.explain}`, step.speaker);
  };

  const miss = () => {
    if (all) return;
    fx.wrong();
    setMisses((m) => m + 1);
  };

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      bareStage
      stage={
        <Scene id={step.scene} fit="meet" className="spot">
          <rect width="1000" height="600" fill="transparent" onClick={miss} />
          {step.hotspots.map((h) => {
            const isFound = found.includes(h.id);
            const pulse = hint && nextHint?.id === h.id;
            return (
              <g key={h.id}>
                <circle
                  cx={h.x * W}
                  cy={h.y * H}
                  r={h.r * W}
                  className={['hotspot', isFound && 'hotspot--found', pulse && 'hotspot--hint'].filter(Boolean).join(' ')}
                  role="button"
                  tabIndex={isFound ? -1 : 0}
                  aria-label={isFound ? `Знайдено: ${h.label}` : 'Можлива небезпека'}
                  onClick={(e) => {
                    e.stopPropagation();
                    hit(h.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      hit(h.id);
                    }
                  }}
                />
                {isFound && <circle cx={h.x * W} cy={h.y * H} r={h.r * W} className="hotspot__ripple" pointerEvents="none" />}
                {isFound && (
                  <g transform={`translate(${h.x * W + h.r * 7} ${h.y * H - h.r * 7})`} pointerEvents="none" className="hotspot__check">
                    <circle r="18" fill="#1fa97a" stroke="#172b4d" strokeWidth="3" />
                    <path d="M-8 0l5 6 11-12" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            );
          })}
        </Scene>
      }
    >
      <Counter value={found.length} total={step.hotspots.length} label="знайдено">
        {!all && misses >= 2 && !hint && (
          <button className="btn btn--ghost btn--small" onClick={() => setHint(true)}>
            Підказка
          </button>
        )}
      </Counter>
      {lastSpot && <Feedback ok title={`${lastSpot.label}.`} text={lastSpot.explain} />}
      {found.length > 1 && (
        <ul className="found-list" aria-label="Знайдені небезпеки">
          {step.hotspots
            .filter((h) => found.includes(h.id) && h.id !== last)
            .map((h) => (
              <li key={h.id}>{h.label}</li>
            ))}
        </ul>
      )}
      {all && <NextButton onClick={() => onDone(misses <= 3)} />}
    </Frame>
  );
}
