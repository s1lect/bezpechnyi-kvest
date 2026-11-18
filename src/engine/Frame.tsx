import { useEffect, type ReactNode } from 'react';
import { Portrait } from '../components/Portrait';
import { Scene } from '../components/Scene';
import { SPEAKERS } from '../data/worlds';
import { useSettings } from '../lib/settings';
import { speak, stopSpeaking } from '../lib/voice';
import type { SceneId, SpeakerId } from '../types';

export function useSay() {
  const { settings } = useSettings();
  return (text: string, speaker: SpeakerId = 'narrator', audio?: string) => {
    if (!settings.voice) return;
    void speak(text, { speaker, audio, rate: settings.rate, voiceName: settings.voiceName });
  };
}

interface FrameProps {
  scene?: SceneId;
  speaker?: SpeakerId;
  text: string;
  audio?: string;
  /** Інтерактивний вміст поверх сцени. Якщо не задано — показується лише сцена. */
  stage?: ReactNode;
  /** Сцена з hotspots сама малює ілюстрацію. */
  bareStage?: boolean;
  /** Текст для озвучення, якщо відрізняється від показаного. */
  speech?: string;
  children?: ReactNode;
}

export function Frame({ scene = 'classroom', speaker = 'narrator', text, audio, stage, bareStage, speech, children }: FrameProps) {
  const say = useSay();
  const profile = SPEAKERS[speaker];

  useEffect(() => {
    say(speech ?? text, speaker, audio);
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="frame">
      <div className={bareStage ? 'stage stage--bare' : 'stage'}>
        {!bareStage && <Scene id={scene} className="stage__bg" />}
        {stage && <div className="stage__content">{stage}</div>}
      </div>
      <div className="dialog" aria-live="polite">
        <div className="dialog__speaker">
          <Portrait id={speaker} size={64} />
          <div>
            <div className="dialog__name">{profile.name}</div>
            {profile.role && <div className="dialog__role">{profile.role}</div>}
          </div>
          <button className="icon-btn dialog__replay" onClick={() => say(speech ?? text, speaker, audio)} title="Прослухати ще раз">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
              <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Прослухати ще раз</span>
          </button>
        </div>
        <p className="dialog__text">{text}</p>
        {children}
      </div>
    </div>
  );
}

export function Feedback({ ok, title, text }: { ok: boolean; title?: string; text: string }) {
  return (
    <div className={ok ? 'feedback feedback--ok' : 'feedback feedback--bad'} role="status">
      <strong>{title ?? (ok ? 'Так!' : 'Не зовсім')}</strong> {text}
    </div>
  );
}
