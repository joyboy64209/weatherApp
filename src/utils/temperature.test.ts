import { describe, it, expect } from 'vitest';
import { celsiusToFahrenheit, fahrenheitToCelsius, formatTemperature, formatTemperatureShort } from './temperature';

describe('celsiusToFahrenheit', () => {
  it('converts 0°C to 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it('converts 100°C to 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it('converts -40°C to -40°F', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it('rounds to nearest integer', () => {
    expect(celsiusToFahrenheit(22.5)).toBe(73);
  });
});

describe('fahrenheitToCelsius', () => {
  it('converts 32°F to 0°C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
  });

  it('converts 212°F to 100°C', () => {
    expect(fahrenheitToCelsius(212)).toBe(100);
  });

  it('converts -40°F to -40°C', () => {
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });
});

describe('formatTemperature', () => {
  it('formats in Celsius', () => {
    expect(formatTemperature(25, 'celsius')).toBe('25°C');
  });

  it('formats in Fahrenheit', () => {
    expect(formatTemperature(25, 'fahrenheit')).toBe('77°F');
  });
});

describe('formatTemperatureShort', () => {
  it('formats short in Celsius', () => {
    expect(formatTemperatureShort(25, 'celsius')).toBe('25°');
  });

  it('formats short in Fahrenheit', () => {
    expect(formatTemperatureShort(25, 'fahrenheit')).toBe('77°');
  });
});