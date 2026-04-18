export type SolutionVertical =
  | 'ci-solar-storage'
  | 'wheeling'
  | 'energy-optimisation'
  | 'carbon-credits'
  | 'webuysolar'
  | 'ev-fleets';

export interface SolutionMeta {
  label: string;
  accent: string;
  accentText: string;
  slug: string;
}

export const SOLUTION_META: Record<SolutionVertical, SolutionMeta> = {
  'ci-solar-storage': {
    label: 'C&I Solar & Storage',
    accent: '#E3C58D',
    accentText: '#6b4e10',
    slug: '/solutions/ci-solar-storage',
  },
  'wheeling': {
    label: 'Wheeling',
    accent: '#D97C76',
    accentText: '#ffffff',
    slug: '/solutions/wheeling',
  },
  'energy-optimisation': {
    label: 'Energy Optimisation',
    accent: '#709DA9',
    accentText: '#ffffff',
    slug: '/solutions/energy-optimisation',
  },
  'carbon-credits': {
    label: 'Carbon Credits',
    accent: '#9CAF88',
    accentText: '#2a4a18',
    slug: '/solutions/carbon-credits',
  },
  'webuysolar': {
    label: 'WeBuySolar',
    accent: '#C97A40',
    accentText: '#ffffff',
    slug: '/solutions/webuysolar',
  },
  'ev-fleets': {
    label: 'EV Fleets & Infrastructure',
    accent: '#A9D6CB',
    accentText: '#1a5a48',
    slug: '/solutions/ev-fleets',
  },
};

/** Ordered list of verticals for consistent rendering */
export const SOLUTION_VERTICALS: SolutionVertical[] = [
  'ci-solar-storage',
  'wheeling',
  'energy-optimisation',
  'carbon-credits',
  'webuysolar',
  'ev-fleets',
];
