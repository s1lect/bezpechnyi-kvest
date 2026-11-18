import { SPEAKERS } from '../data/worlds';
import type { SpeakerId } from '../types';

/**
 * Озвучення.
 * 1. Якщо для репліки є записаний файл (step.audio) — програємо його.
 * 2. Інакше — синтез мовлення браузера українською (Web Speech API).
 *    Найприродніші голоси: Microsoft Polina / Ostap (Edge, Windows) і голоси Google на Android.
 */

let currentAudio: HTMLAudioElement | null = null;

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function rank(v: SpeechSynthesisVoice): number {
  let score = 0;
  if (/natural|online|neural/i.test(v.name)) score += 10;
  if (/microsoft/i.test(v.name)) score += 3;
  if (/google/i.test(v.name)) score += 2;
  if (v.localService) score += 1;
  return score;
}

export function ukrainianVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('uk'))
    .sort((a, b) => rank(b) - rank(a));
}

/** Голоси завантажуються асинхронно — чекаємо на них. */
export function whenVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported()) return Promise.resolve([]);
  const ready = ukrainianVoices();
  if (ready.length) return Promise.resolve(ready);
  return new Promise((resolve) => {
    const done = () => resolve(ukrainianVoices());
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

interface SpeakOptions {
  speaker?: SpeakerId;
  audio?: string;
  rate?: number;
  voiceName?: string;
}

export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  stopSpeaking();

  if (opts.audio) {
    return new Promise((resolve) => {
      const a = new Audio(opts.audio);
      currentAudio = a;
      a.onended = () => resolve();
      a.onerror = () => resolve();
      void a.play().catch(() => resolve());
    });
  }

  if (!speechSupported()) return Promise.resolve();

  const voices = ukrainianVoices();
  const voice = voices.find((v) => v.name === opts.voiceName) ?? voices[0];
  // Без українського голосу браузер читатиме з неправильною вимовою — краще мовчати.
  if (!voice) return Promise.resolve();

  const profile = SPEAKERS[opts.speaker ?? 'narrator'];
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'uk-UA';
    u.voice = voice;
    u.pitch = profile.pitch;
    u.rate = (opts.rate ?? 1) * profile.rate;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
