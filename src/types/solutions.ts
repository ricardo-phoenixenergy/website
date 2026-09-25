export type SolutionVertical =
  | 'ci-solar-storage'
  | 'wheeling'
  | 'energy-optimisation'
  | 'carbon-credits'
  | 'webuysolar'
  | 'ev-fleets';

export interface SolutionMeta {
  label: string;
  /** Fills, bars, dots, and text on dark surfaces. Mirrors --color-accent-*. */
  accent: string;
  /** Text on a solid accent fill (badges, active pills, step circles). Mirrors --color-accent-*-on. */
  accentText: string;
  /** The accent as text on light surfaces (4.8:1 or more on #F5F5F5). Mirrors --color-accent-*-ink. */
  accentInk: string;
  slug: string;
}

export const SOLUTION_META: Record<SolutionVertical, SolutionMeta> = {
  'ci-solar-storage': {
    label: 'C&I Solar & Storage',
    accent: '#E3C58D',
    accentText: '#5E430C',
    accentInk: '#8A6516',
    slug: '/solutions/ci-solar-storage',
  },
  'wheeling': {
    label: 'Wheeling',
    accent: '#D97C76',
    accentText: '#4A1E1B',
    accentInk: '#A8453E',
    slug: '/solutions/wheeling',
  },
  'energy-optimisation': {
    label: 'Energy Optimisation',
    accent: '#709DA9',
    accentText: '#0F2E36',
    accentInk: '#45727E',
    slug: '/solutions/energy-optimisation',
  },
  'carbon-credits': {
    label: 'Carbon Credits',
    accent: '#9CAF88',
    accentText: '#223D12',
    accentInk: '#56733F',
    slug: '/solutions/carbon-credits',
  },
  'webuysolar': {
    label: 'WeBuySolar',
    accent: '#C97A40',
    accentText: '#3A1C08',
    accentInk: '#9A5420',
    slug: '/solutions/webuysolar',
  },
  'ev-fleets': {
    label: 'EV Fleets & Infrastructure',
    accent: '#A9D6CB',
    accentText: '#1A5A48',
    accentInk: '#2F7565',
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

const INK_BY_ACCENT: Record<string, string> = Object.fromEntries(
  Object.values(SOLUTION_META).map((m) => [m.accent.toLowerCase(), m.accentInk]),
);

/**
 * The text-safe ink for an accent on a light surface. Components that receive a
 * raw accent colour use this for any text they draw on white or #F5F5F5. Colours
 * that are not vertical accents (Deep Teal, already dark) come back unchanged.
 */
export function inkFor(accent: string): string {
  return INK_BY_ACCENT[accent.toLowerCase()] ?? accent;
}
