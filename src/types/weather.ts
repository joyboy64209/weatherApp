export interface CurrentWeather {
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  weatherCode: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  cloudCover: number;
  visibility: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  precipitationProbability: number[];
  weatherCode: number[];
}

export interface DailyForecast {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherMetric {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
}

export type WeatherCondition =
  | 'clear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavyRain'
  | 'snow'
  | 'sleet'
  | 'thunderstorm'
  | 'unknown';

export interface WeatherCodeInfo {
  code: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  gradient: {
    from: string;
    to: string;
  };
}