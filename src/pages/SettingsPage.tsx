import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from '@/hooks/useTheme';
import { REFRESH_INTERVALS, CACHE_DURATIONS } from '@/constants/defaults';
import { TemperatureUnit, WindSpeedUnit, ThemeMode } from '@/types/settings';
import { Sun, Moon, Monitor, RefreshCw, Database, Ruler, Palette, Gauge } from 'lucide-react';

export function SettingsPage() {
  const { settings, setTemperatureUnit, setWindSpeedUnit, setAutoLocation, setRefreshInterval, setCacheDuration } = useSettingsStore();
  const { setTheme } = useTheme();

  const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const tempOptions: { value: TemperatureUnit; label: string }[] = [
    { value: 'celsius', label: 'Celsius' },
    { value: 'fahrenheit', label: 'Fahrenheit' },
  ];

  const windOptions: { value: WindSpeedUnit; label: string }[] = [
    { value: 'kmh', label: 'km/h' },
    { value: 'mph', label: 'mph' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-12">
      {/* Section: Units */}
      <section className="space-y-4">
        <div className="mb-2 flex items-center gap-2">
          <Ruler className="h-6 w-6 text-primary" />
          <h3 className="font-headline-md text-headline-md text-on-surface">Measurement Units</h3>
        </div>
        <div className="divide-y divide-glass-stroke overflow-hidden rounded-2xl glass-panel">
          {/* Temperature */}
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-label-md text-label-md text-on-surface">Temperature</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Choose your preferred temperature scale</p>
            </div>
            <div className="flex rounded-lg border border-glass-stroke bg-glass-fill p-1">
              {tempOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTemperatureUnit(opt.value)}
                  className={`rounded-md px-4 py-1.5 font-label-md text-label-md font-medium transition-all ${
                    settings.temperatureUnit === opt.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Wind Speed */}
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-label-md text-label-md text-on-surface">Wind Speed</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Unit for wind velocity measurements</p>
            </div>
            <select
              value={settings.windSpeedUnit}
              onChange={(e) => setWindSpeedUnit(e.target.value as WindSpeedUnit)}
              className="cursor-pointer appearance-none rounded-lg border border-glass-stroke bg-glass-fill px-4 py-2 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ colorScheme: 'dark' }}
            >
              {windOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface text-on-surface">{opt.label}</option>
              ))}
            </select>
          </div>
          {/* Pressure */}
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-label-md text-label-md text-on-surface">Atmospheric Pressure</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Barometric pressure reporting unit</p>
            </div>
            <div className="flex rounded-lg border border-glass-stroke bg-glass-fill p-1">
              <button className="rounded-md px-4 py-1.5 font-label-md text-label-md font-medium text-on-surface-variant hover:text-on-surface">hPa</button>
              <button className="rounded-md bg-primary px-4 py-1.5 font-label-md text-label-md font-medium text-on-primary">inHg</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Appearance */}
      <section className="space-y-4">
        <div className="mb-2 flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h3 className="font-headline-md text-headline-md text-on-surface">Appearance & Behavior</h3>
        </div>
        <div className="divide-y divide-glass-stroke overflow-hidden rounded-2xl glass-panel">
          {/* Theme */}
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-label-md text-label-md text-on-surface">Visual Theme</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Switch between light and dark glass styles</p>
            </div>
            <div className="flex gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = settings.theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`rounded-lg border p-2.5 transition-colors ${
                      isActive
                        ? 'border-primary bg-primary-container text-on-primary'
                        : 'border-glass-stroke bg-glass-fill text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>
          {/* Auto-Location */}
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-label-md text-label-md text-on-surface">Auto-Location Tracking</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Update weather based on your current GPS position</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoLocation}
                onChange={() => setAutoLocation(!settings.autoLocation)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Section: Performance */}
      <section className="space-y-4">
        <div className="mb-2 flex items-center gap-2">
          <Gauge className="h-6 w-6 text-primary" />
          <h3 className="font-headline-md text-headline-md text-on-surface">Performance</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl glass-panel p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-on-surface-variant" />
              <p className="font-label-md text-label-md text-on-surface">Refresh Interval</p>
            </div>
            <select
              value={settings.refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-glass-stroke bg-glass-fill px-4 py-3 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ colorScheme: 'dark' }}
            >
              {REFRESH_INTERVALS.map((interval) => (
                <option key={interval.value} value={interval.value} className="bg-surface text-on-surface">Every {interval.label}</option>
              ))}
            </select>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Lower intervals may affect battery life on laptops.</p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl glass-panel p-6">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-on-surface-variant" />
              <p className="font-label-md text-label-md text-on-surface">Cache Duration</p>
            </div>
            <select
              value={settings.cacheDuration}
              onChange={(e) => setCacheDuration(Number(e.target.value))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-glass-stroke bg-glass-fill px-4 py-3 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ colorScheme: 'dark' }}
            >
              {CACHE_DURATIONS.map((duration) => (
                <option key={duration.value} value={duration.value} className="bg-surface text-on-surface">{duration.label}</option>
              ))}
            </select>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Stored data helps load dashboards instantly.</p>
          </div>
        </div>
      </section>

      {/* Section: About */}
      <section className="border-t border-glass-stroke pt-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <h4 className="font-label-md text-label-md text-on-surface">SkyGlass Desktop</h4>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Version 2.4.1 (Stable Build)</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 SkyGlass Atmospheric Sciences Corp.</p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border border-glass-stroke px-6 py-2.5 font-label-md text-label-md text-on-surface transition-all hover:bg-glass-fill">View Changelog</button>
            <button className="rounded-xl border border-glass-stroke bg-glass-fill px-6 py-2.5 font-label-md text-label-md text-on-surface transition-all hover:text-primary">Support</button>
          </div>
        </div>
      </section>
    </div>
  );
}