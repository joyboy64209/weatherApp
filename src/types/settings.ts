export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: ThemeMode;
  autoLocation: boolean;
  refreshInterval: number;
  cacheDuration: number;
  favoriteCities: string[];
  recentSearches: string[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  theme: 'system',
  autoLocation: true,
  refreshInterval: 5,
  cacheDuration: 30,
  favoriteCities: [],
  recentSearches: [],
};