export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

export function formatTemperature(
  tempCelsius: number,
  unit: 'celsius' | 'fahrenheit',
): string {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(tempCelsius)}°F`;
  }
  return `${Math.round(tempCelsius)}°C`;
}

export function formatTemperatureShort(
  tempCelsius: number,
  unit: 'celsius' | 'fahrenheit',
): string {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(tempCelsius)}°`;
  }
  return `${Math.round(tempCelsius)}°`;
}