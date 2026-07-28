export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934);
}

export function formatWindSpeed(
  speedKmh: number,
  unit: 'kmh' | 'mph',
): string {
  if (unit === 'mph') {
    return `${kmhToMph(speedKmh)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}