import { describe, it, expect } from 'vitest';
import { kmhToMph, mphToKmh, formatWindSpeed, getWindDirection } from './windSpeed';

describe('kmhToMph', () => {
  it('converts 0 km/h to 0 mph', () => {
    expect(kmhToMph(0)).toBe(0);
  });

  it('converts 100 km/h to 62 mph', () => {
    expect(kmhToMph(100)).toBe(62);
  });

  it('converts 10 km/h to 6 mph', () => {
    expect(kmhToMph(10)).toBe(6);
  });
});

describe('mphToKmh', () => {
  it('converts 0 mph to 0 km/h', () => {
    expect(mphToKmh(0)).toBe(0);
  });

  it('converts 62 mph to 100 km/h', () => {
    expect(mphToKmh(62)).toBe(100);
  });
});

describe('formatWindSpeed', () => {
  it('formats in km/h', () => {
    expect(formatWindSpeed(25, 'kmh')).toBe('25 km/h');
  });

  it('formats in mph', () => {
    expect(formatWindSpeed(25, 'mph')).toBe('16 mph');
  });
});

describe('getWindDirection', () => {
  it('returns N for 0 degrees', () => {
    expect(getWindDirection(0)).toBe('N');
  });

  it('returns E for 90 degrees', () => {
    expect(getWindDirection(90)).toBe('E');
  });

  it('returns S for 180 degrees', () => {
    expect(getWindDirection(180)).toBe('S');
  });

  it('returns W for 270 degrees', () => {
    expect(getWindDirection(270)).toBe('W');
  });

  it('returns NE for 45 degrees', () => {
    expect(getWindDirection(45)).toBe('NE');
  });
});