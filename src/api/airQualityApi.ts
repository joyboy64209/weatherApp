import { airQualityClient } from './client';

export interface AirQualityApiResponse {
  current: {
    european_aqi?: number;
    pm2_5?: number;
    pm10?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    sulphur_dioxide?: number;
    ozone?: number;
    time?: string;
  };
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
): Promise<AirQualityApiResponse['current']> {
  const response = await airQualityClient.get<AirQualityApiResponse>('/air-quality', {
    params: {
      latitude,
      longitude,
      current: [
        'european_aqi',
        'pm2_5',
        'pm10',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone',
      ].join(','),
    },
  });
  return response.data.current;
}