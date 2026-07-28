import { motion } from 'framer-motion';
import { DailyForecast as DailyForecastType } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperatureShort } from '@/utils/temperature';
import { formatDay } from '@/utils/timeFormatter';
import { useSettingsStore } from '@/store/settingsStore';
import { Droplets } from 'lucide-react';

interface DailyForecastProps {
  data: DailyForecastType;
}

export function DailyForecast({ data }: DailyForecastProps) {
  const tempUnit = useSettingsStore((s) => s.settings.temperatureUnit);

  const days = data.time.map((time, i) => ({
    day: formatDay(time),
    high: data.temperatureMax[i],
    low: data.temperatureMin[i],
    code: data.weatherCode[i],
    sunrise: data.sunrise[i],
    sunset: data.sunset[i],
    rainChance: data.precipitationProbabilityMax?.[i] ?? 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3"
    >
      <h2 className="text-lg font-semibold text-white">7-Day Forecast</h2>
      <div className="space-y-2">
        {days.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-md"
          >
            <span className="w-24 text-sm font-medium text-white">
              {day.day}
            </span>
            <WeatherIcon
              weatherCode={day.code}
              size={20}
              className="text-white"
              sunrise={day.sunrise}
              sunset={day.sunset}
            />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-blue-300">
                <Droplets className="h-3 w-3" />
                <span>{day.rainChance}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">
                  {formatTemperatureShort(day.high, tempUnit)}
                </span>
                <span className="text-white/50">
                  {formatTemperatureShort(day.low, tempUnit)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}