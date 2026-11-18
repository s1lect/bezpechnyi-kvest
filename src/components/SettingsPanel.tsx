import { useEffect, useState } from 'react';
import { useSettings } from '../lib/settings';
import { speak, speechSupported, whenVoicesReady } from '../lib/voice';
import './SettingsPanel.css';

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <span>
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, update } = useSettings();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    void whenVoicesReady().then(setVoices);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div id="settings-panel" className="settings container" role="region" aria-label="Налаштування">
      <div className="settings__grid">
        <Toggle label="Озвучення" hint="Персонажі читають репліки вголос" checked={settings.voice} onChange={(v) => update({ voice: v })} />
        <Toggle label="Звукові ефекти" hint="Тихі сигнали правильної й неправильної відповіді" checked={settings.sound} onChange={(v) => update({ sound: v })} />
        <Toggle label="Спокійний режим" hint="Без анімацій і звуків. Для дітей, яким тривожно" checked={settings.calm} onChange={(v) => update({ calm: v })} />
        <Toggle label="Великий текст" hint="Більший шрифт і проміжки: проєктор, дислексія, слабкий зір" checked={settings.large} onChange={(v) => update({ large: v })} />
      </div>
      <div className="settings__voice">
        {!speechSupported() || voices.length === 0 ? (
          <p className="settings__warn">
            У цьому браузері немає українського голосу. Репліки показуються субтитрами. Найкраще звучить у Microsoft Edge (голоси Polina та
            Ostap) або Chrome на Android.
          </p>
        ) : (
          <>
            <label>
              Голос
              <select value={settings.voiceName} onChange={(e) => update({ voiceName: e.target.value })}>
                <option value="">Автоматично ({voices[0]?.name})</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Швидкість: {settings.rate.toFixed(1)}×
              <input type="range" min="0.7" max="1.3" step="0.1" value={settings.rate} onChange={(e) => update({ rate: Number(e.target.value) })} />
            </label>
            <button
              className="btn btn--ghost btn--small"
              onClick={() => speak('Привіт! Я Оля, рятувальниця. Так звучатиме озвучення.', { speaker: 'olya', rate: settings.rate, voiceName: settings.voiceName })}
            >
              Прослухати
            </button>
          </>
        )}
      </div>
    </div>
  );
}
