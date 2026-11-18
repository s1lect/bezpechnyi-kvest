import type { LineStep as Step } from '../../types';
import type { Done } from '../types';
import { Frame, NextButton } from '../ui';

export function LineStep({ step, onDone }: { step: Step; onDone: Done }) {
  return (
    <Frame scene={step.scene} speaker={step.speaker} text={step.text} audio={step.audio}>
      <NextButton onClick={() => onDone(null)} />
    </Frame>
  );
}
