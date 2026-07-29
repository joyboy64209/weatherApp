import { motion } from 'framer-motion';
import { WeatherData } from '@/types/weather';
import { formatTemperature } from '@/utils/temperature';
import { formatWindSpeed, getWindDirection } from '@/utils/windSpeed';
import { formatTime, getCurrentTimeFormatted } from '@/utils/timeFormatter';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import { useSettingsStore } from '@/store/settingsStore';
import {
  Sun,
  Sunset,
  Droplets,
  Wind,
  Eye,
  Thermometer,
  Gauge,
  Cloud,
  Shield,
} from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const tempUnit = useSettingsStore((s) => s.settings.temperatureUnit);
  const windUnit = useSettingsStore((s) => s.settings.windSpeedUnit);
  const info = getWeatherCodeInfo(data.current.weatherCode);

  const metrics = [
    {
      label: 'Humidity',
      value: `${data.current.relativeHumidity}%`,
      icon: Droplets,
    },
    {
      label: 'Wind',
      value: `${formatWindSpeed(data.current.windSpeed, windUnit)} ${getWindDirection(data.current.windDirection)}`,
      icon: Wind,
    },
    {
      label: 'Visibility',
      value: `${(data.current.visibility / 1000).toFixed(1)} km`,
      icon: Eye,
    },
    {
      label: 'Feels Like',
      value: formatTemperature(data.current.apparentTemperature, tempUnit),
      icon: Thermometer,
    },
    {
      label: 'Pressure',
      value: `${Math.round(data.current.surfacePressure)} hPa`,
      icon: Gauge,
    },
    {
      label: 'UV Index',
      value: data.current.uvIndex.toFixed(1),
      icon: Shield,
    },
    {
      label: 'Cloud Cover',
      value: `${data.current.cloudCover}%`,
      icon: Cloud,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white"
          >
            {data.cityName}
          </motion.h1>
          <p className="mt-1 text-white/60">
            {data.country} &middot; {getCurrentTimeFormatted()}
          </p>
          <p className="text-sm text-white/40">{info.description}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-right"
        >
          <div className="text-6xl font-bold text-white">
            {formatTemperature(data.current.temperature, tempUnit).replace(/[°CF]/g, '')}°
          </div>
          <div className="text-lg text-white/60">
            {formatTemperature(data.current.temperature, tempUnit).slice(-2)}
          </div>
        </motion.div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="flex gap-6 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-400" />
          <span>Sunrise {formatTime(data.daily.sunrise[0])}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="h-4 w-4 text-orange-400" />
          <span>Sunset {formatTime(data.daily.sunset[0])}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="rounded-xl bg-white/10 p-4 backdrop-blur-md"
          >
            <div className="mb-2 flex items-center gap-2 text-white/50">
              <metric.icon className="h-4 w-4" />
              <span className="text-xs">{metric.label}</span>
            </div>
            <p className="text-lg font-semibold text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}