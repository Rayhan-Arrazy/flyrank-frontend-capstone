import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SETTINGS, type UserSettings } from '../types/settings';

interface SettingsState {
  settings: UserSettings;
  lastSavedAt: string | null;
  updateSettings: (settings: UserSettings) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      lastSavedAt: null,
      updateSettings: (settings) =>
        set({
          settings,
          lastSavedAt: new Date().toISOString(),
        }),
      resetSettings: () =>
        set({
          settings: DEFAULT_SETTINGS,
          lastSavedAt: null,
        }),
    }),
    {
      name: 'flyrank-settings',
    },
  ),
);
