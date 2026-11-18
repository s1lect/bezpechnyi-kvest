import { useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, SettingsContext, type Settings } from './settings-context';
import { readJSON, writeJSON } from './storage';

const KEY = 'bk.settings.v1';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, ...readJSON<Partial<Settings>>(KEY, {}) }));

  useEffect(() => {
    writeJSON(KEY, settings);
    const root = document.documentElement;
    root.dataset.calm = String(settings.calm);
    root.dataset.large = String(settings.large);
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  return <SettingsContext.Provider value={{ settings, update }}>{children}</SettingsContext.Provider>;
}
