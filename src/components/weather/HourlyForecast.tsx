import { motion } from 'framer-motion';
import { HourlyForecast as HourlyForecastType } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperatureShort } from '@/utils/temperature';
import { formatHour } from '@/utils/timeFormatter';
import { useSettingsStore } from '@/store/settingsStore';
import { Droplets } from 'lucide-react';

interface HourlyForecastProps {
  data: HourlyForecastType;
  sunrise?: string;
  sunset?: string;
}

export function HourlyForecast({ data, sunrise, sunset }: HourlyForecastProps) {
  const tempUnit = useSettingsStore((s) => s.settings.temperatureUnit);

  // Get next 24 hours from current time
  const now = new Date();
  const currentHour = now.getHours();
  const startIndex = data.time.findIndex((t) => {
    const hour = new Date(t).getHours();
    return hour >= currentHour;
  });

  const hours = data.time.slice(startIndex, startIndex + 24).map((time, i) => ({
    time,
    temp: data.temperature[startIndex + i],
    precip: data.precipitationProbability[startIndex + i],
    code: data.weatherCode[startIndex + i],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      <h2 className="text-lg font-semibold text-white">Hourly Forecast</h2>
      <div
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20"
        role="list"
        aria-label="Hourly weather forecast"
      >
        {hours.map((hour, index) => (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="flex min-w-[80px] flex-col items-center gap-2 rounded-xl bg-white/10 p-3 backdrop-blur-md"
            role="listitem"
          >
            <span className="text-xs text-white/60">
              {index === 0 ? 'Now' : formatHour(hour.time)}
            </span>
            <WeatherIcon
              weatherCode={hour.code}
              size={24}
              className="text-white"
              sunrise={sunrise}
              sunset={sunset}
            />
            <span className="text-sm font-semibold text-white">
              {formatTemperatureShort(hour.temp, tempUnit)}
            </span>
            <div className="flex items-center gap-1 text-xs text-blue-300">
              <Droplets className="h-3 w-3" />
              <span>{hour.precip}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}