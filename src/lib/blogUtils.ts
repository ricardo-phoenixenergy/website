// src/lib/blogUtils.ts
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionMeta, SolutionVertical } from '@/types/solutions';

export const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  'Industry Insights':  { bg: '#39575C', color: '#FFFFFF' },
  'Project Spotlight':  { bg: '#B8923A', color: '#FFFFFF' },
  'Company News':       { bg: '#2E7D6B', color: '#FFFFFF' },
  'Press Release':      { bg: '#B85450', color: '#FFFFFF' },
};

export function categoryStyle(cat: string): { bg: string; color: string } {
  return CATEGORY_STYLES[cat] ?? { bg: '#39575C', color: '#FFFFFF' };
}

const TAG_VERTICAL_MAP: Record<string, SolutionVertical> = {
  'Solar & Storage':      'ci-solar-storage',
  'Wheeling':             'wheeling',
  'Energy Optimisation':  'energy-optimisation',
  'Carbon Credits':       'carbon-credits',
  'WeBuySolar':           'webuysolar',
  'EV Fleets':            'ev-fleets',
};

export function tagMeta(tag: string): SolutionMeta | null {
  const vertical = TAG_VERTICAL_MAP[tag];
  return vertical ? SOLUTION_META[vertical] : null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
