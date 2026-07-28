import { create } from 'zustand';
import { GeocodingResult } from '@/types/geocoding';
import { MAX_RECENT_SEARCHES } from '@/constants/defaults';
import { getFavorites, saveFavorites, getRecentSearches, saveRecentSearches } from '@/services/settingsService';

interface SearchState {
  recentSearches: string[];
  favorites: string[];
  searchResults: GeocodingResult[];
  isSearching: boolean;
  searchError: string | null;

  load: () => void;
  setSearchResults: (results: GeocodingResult[]) => void;
  setIsSearching: (value: boolean) => void;
  setSearchError: (error: string | null) => void;
  addRecentSearch: (city: string) => void;
  clearRecentSearches: () => void;
  toggleFavorite: (city: string) => void;
  isFavorite: (city: string) => boolean;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  recentSearches: [],
  favorites: [],
  searchResults: [],
  isSearching: false,
  searchError: null,

  load: () => {
    set({
      recentSearches: getRecentSearches(),
      favorites: getFavorites(),
    });
  },

  setSearchResults: (results) => set({ searchResults: results }),

  setIsSearching: (value) => set({ isSearching: value }),

  setSearchError: (error) => set({ searchError: error }),

  addRecentSearch: (city) => {
    const { recentSearches } = get();
    const filtered = recentSearches.filter((s) => s !== city);
    const updated = [city, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    saveRecentSearches(updated);
    set({ recentSearches: updated });
  },

  clearRecentSearches: () => {
    saveRecentSearches([]);
    set({ recentSearches: [] });
  },

  toggleFavorite: (city) => {
    const { favorites } = get();
    let updated: string[];
    if (favorites.includes(city)) {
      updated = favorites.filter((f) => f !== city);
    } else {
      updated = [...favorites, city];
    }
    saveFavorites(updated);
    set({ favorites: updated });
  },

  isFavorite: (city) => {
    return get().favorites.includes(city);
  },
}));