import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { pop } from '../anim';
import { C, DISPLAY } from '../theme';
import { Fill, RiseWords } from './common';

/** Сцена 2: гасло. Друга фраза з'являється на жовтій плашці, що «пролітає» під текстом. */
export const Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = pop(frame, fps, 48, 18);
  const word = pop(frame, fps, 56, 13);
  return (
    <Fill style={{ background: C.paper, display: 'grid', alignContent: 'center', padding: '0 180px' }}>
      <RiseWords text="Безпеки не вчать за підручником." size={104} at={4} gap={4} />
      <div style={{ position: 'relative', marginTop: 40, alignSelf: 'start', justifySelf: 'start' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-34px -36px -10px',
            background: C.signal,
            border: `4px solid ${C.ink}`,
            borderRadius: 26,
            scale: `${bar} 1`,
            opacity: bar > 0.02 ? 1 : 0,
            transformOrigin: 'left center',
            boxShadow: `0 10px 0 ${C.ink}`,
          }}
        />
        <div
          style={{
            position: 'relative',
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: '-0.03em',
            color: C.ink,
            opacity: word,
            scale: interpolate(word, [0, 1], [0.85, 1]),
            transformOrigin: 'left center',
          }}
        >
          Її тренують.
        </div>
      </div>
    </Fill>
  );
};
