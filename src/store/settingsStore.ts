import { create } from 'zustand';
import { AppSettings, DEFAULT_SETTINGS, TemperatureUnit, WindSpeedUnit, ThemeMode } from '@/types/settings';
import { loadSettings, saveSettings } from '@/services/settingsService';

interface SettingsState {
  settings: AppSettings;
  load: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTheme: (theme: ThemeMode) => void;
  setAutoLocation: (enabled: boolean) => void;
  setRefreshInterval: (minutes: number) => void;
  setCacheDuration: (minutes: number) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  load: () => {
    const settings = loadSettings();
    set({ settings });
  },

  updateSettings: (partial) => {
    const newSettings = { ...get().settings, ...partial };
    saveSettings(newSettings);
    set({ settings: newSettings });
  },

  setTemperatureUnit: (unit) => {
    get().updateSettings({ temperatureUnit: unit });
  },

  setWindSpeedUnit: (unit) => {
    get().updateSettings({ windSpeedUnit: unit });
  },

  setTheme: (theme) => {
    get().updateSettings({ theme });
  },

  setAutoLocation: (enabled) => {
    get().updateSettings({ autoLocation: enabled });
  },

  setRefreshInterval: (minutes) => {
    get().updateSettings({ refreshInterval: minutes });
  },

  setCacheDuration: (minutes) => {
    get().updateSettings({ cacheDuration: minutes });
  },
}));