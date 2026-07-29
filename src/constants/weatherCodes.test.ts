import { describe, it, expect } from 'vitest';
import { getWeatherCodeInfo, NIGHT_GRADIENT } from './weatherCodes';

describe('getWeatherCodeInfo', () => {
  it('returns clear sky info for code 0', () => {
    const info = getWeatherCodeInfo(0);
    expect(info.condition).toBe('clear');
    expect(info.description).toBe('Clear sky');
    expect(info.icon).toBe('Sun');
  });

  it('returns thunderstorm info for code 95', () => {
    const info = getWeatherCodeInfo(95);
    expect(info.condition).toBe('thunderstorm');
    expect(info.icon).toBe('CloudLightning');
  });

  it('returns night gradient for clear code at night', () => {
    const info = getWeatherCodeInfo(0, true);
    expect(info.gradient).toEqual(NIGHT_GRADIENT);
    expect(info.icon).toBe('Moon');
  });

  it('returns unknown info for unrecognized code', () => {
    const info = getWeatherCodeInfo(999);
    expect(info.condition).toBe('unknown');
    expect(info.description).toBe('Unknown');
  });

  it('returns default gradient for unknown code', () => {
    const info = getWeatherCodeInfo(999);
    expect(info.gradient.from).toBe('#6B7B8D');
    expect(info.gradient.to).toBe('#8FA0B2');
  });

  it('returns night gradient for unknown code at night', () => {
    const info = getWeatherCodeInfo(999, true);
    expect(info.gradient).toEqual(NIGHT_GRADIENT);
  });

  it('does not change non-clear codes at night', () => {
    const dayInfo = getWeatherCodeInfo(61);
    const nightInfo = getWeatherCodeInfo(61, true);
    expect(dayInfo.icon).toBe(nightInfo.icon);
    expect(dayInfo.gradient).toEqual(nightInfo.gradient);
  });
});