import { describe, expect, it } from 'vitest';
import { LOCATION_AREAS, LOCATION_AREA_LABEL, isLocationArea, locationPath } from './locationAreas';

describe('location areas', () => {
  it('lists the two areas with their names', () => {
    expect(LOCATION_AREAS).toEqual(['gauteng', 'pretoria-centurion']);
    expect(LOCATION_AREA_LABEL).toEqual({ gauteng: 'Gauteng', 'pretoria-centurion': 'Pretoria and Centurion' });
  });

  it('puts each page under the C&I solution', () => {
    expect(locationPath('gauteng')).toBe('/solutions/ci-solar-storage/gauteng');
    expect(locationPath('pretoria-centurion')).toBe('/solutions/ci-solar-storage/pretoria-centurion');
  });

  it('accepts only the exact slugs, so a mixed-case or unknown address is a 404', () => {
    expect(isLocationArea('gauteng')).toBe(true);
    expect(isLocationArea('Gauteng')).toBe(false);
    expect(isLocationArea('durban')).toBe(false);
    expect(isLocationArea('')).toBe(false);
  });
});
