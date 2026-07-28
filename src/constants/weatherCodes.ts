import { WeatherCodeInfo } from '@/types/weather';

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    condition: 'clear',
    description: 'Clear sky',
    icon: 'Sun',
    gradient: { from: '#4A90D9', to: '#87CEEB' },
  },
  1: {
    code: 1,
    condition: 'partlyCloudy',
    description: 'Mainly clear',
    icon: 'Sun',
    gradient: { from: '#4A90D9', to: '#87CEEB' },
  },
  2: {
    code: 2,
    condition: 'partlyCloudy',
    description: 'Partly cloudy',
    icon: 'CloudSun',
    gradient: { from: '#5B7B9A', to: '#8FA8C8' },
  },
  3: {
    code: 3,
    condition: 'overcast',
    description: 'Overcast',
    icon: 'Cloud',
    gradient: { from: '#6B7B8D', to: '#8FA0B2' },
  },
  45: {
    code: 45,
    condition: 'fog',
    description: 'Foggy',
    icon: 'CloudFog',
    gradient: { from: '#7A8A9A', to: '#A0B0C0' },
  },
  48: {
    code: 48,
    condition: 'fog',
    description: 'Depositing rime fog',
    icon: 'CloudFog',
    gradient: { from: '#7A8A9A', to: '#A0B0C0' },
  },
  51: {
    code: 51,
    condition: 'drizzle',
    description: 'Light drizzle',
    icon: 'CloudDrizzle',
    gradient: { from: '#4A6B8A', to: '#6B8BAA' },
  },
  53: {
    code: 53,
    condition: 'drizzle',
    description: 'Moderate drizzle',
    icon: 'CloudDrizzle',
    gradient: { from: '#3A5B7A', to: '#5B7B9A' },
  },
  55: {
    code: 55,
    condition: 'drizzle',
    description: 'Dense drizzle',
    icon: 'CloudDrizzle',
    gradient: { from: '#2A4B6A', to: '#4B6B8A' },
  },
  56: {
    code: 56,
    condition: 'sleet',
    description: 'Light freezing drizzle',
    icon: 'CloudSnow',
    gradient: { from: '#5A7A9A', to: '#7A9ABA' },
  },
  57: {
    code: 57,
    condition: 'sleet',
    description: 'Dense freezing drizzle',
    icon: 'CloudSnow',
    gradient: { from: '#4A6A8A', to: '#6A8AAA' },
  },
  61: {
    code: 61,
    condition: 'rain',
    description: 'Slight rain',
    icon: 'CloudRain',
    gradient: { from: '#2A4A6A', to: '#4A6A8A' },
  },
  63: {
    code: 63,
    condition: 'rain',
    description: 'Moderate rain',
    icon: 'CloudRain',
    gradient: { from: '#1A3A5A', to: '#3A5A7A' },
  },
  65: {
    code: 65,
    condition: 'heavyRain',
    description: 'Heavy rain',
    icon: 'CloudRainWind',
    gradient: { from: '#0A2A4A', to: '#2A4A6A' },
  },
  66: {
    code: 66,
    condition: 'sleet',
    description: 'Light freezing rain',
    icon: 'CloudSnow',
    gradient: { from: '#3A5A7A', to: '#5A7A9A' },
  },
  67: {
    code: 67,
    condition: 'sleet',
    description: 'Heavy freezing rain',
    icon: 'CloudSnow',
    gradient: { from: '#2A4A6A', to: '#4A6A8A' },
  },
  71: {
    code: 71,
    condition: 'snow',
    description: 'Slight snow',
    icon: 'CloudSnow',
    gradient: { from: '#8AA8C8', to: '#B0C8E0' },
  },
  73: {
    code: 73,
    condition: 'snow',
    description: 'Moderate snow',
    icon: 'CloudSnow',
    gradient: { from: '#7A9ABA', to: '#A0B8D0' },
  },
  75: {
    code: 75,
    condition: 'snow',
    description: 'Heavy snow',
    icon: 'CloudSnow',
    gradient: { from: '#6A8AAA', to: '#90A8C0' },
  },
  77: {
    code: 77,
    condition: 'snow',
    description: 'Snow grains',
    icon: 'CloudSnow',
    gradient: { from: '#8AA8C8', to: '#B0C8E0' },
  },
  80: {
    code: 80,
    condition: 'rain',
    description: 'Slight rain showers',
    icon: 'CloudRain',
    gradient: { from: '#3A5B7A', to: '#5B7B9A' },
  },
  81: {
    code: 81,
    condition: 'rain',
    description: 'Moderate rain showers',
    icon: 'CloudRain',
    gradient: { from: '#2A4B6A', to: '#4B6B8A' },
  },
  82: {
    code: 82,
    condition: 'heavyRain',
    description: 'Violent rain showers',
    icon: 'CloudRainWind',
    gradient: { from: '#1A3B5A', to: '#3B5B7A' },
  },
  85: {
    code: 85,
    condition: 'snow',
    description: 'Slight snow showers',
    icon: 'CloudSnow',
    gradient: { from: '#7A9ABA', to: '#A0B8D0' },
  },
  86: {
    code: 86,
    condition: 'snow',
    description: 'Heavy snow showers',
    icon: 'CloudSnow',
    gradient: { from: '#6A8AAA', to: '#90A8C0' },
  },
  95: {
    code: 95,
    condition: 'thunderstorm',
    description: 'Thunderstorm',
    icon: 'CloudLightning',
    gradient: { from: '#1A1A3A', to: '#3A3A5A' },
  },
  96: {
    code: 96,
    condition: 'thunderstorm',
    description: 'Thunderstorm with slight hail',
    icon: 'CloudLightning',
    gradient: { from: '#1A1A3A', to: '#3A3A5A' },
  },
  99: {
    code: 99,
    condition: 'thunderstorm',
    description: 'Thunderstorm with heavy hail',
    icon: 'CloudLightning',
    gradient: { from: '#0A0A2A', to: '#2A2A4A' },
  },
};

export const NIGHT_GRADIENT = { from: '#0F172A', to: '#1E293B' };

export function getWeatherCodeInfo(code: number, isNight: boolean = false): WeatherCodeInfo {
  const info = WEATHER_CODES[code];
  if (!info) {
    return {
      code,
      condition: 'unknown',
      description: 'Unknown',
      icon: 'Cloud',
      gradient: isNight ? NIGHT_GRADIENT : { from: '#6B7B8D', to: '#8FA0B2' },
    };
  }
  if (isNight && (code === 0 || code === 1)) {
    return {
      ...info,
      gradient: NIGHT_GRADIENT,
      icon: 'Moon',
    };
  }
  return info;
}