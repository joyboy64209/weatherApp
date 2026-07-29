import axios, { AxiosError, AxiosInstance } from 'axios';

const API_TIMEOUT = 10000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as { _retryCount?: number } | undefined;
      if (!config) {
        return Promise.reject(error);
      }

      const retryCount = (config._retryCount || 0) + 1;

      if (retryCount <= MAX_RETRIES && !isClientError(error)) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * retryCount));
        return client(config as never);
      }

      return Promise.reject(transformError(error));
    },
  );

  return client;
}

function isClientError(error: AxiosError): boolean {
  return error.response ? error.response.status >= 400 && error.response.status < 500 : false;
}

function transformError(error: AxiosError): Error {
  if (error.code === 'ECONNABORTED') {
    return new Error('Request timed out. Please check your connection and try again.');
  }
  if (!error.response) {
    return new Error('Network error. Please check your internet connection.');
  }
  const status = error.response.status;
  if (status === 429) {
    return new Error('Too many requests. Please wait a moment and try again.');
  }
  if (status >= 500) {
    return new Error('Weather service is temporarily unavailable. Please try again later.');
  }
  return new Error('An unexpected error occurred. Please try again.');
}

export const weatherClient = createClient('https://api.open-meteo.com/v1');
export const geocodingClient = createClient('https://geocoding-api.open-meteo.com/v1');
export const airQualityClient = createClient('https://air-quality-api.open-meteo.com/v1');