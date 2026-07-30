import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWeatherData, useAirQuality } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSettingsStore } from '@/store/settingsStore';
import { useSearchStore } from '@/store/searchStore';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { AirQuality } from '@/components/weather/AirQuality';
import { WeatherSkeleton } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import { getOfflineWeather } from '@/services/cacheService';
import { WeatherData } from '@/types/weather';
import { Wind, Droplets, Sun, Compass } from 'lucide-react';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const autoLocation = useSettingsStore((s) => s.settings.autoLocation);
  const { load: loadSearchStore } = useSearchStore();
  const geolocation = useGeolocation();
  const windUnit = useSettingsStore((s) => s.settings.windSpeedUnit);

  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  const latitude = latParam ? parseFloat(latParam) : geolocation.latitude;
  const longitude = lonParam ? parseFloat(lonParam) : geolocation.longitude;

  const { data: weatherData, isLoading, isError, error, refetch } = useWeatherData(latitude, longitude);
  const { data: airQualityData } = useAirQuality(latitude, longitude);
  const [offlineData, setOfflineData] = useState<WeatherData | null>(null);

  useEffect(() => { loadSearchStore(); }, [loadSearchStore]);
  useEffect(() => { if (autoLocation && !latParam) geolocation.requestLocation(); }, [autoLocation, latParam, geolocation]);
  useEffect(() => { if (isError && !navigator.onLine) setOfflineData(getOfflineWeather()); }, [isError]);

  const displayData = weatherData || offlineData;
  const weatherInfo = getWeatherCodeInfo(displayData?.current.weatherCode ?? 0);

  const gradientStyle = {
    background: `linear-gradient(to bottom right, ${weatherInfo.gradient.from}20, #0b1326, ${weatherInfo.gradient.to}40)`,
  };

  if (!latParam && !geolocation.latitude && autoLocation && geolocation.loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-primary" role="status">
            <span className="sr-only">Detecting your location...</span>
          </div>
          <p className="text-on-surface-variant">Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (geolocation.error && !latitude) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <ErrorDisplay type="location" message={geolocation.error} onRetry={geolocation.requestLocation} />
      </div>
    );
  }

  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (isError && !offlineData) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <ErrorDisplay type={!navigator.onLine ? 'network' : 'api'} message={errorMessage} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <ErrorDisplay type="general" message="No weather data available. Search for a city to get started." onRetry={geolocation.requestLocation} />
      </div>
    );
  }

  const current = displayData.current;
  const daily = displayData.daily;

  return (
    <div style={gradientStyle} className="-m-container-padding min-h-screen p-container-padding transition-all duration-500">
      {offlineData && (
        <div className="mb-6 rounded-xl bg-yellow-500/20 p-3 text-center text-label-sm text-yellow-300 backdrop-blur-sm">
          🛑 Offline Mode — Showing cached data
        </div>
      )}

      {/* 12-Column Grid */}
      <div className="grid grid-cols-12 gap-card-gap">
        {/* Hero Section (8 cols) */}
        <div className="col-span-12 flex min-h-[400px] flex-col justify-end rounded-[2rem] glass-panel p-10 lg:col-span-8">
          <div className="relative z-10">
            <div className="mb-2 flex items-baseline gap-4">
              <h3 className="font-display-temp text-display-temp leading-none text-on-surface">
                {Math.round(current.temperature)}°
              </h3>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface">
                  {getWeatherCodeInfo(current.weatherCode).description}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {displayData.cityName}, {displayData.country}
                </span>
              </div>
            </div>
            <p className="font-body-lg text-body-lg max-w-md text-on-surface-variant">
              {getWeatherDescription(current.weatherCode)} through the evening.
            </p>
          </div>
        </div>

        {/* 7-Day Forecast (4 cols) */}
        <div className="col-span-12 flex flex-col rounded-[2rem] glass-panel p-6 lg:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-headline-md text-headline-md text-on-surface">7-Day Forecast</h4>
            <Compass className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="flex-1 space-y-4">
            {daily.time.slice(0, 7).map((time, i) => {
              const day = i === 0 ? 'Today' : new Date(time).toLocaleDateString('en-US', { weekday: 'short' });
              const high = daily.temperatureMax[i];
              const low = daily.temperatureMin[i];
              const code = daily.weatherCode[i];
              const rangePct = ((high - low) / 10) * 100;
              return (
                <div key={time} className="flex items-center justify-between border-b border-glass-stroke py-2 last:border-0">
                  <span className="w-12 font-label-md text-label-md text-on-surface">{day}</span>
                  <WeatherIconSmall code={code} />
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right font-label-md text-label-md text-on-surface">{Math.round(high)}°</span>
                    <div className="relative h-1 w-16 overflow-hidden rounded-full bg-glass-fill">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${Math.min(Math.max(rangePct, 10), 100)}%` }}></div>
                    </div>
                    <span className="w-8 font-label-md text-label-md text-on-surface-variant">{Math.round(low)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="col-span-12 overflow-hidden rounded-[2rem] glass-panel p-6">
          <HourlyForecast data={displayData.hourly} sunrise={daily.sunrise[0]} sunset={daily.sunset[0]} />
        </div>

        {/* Wind Dial */}
        <div className="col-span-12 rounded-[2rem] glass-panel p-6 transition-colors hover:border-primary/40 lg:col-span-3">
          <div className="mb-6 flex items-center gap-3">
            <Wind className="h-5 w-5 text-primary" />
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Wind</h4>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-glass-stroke"></div>
              <span className="font-headline-md text-headline-md text-on-surface">
                {Math.round(current.windSpeed)}<span className="font-label-md text-label-md text-on-surface-variant">{windUnit === 'kmh' ? 'km/h' : 'mph'}</span>
              </span>
            </div>
            <p className="mt-4 font-label-md text-label-md text-on-surface-variant">{getWindDirection(current.windDirection)}</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="col-span-12 rounded-[2rem] glass-panel p-6 transition-colors hover:border-primary/40 lg:col-span-3">
          <div className="mb-6 flex items-center gap-3">
            <Droplets className="h-5 w-5 text-primary" />
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Humidity</h4>
          </div>
          <div className="space-y-4">
            <p className="font-headline-md text-headline-md text-on-surface">{current.relativeHumidity}%</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-glass-fill">
              <div className="h-full rounded-full bg-primary" style={{ width: `${current.relativeHumidity}%` }}></div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">The dew point is {Math.round(current.apparentTemperature)}° right now.</p>
          </div>
        </div>

        {/* UV Index */}
        <div className="col-span-12 rounded-[2rem] glass-panel p-6 transition-colors hover:border-primary/40 lg:col-span-3">
          <div className="mb-6 flex items-center gap-3">
            <Sun className="h-5 w-5 text-primary" />
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">UV Index</h4>
          </div>
          <div className="space-y-4">
            <p className="font-headline-md text-headline-md text-on-surface">
              {current.uvIndex.toFixed(0)} <span className="font-label-md text-label-md text-aqi-good">Low</span>
            </p>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-glass-fill">
              <div className="h-full w-full bg-gradient-to-r from-aqi-good via-aqi-fair to-aqi-poor opacity-30"></div>
              <div className="absolute inset-y-0 left-0 w-2 rounded-full bg-aqi-good shadow-[0_0_8px_rgba(52,211,153,0.8)]" style={{ left: `${Math.min(current.uvIndex * 10, 90)}%` }}></div>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Low levels for the rest of the day.</p>
          </div>
        </div>

        {/* Pressure */}
        <div className="col-span-12 rounded-[2rem] glass-panel p-6 transition-colors hover:border-primary/40 lg:col-span-3">
          <div className="mb-6 flex items-center gap-3">
            <Compass className="h-5 w-5 text-primary" />
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Pressure</h4>
          </div>
          <div className="space-y-4">
            <p className="font-headline-md text-headline-md text-on-surface">
              {Math.round(current.surfacePressure)} <span className="font-label-md text-label-md text-on-surface-variant">hPa</span>
            </p>
            <div className="flex items-end justify-between gap-1" style={{ height: '64px' }}>
              {[45, 65, 100, 75, 50].map((h, i) => (
                <div key={i} className={`w-full rounded-t-sm ${i === 2 ? 'bg-primary' : 'bg-glass-stroke'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Pressure is rising steadily.</p>
          </div>
        </div>

        {/* Interactive Radar Map */}
        <section className="col-span-12 relative h-80 overflow-hidden rounded-[2rem] glass-panel transition-colors group">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface/50 to-surface">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Compass className="mx-auto mb-4 h-12 w-12 text-primary/40" />
                <h4 className="font-headline-md text-headline-md mb-2 text-on-surface">Interactive Radar</h4>
                <p className="font-body-md text-body-md mb-4 text-on-surface-variant">View real-time precipitation and storm tracking in your area.</p>
                <button className="glass-card inline-flex items-center gap-2 rounded-full px-6 py-3 font-label-md text-label-md font-bold transition-all hover:bg-primary hover:text-on-primary">
                  Open Radar Map
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Air Quality */}
        {airQualityData && (
          <div className="col-span-12">
            <AirQuality data={airQualityData} />
          </div>
        )}
      </div>

      <footer className="mt-section-margin pb-10 text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant opacity-40">
          Data provided by Open-Meteo • Updated {new Date().toLocaleTimeString()}
        </p>
      </footer>
    </div>
  );
}

function WeatherIconSmall({ code }: { code: number }) {
  const info = getWeatherCodeInfo(code);
  const icons: Record<string, string> = {
    Sun: '☀️', Moon: '🌙', Cloud: '☁️', CloudSun: '⛅',
    CloudFog: '🌫️', CloudDrizzle: '🌦️', CloudRain: '🌧️',
    CloudRainWind: '🌧️', CloudSnow: '❄️', CloudLightning: '⛈️',
  };
  return <span className="text-xl">{icons[info.icon] || '☁️'}</span>;
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

function getWeatherDescription(code: number): string {
  const descs: Record<number, string> = {
    0: 'Clear skies', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy conditions', 48: 'Freezing fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Moderate showers', 82: 'Violent showers',
    95: 'Thunderstorms', 96: 'Thunderstorms with hail', 99: 'Severe thunderstorms',
  };
  return descs[code] || 'Variable conditions';
}