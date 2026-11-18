import type { RuleStep as Step } from '../../types';
import type { Done } from '../types';
import { Frame, NextButton } from '../ui';

export function RuleStep({ step, onDone }: { step: Step; onDone: Done }) {
  return (
    <Frame
      scene={step.scene ?? 'classroom'}
      speaker={step.speaker}
      text={`${step.title}: головні правила`}
      speech={`${step.title}. ${step.points.join(' ')}`}
      stage={
        <div className="rules">
          <h3>{step.title}</h3>
          <ol>
            {step.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      }
    >
      <p className="dialog__aside">Перепиши правила в зошит або сфотографуй їх — вони знадобляться.</p>
      <NextButton onClick={() => onDone(null)} label="Завершити квест" />
    </Frame>
  );
}
