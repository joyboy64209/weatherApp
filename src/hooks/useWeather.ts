import { useQuery } from '@tanstack/react-query';
import { getWeatherData, getAirQualityData } from '@/services/weatherService';
import { getCachedWeather, setCachedWeather } from '@/services/cacheService';
import { useSettingsStore } from '@/store/settingsStore';
import { WeatherData } from '@/types/weather';
import { AirQualityData } from '@/types/airQuality';

export function useWeatherData(latitude: number | null, longitude: number | null, cityName?: string, country?: string) {
  const cacheDuration = useSettingsStore((s) => s.settings.cacheDuration);

  return useQuery<WeatherData>({
    queryKey: ['weather', latitude, longitude, cityName],
    queryFn: async () => {
      if (latitude === null || longitude === null) {
        throw new Error('Location not available');
      }

      const cached = getCachedWeather(latitude, longitude);
      if (cached) {
        return cached;
      }

      const data = await getWeatherData(latitude, longitude, cityName, country);
      setCachedWeather(latitude, longitude, data, cacheDuration);
      return data;
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: cacheDuration * 60 * 1000,
    retry: 2,
    refetchInterval: useSettingsStore.getState().settings.refreshInterval * 60 * 1000,
  });
}

export function useAirQuality(latitude: number | null, longitude: number | null) {
  return useQuery<AirQualityData>({
    queryKey: ['airQuality', latitude, longitude],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        throw new Error('Location not available');
      }
      return getAirQualityData(latitude, longitude);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });
}