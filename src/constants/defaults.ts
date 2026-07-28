export const API_BASE_URL = 'https://api.open-meteo.com/v1';
export const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
export const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

export const REFRESH_INTERVALS = [
  { label: '1 minute', value: 1 },
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
] as const;

export const CACHE_DURATIONS = [
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
] as const;

export const DEBOUNCE_DELAY = 300;

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'weatherApp_settings',
  CACHE: 'weatherApp_cache',
  FAVORITES: 'weatherApp_favorites',
  RECENT_SEARCHES: 'weatherApp_recent',
  WINDOW_SIZE: 'weatherApp_windowSize',
} as const;

export const MAX_RECENT_SEARCHES = 10;
export const MAX_FAVORITE_CITIES = 20;