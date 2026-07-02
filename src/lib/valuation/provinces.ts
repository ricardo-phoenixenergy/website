// src/lib/valuation/provinces.ts
import type { Province } from './types';

/** All nine South African provinces, in alphabetical order by label. */
export const PROVINCE_LABELS: Record<Province, string> = {
  ec: 'Eastern Cape',
  fs: 'Free State',
  gp: 'Gauteng',
  kzn: 'KwaZulu-Natal',
  lp: 'Limpopo',
  mp: 'Mpumalanga',
  nw: 'North West',
  nc: 'Northern Cape',
  wc: 'Western Cape',
};

export const PROVINCE_OPTIONS: { value: Province; label: string }[] = (
  Object.keys(PROVINCE_LABELS) as Province[]
)
  .map((value) => ({ value, label: PROVINCE_LABELS[value] }))
  .sort((a, b) => a.label.localeCompare(b.label));
