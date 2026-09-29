// src/lib/projectOptions.ts
// The fixed lists behind two project fields, shared by the Studio
// (sanity/schemaTypes/project.ts) and the site so their words match: how the
// client paid for the system (Financing) and each main component (Equipment).
// The CMS stores the values; the site shows the titles. It has no imports, so
// the Studio can load it by a relative path.

export const FINANCING_METHODS = [
  { title: 'Outright Purchase', value: 'outright-purchase' },
  { title: 'Power Purchase Agreement (PPA)', value: 'ppa' },
  { title: 'Power Lease Agreement (PLA)', value: 'pla' },
  { title: 'Energy efficiency asset lease', value: 'energy-efficiency-lease' },
  { title: 'Other', value: 'other' },
] as const;

export type FinancingMethod = (typeof FINANCING_METHODS)[number]['value'];

export const EQUIPMENT_COMPONENTS = [
  { title: 'Solar panels', value: 'solar-panels' },
  { title: 'Inverter', value: 'inverter' },
  { title: 'Battery', value: 'battery' },
  { title: 'Mounting', value: 'mounting' },
  { title: 'Monitoring', value: 'monitoring' },
  { title: 'EV charger', value: 'ev-charger' },
  { title: 'Motor', value: 'motor' },
  { title: 'Variable speed drive', value: 'variable-speed-drive' },
  { title: 'Other', value: 'other' },
] as const;

export type EquipmentComponent = (typeof EQUIPMENT_COMPONENTS)[number]['value'];

/** The Studio's words for a Financing value, or null for one the list doesn't hold. */
export function financingLabel(value: string | null | undefined): string | null {
  return FINANCING_METHODS.find((method) => method.value === value)?.title ?? null;
}

/** The Studio's words for an Equipment component, or null for one the list doesn't hold. */
export function equipmentLabel(value: string | null | undefined): string | null {
  return EQUIPMENT_COMPONENTS.find((component) => component.value === value)?.title ?? null;
}
