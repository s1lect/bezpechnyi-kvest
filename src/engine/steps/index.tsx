import type { Step } from '../../types';
import type { Done } from '../types';
import { BreatheStep } from './BreatheStep';
import { ChatStep } from './ChatStep';
import { ChoiceStep } from './ChoiceStep';
import { LineStep } from './LineStep';
import { PackStep } from './PackStep';
import { PasswordStep } from './PasswordStep';
import { RhythmStep } from './RhythmStep';
import { RuleStep } from './RuleStep';
import { SortStep } from './SortStep';
import { SpotStep } from './SpotStep';

export function StepView({ step, onDone, classMode }: { step: Step; onDone: Done; classMode: boolean }) {
  switch (step.kind) {
    case 'line':
      return <LineStep step={step} onDone={onDone} />;
    case 'choice':
      return <ChoiceStep step={step} onDone={onDone} classMode={classMode} />;
    case 'spot':
      return <SpotStep step={step} onDone={onDone} />;
    case 'sort':
      return <SortStep step={step} onDone={onDone} />;
    case 'pack':
      return <PackStep step={step} onDone={onDone} />;
    case 'chat':
      return <ChatStep step={step} onDone={onDone} />;
    case 'rhythm':
      return <RhythmStep step={step} onDone={onDone} />;
    case 'password':
      return <PasswordStep step={step} onDone={onDone} />;
    case 'breathe':
      return <BreatheStep step={step} onDone={onDone} />;
    case 'rule':
      return <RuleStep step={step} onDone={onDone} />;
  }
}
