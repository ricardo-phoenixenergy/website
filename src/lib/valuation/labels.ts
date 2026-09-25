// src/lib/valuation/labels.ts
// One wording for every answer in the Solar Asset Valuation tool: the form's
// options and the lead email read from here, so what the owner picks is exactly
// what the WeBuySolar team receives.
import type { SolarInputs, BessInputs, ConditionInputs } from './types';

export const INVERTER_TYPE_LABEL: Record<SolarInputs['inverterType'], string> = {
  string: 'Grid-tied / string',
  hybrid: 'Hybrid',
};

export const CHEMISTRY_LABEL: Record<BessInputs['chemistry'], string> = {
  lfp: 'LFP / LiFePO₄',
  nmc: 'Li-NMC',
  lead: 'Lead-acid',
};

export const SOH_LABEL: Record<BessInputs['soh'], string> = {
  high: '90% or more (like new)',
  mid: '70 to 90% (good)',
  low: 'Below 70% (degraded)',
};

export const CONDITION_LABEL: Record<ConditionInputs['condition'], string> = {
  exc: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

export const MONITORING_LABEL = {
  yes: 'Yes, remote monitoring',
  no: 'No monitoring',
} as const;

export const DOCS_LABEL: Record<ConditionInputs['docs'], string> = {
  full: 'Full handover pack (COC, SLDs and handover documents)',
  coc: 'COC only',
  none: 'None / not sure',
};

/** Short labels for the segmented control, where space is tight. */
export const DOCS_SHORT_LABEL: Record<ConditionInputs['docs'], string> = {
  full: 'Full pack',
  coc: 'COC only',
  none: 'None / not sure',
};

export function optionsFrom<T extends string>(labels: Record<T, string>): { value: T; label: string }[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
