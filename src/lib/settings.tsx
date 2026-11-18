import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readJSON, writeJSON } from './storage';

export interface Settings {
  /** Озвучення реплік. */
  voice: boolean;
  /** Звукові ефекти. */
  sound: boolean;
  /** Спокійний режим: без анімацій і звукових ефектів, для дітей з травматичним досвідом. */
  calm: boolean;
  /** Швидкість мовлення. */
  rate: number;
  voiceName: string;
  /** Збільшений шрифт і проміжки (дислексія, слабкий зір, проєктор). */
  large: boolean;
}

const DEFAULTS: Settings = { voice: true, sound: true, calm: false, rate: 1, voiceName: '', large: false };
const KEY = 'bk.settings.v1';

const Ctx = createContext<{ settings: Settings; update: (patch: Partial<Settings>) => void } | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => ({ ...DEFAULTS, ...readJSON<Partial<Settings>>(KEY, {}) }));

  useEffect(() => {
    writeJSON(KEY, settings);
    document.documentElement.dataset.calm = String(settings.calm);
    document.documentElement.dataset.large = String(settings.large);
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  return <Ctx.Provider value={{ settings, update }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
