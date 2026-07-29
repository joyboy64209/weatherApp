import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings, getFavorites, saveFavorites, getRecentSearches, saveRecentSearches } from './settingsService';
import { AppSettings, DEFAULT_SETTINGS } from '@/types/settings';

beforeEach(() => {
  localStorage.clear();
});

describe('loadSettings', () => {
  it('returns default settings when nothing is stored', () => {
    const settings = loadSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('returns saved settings', () => {
    const custom: Partial<AppSettings> = {
      temperatureUnit: 'fahrenheit',
      theme: 'dark',
    };
    saveSettings({ ...DEFAULT_SETTINGS, ...custom });
    const loaded = loadSettings();
    expect(loaded.temperatureUnit).toBe('fahrenheit');
    expect(loaded.theme).toBe('dark');
    expect(loaded.windSpeedUnit).toBe('kmh');
  });

  it('merges with defaults for missing fields', () => {
    localStorage.setItem('weatherApp_settings', JSON.stringify({ theme: 'light' }));
    const loaded = loadSettings();
    expect(loaded.theme).toBe('light');
    expect(loaded.temperatureUnit).toBe('celsius');
    expect(loaded.autoLocation).toBe(true);
  });
});

describe('saveSettings', () => {
  it('persists settings to localStorage', () => {
    const settings: AppSettings = { ...DEFAULT_SETTINGS, temperatureUnit: 'fahrenheit' };
    saveSettings(settings);
    const stored = JSON.parse(localStorage.getItem('weatherApp_settings') || '{}');
    expect(stored.temperatureUnit).toBe('fahrenheit');
  });
});

describe('favorites', () => {
  it('returns empty array when no favorites stored', () => {
    expect(getFavorites()).toEqual([]);
  });

  it('saves and retrieves favorites', () => {
    saveFavorites(['New York|40.71|-74.01|US', 'London|51.51|-0.13|GB']);
    expect(getFavorites()).toHaveLength(2);
    expect(getFavorites()[0]).toContain('New York');
  });
});

describe('recent searches', () => {
  it('returns empty array when no searches stored', () => {
    expect(getRecentSearches()).toEqual([]);
  });

  it('saves and retrieves recent searches', () => {
    saveRecentSearches(['Paris|48.86|2.35|FR', 'Tokyo|35.68|139.69|JP']);
    expect(getRecentSearches()).toHaveLength(2);
    expect(getRecentSearches()[0]).toContain('Paris');
  });
});