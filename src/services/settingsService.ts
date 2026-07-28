import { LOCAL_STORAGE_KEYS } from '@/constants/defaults';
import { AppSettings, DEFAULT_SETTINGS } from '@/types/settings';

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch {
    // ignore
  }
}

export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_SEARCHES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
  } catch {
    // ignore
  }
}