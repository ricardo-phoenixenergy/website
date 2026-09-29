import { describe, expect, it } from 'vitest';
import { projectFacts, splitMainRows, type FactsSource } from './projectFacts';
import type { SolutionVertical } from '@/types/solutions';

const base: FactsSource = {
  vertical: 'ci-solar-storage',
  location: 'Cape Town',
  status: 'completed',
  completionDate: 'Q2 2026',
  metrics: [
    { label: 'Solar PV Capacity', value: '82.8 kWp' },
    { label: 'Battery Energy Storage Capacity', value: '80 kWh' },
    { label: 'Hybrid Inverter Capacity', value: '90 kW' },
    { label: 'Deal Structure', value: 'Outright Purchase' },
  ],
};

describe('projectFacts', () => {
  it('lists the Project rows, then the System rows in their order', () => {
    const groups = projectFacts(base);
    expect(groups.map((g) => g.title)).toEqual(['Project', 'System']);
    expect(groups[0].rows).toEqual([
      { key: 'location', label: 'Location', value: 'Cape Town' },
      { key: 'service', label: 'Service', value: 'C&I Solar & Storage', href: '/solutions/ci-solar-storage' },
      { key: 'status', label: 'Status', value: 'Completed Q2 2026' },
    ]);
    expect(groups[1].rows.map((r) => r.label)).toEqual(['Solar PV Capacity', 'Battery Energy Storage Capacity', 'Hybrid Inverter Capacity', 'Deal Structure']);
  });

  it('shows a row only when it is set, and a group only when it has a row', () => {
    expect(projectFacts({ vertical: 'wheeling', location: null, status: null, completionDate: null, metrics: [{ label: 'Solar PV', value: ' ' }] })).toEqual([
      { key: 'project', title: 'Project', rows: [{ key: 'service', label: 'Service', value: 'Wheeling', href: '/solutions/wheeling' }] },
    ]);
  });

  it('drops the Service row for an unknown service rather than failing', () => {
    const groups = projectFacts({ ...base, vertical: 'unknown' as SolutionVertical, metrics: [] });
    expect(groups[0].rows.map((r) => r.key)).toEqual(['location', 'status']);
  });
});

describe('splitMainRows', () => {
  it('opens Location and the first two System rows on phones, and keeps the rest in their groups', () => {
    const { main, rest } = splitMainRows(projectFacts(base));
    expect(main.map((r) => r.label)).toEqual(['Location', 'Solar PV Capacity', 'Battery Energy Storage Capacity']);
    expect(rest.map((g) => [g.title, g.rows.map((r) => r.label)])).toEqual([
      ['Project', ['Service', 'Status']],
      ['System', ['Hybrid Inverter Capacity', 'Deal Structure']],
    ]);
  });

  it('opens the location alone when there are no System rows', () => {
    const { main, rest } = splitMainRows(projectFacts({ ...base, metrics: [] }));
    expect(main.map((r) => r.key)).toEqual(['location']);
    expect(rest.map((g) => g.key)).toEqual(['project']);
  });
});
