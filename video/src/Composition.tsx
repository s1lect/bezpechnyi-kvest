import { Composition } from 'remotion';
import { Promo, PROMO_FRAMES } from './Promo';
import { fontsReady } from './theme';

void fontsReady;

export const MyComposition = () => (
  <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1920} height={1080} />
);
