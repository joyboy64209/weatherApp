import { LOCAL_STORAGE_KEYS } from '@/constants/defaults';
import { WeatherData } from '@/types/weather';

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
  expiryMinutes: number;
}

export function getCachedWeather(latitude: number, longitude: number): WeatherData | null {
  try {
    const key = `${LOCAL_STORAGE_KEYS.CACHE}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const entry: CacheEntry = JSON.parse(stored);
    const now = Date.now();
    const expiryMs = entry.expiryMinutes * 60 * 1000;

    if (now - entry.timestamp > expiryMs) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedWeather(
  latitude: number,
  longitude: number,
  data: WeatherData,
  expiryMinutes: number = 30,
): void {
  try {
    const key = `${LOCAL_STORAGE_KEYS.CACHE}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expiryMinutes,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage might be full - silently fail
  }
}

export function getOfflineWeather(): WeatherData | null {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LOCAL_STORAGE_KEYS.CACHE)) {
        keys.push(key);
      }
    }

    if (keys.length === 0) return null;

    // Return the most recent cached weather
    let latest: CacheEntry | null = null;
    for (const key of keys) {
      try {
        const entry: CacheEntry = JSON.parse(localStorage.getItem(key) || '');
        if (!latest || entry.timestamp > latest.timestamp) {
          latest = entry;
        }
      } catch {
        continue;
      }
    }

    return latest?.data || null;
  } catch {
    return null;
  }
}