import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';

/** Нова сцена розкривається колом з центру — та сама «райдужка», що й у заставці сайту. */
const IrisPresentation = ({ children, presentationDirection, presentationProgress }: TransitionPresentationComponentProps<Record<string, never>>) => {
  if (presentationDirection === 'exiting') return <div style={{ position: 'absolute', inset: 0 }}>{children}</div>;
  const r = presentationProgress * 120;
  return <div style={{ position: 'absolute', inset: 0, clipPath: `circle(${r}% at 50% 50%)` }}>{children}</div>;
};

export const iris = (): TransitionPresentation<Record<string, never>> => ({ component: IrisPresentation, props: {} });
