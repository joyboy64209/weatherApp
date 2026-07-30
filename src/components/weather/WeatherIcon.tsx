import { Sun, Moon, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning } from 'lucide-react';
import { getWeatherCodeInfo } from '@/constants/weatherCodes';
import { isNightTime } from '@/utils/timeFormatter';

interface WeatherIconProps {
  weatherCode: number;
  size?: number;
  className?: string;
  sunrise?: string;
  sunset?: string;
  time?: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
};

export function WeatherIcon({ weatherCode, size = 24, className = '', sunrise, sunset, time }: WeatherIconProps) {
  const isNight = sunrise && sunset ? isNightTime(sunrise, sunset, time) : false;
  const info = getWeatherCodeInfo(weatherCode, isNight);
  const IconComponent = iconMap[info.icon] || Cloud;

  return <IconComponent size={size} className={className} aria-hidden="true" />;
}