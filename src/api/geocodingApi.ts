import { geocodingClient } from './client';

export interface GeocodingApiResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface GeocodingApiResponse {
  results?: GeocodingApiResult[];
  generationtime_ms: number;
}

export async function searchCities(query: string): Promise<GeocodingApiResult[]> {
  const response = await geocodingClient.get<GeocodingApiResponse>('/search', {
    params: {
      name: query,
      count: 10,
      language: 'en',
      format: 'json',
    },
  });
  return response.data.results || [];
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeocodingApiResult | null> {
  const response = await geocodingClient.get<GeocodingApiResponse>('/search', {
    params: {
      name: `${latitude},${longitude}`,
      count: 1,
      language: 'en',
      format: 'json',
    },
  });
  return response.data.results?.[0] || null;
}