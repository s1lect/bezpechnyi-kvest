import { useEffect, useRef, type ReactNode } from 'react';
import { Portrait } from '../components/Portrait';
import { Scene } from '../components/Scene';
import { SPEAKERS } from '../data/worlds';
import { stopSpeaking } from '../lib/voice';
import type { SceneId, SpeakerId } from '../types';
import { useSay } from './hooks';

interface FrameProps {
  scene?: SceneId;
  speaker?: SpeakerId;
  text: string;
  audio?: string;
  /** Інтерактивний вміст поверх сцени. Якщо не задано — показується лише сцена. */
  stage?: ReactNode;
  /** Вміст сцени сам малює ілюстрацію (пошук небезпек). */
  bareStage?: boolean;
  /** Текст для озвучення, якщо відрізняється від показаного. */
  speech?: string;
  children?: ReactNode;
}

/** Спільна рамка кроку: сцена ліворуч (зверху на телефоні), діалог з персонажем праворуч. */
export function Frame({ scene = 'classroom', speaker = 'narrator', text, audio, stage, bareStage, speech, children }: FrameProps) {
  const say = useSay();
  const profile = SPEAKERS[speaker];
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Фокус на тексті: екранний читач озвучує нову ситуацію, а Tab веде до варіантів.
    textRef.current?.focus({ preventScroll: true });
    say(speech ?? text, speaker, audio);
    return () => stopSpeaking();
    // Озвучуємо лише при зміні кроку.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="frame">
      <div className={bareStage ? 'stage stage--bare' : 'stage'}>
        {!bareStage && <Scene id={scene} className="stage__bg" />}
        {stage && <div className="stage__content">{stage}</div>}
      </div>
      <div className="dialog">
        <div className="dialog__speaker">
          <Portrait id={speaker} size={64} />
          <div>
            <div className="dialog__name">{profile.name}</div>
            {profile.role && <div className="dialog__role">{profile.role}</div>}
          </div>
          <button className="icon-btn dialog__replay" onClick={() => say(speech ?? text, speaker, audio)} title="Прослухати ще раз">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
              <path
                d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <span className="sr-only">Прослухати ще раз</span>
          </button>
        </div>
        <p className="dialog__text" ref={textRef} tabIndex={-1}>
          {text}
        </p>
        {children}
      </div>
    </div>
  );
}

/** Пояснення вже починається з оцінки («Так.», «Правильно.») — не дублюємо заголовок. */
const SELF_TITLED = /^(Так|Правильно|Саме так|Чудово|Найкраще|Ніколи)/;

export function Feedback({ ok, title, text }: { ok: boolean; title?: string; text: string }) {
  const heading = title ?? (SELF_TITLED.test(text) ? '' : ok ? 'Так!' : 'Не зовсім.');
  return (
    <div className={ok ? 'feedback feedback--ok' : 'feedback feedback--bad'} role="status" aria-live="polite">
      {heading && <strong>{heading}</strong>} {text}
    </div>
  );
}

export function NextButton({ onClick, label = 'Далі' }: { onClick: () => void; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="dialog__actions">
      <button ref={ref} className="btn btn--signal" onClick={onClick}>
        {label}
      </button>
    </div>
  );
}

export function Counter({ value, total, label, children }: { value: number; total: number; label: string; children?: ReactNode }) {
  return (
    <div className="counter">
      <span className="counter__big" aria-hidden="true" key={value}>
        {value}/{total}
      </span>
      <span>
        <span className="sr-only">
          {value} з {total}{' '}
        </span>
        {label}
      </span>
      {children}
    </div>
  );
}
