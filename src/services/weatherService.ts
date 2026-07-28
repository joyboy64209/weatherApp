import { fetchWeatherData } from '@/api/weatherApi';
import { fetchAirQuality } from '@/api/airQualityApi';
import { searchCities, reverseGeocode } from '@/api/geocodingApi';
import { WeatherData, CurrentWeather, HourlyForecast, DailyForecast } from '@/types/weather';
import { AirQualityData } from '@/types/airQuality';
import { GeocodingResult } from '@/types/geocoding';

export async function getWeatherData(
  latitude: number,
  longitude: number,
  cityName?: string,
  country?: string,
): Promise<WeatherData> {
  const [weatherResponse, geoResult] = await Promise.all([
    fetchWeatherData(latitude, longitude),
    !cityName ? reverseGeocode(latitude, longitude) : Promise.resolve(null),
  ]);

  const resolvedCityName = cityName || geoResult?.name || 'Unknown';
  const resolvedCountry = country || geoResult?.country || '';

  const current: CurrentWeather = {
    temperature: weatherResponse.current.temperature_2m,
    relativeHumidity: weatherResponse.current.relative_humidity_2m,
    apparentTemperature: weatherResponse.current.apparent_temperature,
    weatherCode: weatherResponse.current.weather_code,
    surfacePressure: weatherResponse.current.surface_pressure,
    windSpeed: weatherResponse.current.wind_speed_10m,
    windDirection: weatherResponse.current.wind_direction_10m,
    uvIndex: weatherResponse.current.uv_index,
    cloudCover: weatherResponse.current.cloud_cover,
    visibility: weatherResponse.current.visibility,
    time: weatherResponse.current.time,
  };

  const hourly: HourlyForecast = {
    time: weatherResponse.hourly.time,
    temperature: weatherResponse.hourly.temperature_2m,
    precipitationProbability: weatherResponse.hourly.precipitation_probability,
    weatherCode: weatherResponse.hourly.weather_code,
  };

  const daily: DailyForecast = {
    time: weatherResponse.daily.time,
    temperatureMax: weatherResponse.daily.temperature_2m_max,
    temperatureMin: weatherResponse.daily.temperature_2m_min,
    weatherCode: weatherResponse.daily.weather_code,
    sunrise: weatherResponse.daily.sunrise,
    sunset: weatherResponse.daily.sunset,
    precipitationProbabilityMax: weatherResponse.daily.precipitation_probability_max,
  };

  return {
    current,
    hourly,
    daily,
    cityName: resolvedCityName,
    country: resolvedCountry,
    latitude,
    longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function getAirQualityData(
  latitude: number,
  longitude: number,
): Promise<AirQualityData> {
  const airQuality = await fetchAirQuality(latitude, longitude);
  return {
    europeanAqi: airQuality.european_aqi ?? 0,
    pm2_5: airQuality.pm2_5 ?? 0,
    pm10: airQuality.pm10 ?? 0,
    carbonMonoxide: airQuality.carbon_monoxide ?? 0,
    nitrogenDioxide: airQuality.nitrogen_dioxide ?? 0,
    sulphurDioxide: airQuality.sulphur_dioxide ?? 0,
    ozone: airQuality.ozone ?? 0,
    time: airQuality.time ?? new Date().toISOString(),
  };
}

export async function searchCitiesService(query: string): Promise<GeocodingResult[]> {
  if (query.length < 2) return [];
  const results = await searchCities(query);
  return results.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    countryCode: r.country_code,
    admin1: r.admin1,
    admin2: r.admin2,
    timezone: r.timezone,
    population: r.population,
  }));
}

export async function getLocationFromCoords(
  latitude: number,
  longitude: number,
): Promise<{ name: string; country: string } | null> {
  const result = await reverseGeocode(latitude, longitude);
  if (!result) return null;
  return { name: result.name, country: result.country };
}