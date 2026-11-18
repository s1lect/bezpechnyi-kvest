import { createContext, useContext } from 'react';

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

export const DEFAULT_SETTINGS: Settings = { voice: true, sound: true, calm: false, rate: 1, voiceName: '', large: false };

export interface SettingsValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

export const SettingsContext = createContext<SettingsValue | null>(null);

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
