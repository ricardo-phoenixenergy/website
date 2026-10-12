import { describe, expect, it } from 'vitest';
import { LOCATION_AREAS, LOCATION_AREA_LABEL, isLocationArea, locationPath } from './locationAreas';

describe('location areas', () => {
  it('lists Gauteng, the one area with a page, and its name', () => {
    expect(LOCATION_AREAS).toEqual(['gauteng']);
    expect(LOCATION_AREA_LABEL).toEqual({ gauteng: 'Gauteng' });
  });

  it('puts each page under the C&I solution', () => {
    expect(locationPath('gauteng')).toBe('/solutions/ci-solar-storage/gauteng');
  });

  it('accepts only the exact slugs, so a mixed-case or unknown address is a 404', () => {
    expect(isLocationArea('gauteng')).toBe(true);
    expect(isLocationArea('Gauteng')).toBe(false);
    expect(isLocationArea('durban')).toBe(false);
    expect(isLocationArea('pretoria-centurion')).toBe(false);
    expect(isLocationArea('')).toBe(false);
  });
});
