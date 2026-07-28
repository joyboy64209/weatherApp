import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

export function HomePage() {
  const [searchParams] = useSearchParams();
  const autoLocation = useSettingsStore((s) => s.settings.autoLocation);
  const { load: loadSearchStore } = useSearchStore();
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
        <div className="flex min-h-screen items-center justify-center">
          <ErrorDisplay
            type="general"
            message="No weather data available. Search for a city to get started."
            onRetry={geolocation.requestLocation}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={gradientStyle} className="min-h-screen transition-all duration-500">
      <div className="space-y-6 p-4">
        {offlineData && (
          <div className="rounded-xl bg-yellow-500/20 p-3 text-center text-sm text-yellow-300 backdrop-blur-sm">
            Showing cached data — you are offline
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