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
    >
      <div className="mb-6 flex items-center justify-between">
        <h4 className="font-headline-md text-headline-md text-on-surface">Hourly Forecast</h4>
        <div className="flex gap-2">
          <button className="rounded-full bg-primary px-4 py-1.5 font-label-md text-label-md text-on-primary">Next 24h</button>
          <button className="rounded-full bg-glass-fill px-4 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-glass-stroke">Next 48h</button>
        </div>
      </div>
      <div className="custom-scrollbar flex gap-8 overflow-x-auto pb-4">
        {hours.map((hour, index) => (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="group flex min-w-[64px] shrink-0 flex-col items-center gap-3"
          >
            <span className="font-label-md text-label-md text-on-surface-variant">
              {index === 0 ? 'Now' : formatHour(hour.time)}
            </span>
            <WeatherIcon
              weatherCode={hour.code}
              size={28}
              className="text-primary"
              sunrise={sunrise}
              sunset={sunset}
              time={hour.time}
            />
            <span className="font-body-lg text-body-lg font-bold text-on-surface">
              {formatTemperatureShort(hour.temp, tempUnit)}
            </span>
            <div className="flex items-center gap-1 text-xs text-primary/60">
              <Droplets className="h-3 w-3" />
              <span>{hour.precip}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}