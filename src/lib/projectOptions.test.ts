import { describe, expect, it } from 'vitest';
import { EQUIPMENT_COMPONENTS, FINANCING_METHODS, equipmentLabel, financingLabel } from './projectOptions';

describe('the Financing and Equipment lists', () => {
  it("hold the spec's options, in order", () => {
    expect(FINANCING_METHODS.map((method) => method.title)).toEqual([
      'Outright Purchase',
      'Power Purchase Agreement (PPA)',
      'Power Lease Agreement (PLA)',
      'Energy efficiency asset lease',
      'Other',
    ]);
    expect(EQUIPMENT_COMPONENTS.map((component) => component.title)).toEqual([
      'Solar panels',
      'Inverter',
      'Battery',
      'Mounting',
      'Monitoring',
      'EV charger',
      'Motor',
      'Variable speed drive',
      'Other',
    ]);
  });

  it('give the words for a stored value, and null for anything the list does not hold', () => {
    expect(financingLabel('ppa')).toBe('Power Purchase Agreement (PPA)');
    expect(equipmentLabel('variable-speed-drive')).toBe('Variable speed drive');
    expect(financingLabel('lease-to-own')).toBeNull();
    expect(equipmentLabel(null)).toBeNull();
    expect(financingLabel(undefined)).toBeNull();
  });
});
