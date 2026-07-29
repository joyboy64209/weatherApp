import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWeatherData, useAirQuality } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettingsStore } from '@/store/settingsStore';
import { useSearchStore } from '@/store/searchStore';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { AirQuality } from '@/components/weather/AirQuality';
import { WeatherSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import { getOfflineWeather } from '@/services/cacheService';
import { WeatherData } from '@/types/weather';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const autoLocation = useSettingsStore((s) => s.settings.autoLocation);
  const { load: loadSearchStore, recentSearches, favorites } = useSearchStore();
  const geolocation = useGeolocation();

  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const cityParam = searchParams.get('city');
  const countryParam = searchParams.get('country');

  const latitude = latParam ? parseFloat(latParam) : geolocation.latitude;
  const longitude = lonParam ? parseFloat(lonParam) : geolocation.longitude;

  const { data: weatherData, isLoading, isError, error, refetch } = useWeatherData(
    latitude,
    longitude,
    cityParam || undefined,
    countryParam || undefined,
  );

  const { data: airQualityData } = useAirQuality(latitude, longitude);

  const [offlineData, setOfflineData] = useState<WeatherData | null>(null);

  useEffect(() => {
    loadSearchStore();
  }, [loadSearchStore]);

  useEffect(() => {
    if (autoLocation && !latParam) {
      geolocation.requestLocation();
    }
  }, [autoLocation, latParam, geolocation]);

  useEffect(() => {
    if (isError && !navigator.onLine) {
      const cached = getOfflineWeather();
      setOfflineData(cached);
    }
  }, [isError]);

  const handleSelectSavedCity = useCallback(
    (entry: string) => {
      const [name, lat, lon, country] = entry.split('|');
      navigate(`/?lat=${lat}&lon=${lon}&city=${encodeURIComponent(name)}&country=${encodeURIComponent(country || '')}`);
    },
    [navigate],
  );

  const displayData = weatherData || offlineData;
  const currentWeatherCode = displayData?.current.weatherCode ?? 0;
  const weatherInfo = getWeatherCodeInfo(currentWeatherCode);

  const gradientStyle = {
    background: `linear-gradient(135deg, ${weatherInfo.gradient.from}, ${weatherInfo.gradient.to})`,
  };

  if (!latParam && !geolocation.latitude && autoLocation && geolocation.loading) {
    return (
      <div style={gradientStyle} className="min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" role="status">
              <span className="sr-only">Detecting your location...</span>
            </div>
            <p className="text-white/60">Detecting your location...</p>
          </div>
        </div>
      </div>
    );
  }

  if (geolocation.error && !latitude) {
    return (
      <div style={gradientStyle} className="min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <ErrorDisplay
            type="location"
            message={geolocation.error}
            onRetry={geolocation.requestLocation}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={gradientStyle} className="min-h-screen">
        <div className="p-4">
          <WeatherSkeleton />
        </div>
      </div>
    );
  }

  if (isError && !offlineData) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
    const errorType = !navigator.onLine ? 'network' : 'api';

    return (
      <div style={gradientStyle} className="min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <ErrorDisplay
            type={errorType}
            message={errorMessage}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div style={gradientStyle} className="min-h-screen">
        <div className="mx-auto max-w-2xl space-y-6 p-4">
          <div className="text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-white/40" />
            <h2 className="text-xl font-semibold text-white">Welcome to Weather App</h2>
            <p className="mt-2 text-white/60">Search for a city or enable location to get started</p>
          </div>

          {favorites.length > 0 && (
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
                <Star className="h-4 w-4" />
                Favorite Cities
              </h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map((fav) => (
                  <motion.button
                    key={fav}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectSavedCity(fav)}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md hover:bg-white/20"
                  >
                    <Star className="h-3 w-3 text-yellow-400" />
                    {fav.split('|')[0]}
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {recentSearches.length > 0 && (
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <motion.button
                    key={search}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectSavedCity(search)}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md hover:bg-white/20"
                  >
                    <Clock className="h-3 w-3" />
                    {search.split('|')[0]}
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={geolocation.requestLocation}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" />
              Detect My Location
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={gradientStyle} className="min-h-screen transition-all duration-500">
      <div className="space-y-6 p-4">
        {offlineData && (
          <div className="rounded-xl bg-yellow-500/20 p-3 text-center text-sm text-yellow-300 backdrop-blur-sm">
            🛑 Offline Mode — Showing cached data
          </div>
        )}

        <CurrentWeather data={displayData} />

        <HourlyForecast
          data={displayData.hourly}
          sunrise={displayData.daily.sunrise[0]}
          sunset={displayData.daily.sunset[0]}
        />

        <DailyForecast data={displayData.daily} />

        {airQualityData && <AirQuality data={airQualityData} />}
      </div>
    </div>
  );
}