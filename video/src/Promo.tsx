import { linearTiming, springTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { Audio } from '@remotion/media';
import { staticFile } from 'remotion';
import { iris } from './Iris';
import { ChatDemo } from './scenes/ChatDemo';
import { ClassDemo } from './scenes/ClassDemo';
import { Features } from './scenes/Features';
import { Hook } from './scenes/Hook';
import { Intro } from './scenes/Intro';
import { MapScene } from './scenes/MapScene';
import { Outro } from './scenes/Outro';
import { SpotDemo } from './scenes/SpotDemo';

const T = 18;

/** Промовідео «Безпечний квест», ~40 секунд, 1920×1080. */
export const Promo = () => (
  <>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Заставка" durationInFrames={150}>
        <Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={iris()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="Гасло" durationInFrames={135}>
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={springTiming({ durationInFrames: T, config: { damping: 200 } })} />
      <TransitionSeries.Sequence name="Карта" durationInFrames={180}>
        <MapScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="Пошук небезпек" durationInFrames={210}>
        <SpotDemo />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={springTiming({ durationInFrames: T, config: { damping: 200 } })} />
      <TransitionSeries.Sequence name="Чат" durationInFrames={180}>
        <ChatDemo />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="Клас" durationInFrames={180}>
        <ClassDemo />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="Переваги" durationInFrames={135}>
        <Features />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={iris()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="Фінал" durationInFrames={165}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile('soundtrack.wav')} volume={1} />
  </>
);

/** 8 сцен мінус 7 переходів по 18 кадрів. */
export const PROMO_FRAMES = 150 + 135 + 180 + 210 + 180 + 180 + 135 + 165 - 7 * T;
