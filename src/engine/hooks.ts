import { useSettings } from '../lib/settings-context';
import { sfx } from '../lib/sound';
import { speak } from '../lib/voice';
import type { SpeakerId } from '../types';

/** Озвучити текст з урахуванням налаштувань (вимкнений голос, швидкість, обраний голос). */
export function useSay() {
  const { settings } = useSettings();
  return (text: string, speaker: SpeakerId = 'narrator', audio?: string) => {
    if (!settings.voice) return;
    void speak(text, { speaker, audio, rate: settings.rate, voiceName: settings.voiceName });
  };
}

/** Звукові ефекти, які мовчать у спокійному режимі або коли звук вимкнено. */
export function useSfx() {
  const { settings } = useSettings();
  const on = settings.sound && !settings.calm;
  return {
    correct: () => on && sfx.correct(),
    wrong: () => on && sfx.wrong(),
    tap: () => on && sfx.tap(),
    beat: () => on && sfx.beat(),
    finish: () => on && sfx.finish(),
  };
}
