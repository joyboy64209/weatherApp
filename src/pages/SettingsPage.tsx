import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from '@/hooks/useTheme';
import { REFRESH_INTERVALS, CACHE_DURATIONS } from '@/constants/defaults';
import { TemperatureUnit, WindSpeedUnit, ThemeMode } from '@/types/settings';
import { Sun, Moon, Monitor, Thermometer, Wind, MapPin, RefreshCw, Database } from 'lucide-react';

export function SettingsPage() {
  const { settings, setTemperatureUnit, setWindSpeedUnit, setAutoLocation, setRefreshInterval, setCacheDuration } = useSettingsStore();
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const tempOptions: { value: TemperatureUnit; label: string }[] = [
    { value: 'celsius', label: 'Celsius (°C)' },
    { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
  ];

  const windOptions: { value: WindSpeedUnit; label: string }[] = [
    { value: 'kmh', label: 'km/h' },
    { value: 'mph', label: 'mph' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-8 p-4"
    >
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Theme */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
          <Monitor className="h-4 w-4" />
          Theme
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = settings.theme === option.value;
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white ring-2 ring-white/30'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
                aria-label={`${option.label} theme`}
                aria-pressed={isActive}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Temperature Unit */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
          <Thermometer className="h-4 w-4" />
          Temperature
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {tempOptions.map((option) => {
            const isActive = settings.temperatureUnit === option.value;
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTemperatureUnit(option.value)}
                className={`rounded-xl p-4 text-center transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white ring-2 ring-white/30'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
                aria-label={`${option.label} temperature`}
                aria-pressed={isActive}
              >
                <span className="text-sm">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Wind Speed Unit */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
          <Wind className="h-4 w-4" />
          Wind Speed
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {windOptions.map((option) => {
            const isActive = settings.windSpeedUnit === option.value;
            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setWindSpeedUnit(option.value)}
                className={`rounded-xl p-4 text-center transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white ring-2 ring-white/30'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
                aria-label={`${option.label} wind speed`}
                aria-pressed={isActive}
              >
                <span className="text-sm">{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Auto Location */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
          <MapPin className="h-4 w-4" />
          Location
        </h2>
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Auto-detect location</p>
              <p className="text-xs text-white/50">Use GPS to get weather for your current location</p>
            </div>
            <button
              onClick={() => setAutoLocation(!settings.autoLocation)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                settings.autoLocation ? 'bg-blue-500' : 'bg-white/20'
              }`}
              role="switch"
              aria-checked={settings.autoLocation}
              aria-label="Toggle auto location"
            >
              <motion.div
                animate={{ x: settings.autoLocation ? 20 : 2 }}
                className="absolute top-1 h-4 w-4 rounded-full bg-white"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Refresh Interval */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
          <RefreshCw className="h-4 w-4" />
          Auto-refresh
        </h2>
        <div className="flex flex-wrap gap-2">
          {REFRESH_INTERVALS.map((interval) => {
            const isActive = settings.refreshInterval === interval.value;
            return (
              <motion.button
                key={interval.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRefreshInterval(interval.value)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white ring-2 ring-white/30'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
                aria-label={`Refresh every ${interval.label}`}
                aria-pressed={isActive}
              >
                {interval.label}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Cache Duration */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/60 uppercase tracking-wider">
          <Database className="h-4 w-4" />
          Cache Duration
        </h2>
        <div className="flex flex-wrap gap-2">
          {CACHE_DURATIONS.map((duration) => {
            const isActive = settings.cacheDuration === duration.value;
            return (
              <motion.button
                key={duration.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCacheDuration(duration.value)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white ring-2 ring-white/30'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
                aria-label={`Cache for ${duration.label}`}
                aria-pressed={isActive}
              >
                {duration.label}
              </motion.button>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}