import { describe, expect, it } from 'vitest';
import { countWords, factColumnsClass, financingHref, projectFacts, splitMainRows, type FactsSource } from './projectFacts';
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

const full: FactsSource = {
  ...base,
  siteType: 'Logistics warehouse',
  clientName: 'Example Client',
  commissionedOn: '2026-06-12',
  financing: ['outright-purchase', 'ppa'],
  projectValue: 'R[x]M excl. VAT',
  equipment: [
    { component: 'solar-panels', brand: 'JA Solar', model: 'JAM72S30-550/MR', quantity: 150 },
    { component: 'inverter', brand: 'Sunsynk', model: '50K', quantity: 1 },
    { component: 'battery', brand: 'Pylontech' },
  ],
  installationWeeks: 6,
  approvals: ['Municipal SSEG approval', 'Certificate of Compliance'],
};

const labels = (source: FactsSource) => projectFacts(source).map((group) => [group.title, group.rows.map((row) => row.label)]);

describe('projectFacts', () => {
  it('lists the Project rows, then the System rows in their order', () => {
    const groups = projectFacts(base);
    expect(groups.map((g) => g.title)).toEqual(['Project', 'System']);
    expect(groups[0].rows).toEqual([
      { key: 'location', label: 'Location', lines: [{ text: 'Cape Town' }] },
      { key: 'service', label: 'Service', lines: [{ text: 'C&I Solar & Storage', href: '/solutions/ci-solar-storage' }] },
      { key: 'status', label: 'Status', lines: [{ text: 'Completed Q2 2026' }] },
    ]);
    expect(groups[1].rows.map((r) => r.label)).toEqual(['Solar PV Capacity', 'Battery Energy Storage Capacity', 'Hybrid Inverter Capacity', 'Deal Structure']);
  });

  it('adds every step 2 row in its group, in the order the spec gives', () => {
    expect(labels(full)).toEqual([
      ['Project', ['Site', 'Client', 'Location', 'Service', 'Status', 'Financing', 'Project value']],
      ['System', ['Solar PV Capacity', 'Battery Energy Storage Capacity', 'Hybrid Inverter Capacity', 'Deal Structure']],
      ['Equipment', ['Solar panels', 'Inverter', 'Battery']],
      ['Delivery', ['On site', 'Approvals']],
    ]);
  });

  it('words each value as the page shows it', () => {
    const [projectGroup, , equipment, delivery] = projectFacts(full);
    const row = (key: string) => projectGroup.rows.find((r) => r.key === key);
    expect(row('status')?.lines).toEqual([{ text: 'Completed June 2026' }]);
    expect(row('financing')?.lines).toEqual([
      { text: 'Outright Purchase', href: '/solutions/ci-solar-storage#financing' },
      { text: 'Power Purchase Agreement (PPA)', href: '/solutions/ci-solar-storage#financing' },
    ]);
    expect(equipment.rows.map((r) => r.lines[0].text)).toEqual(['JA Solar JAM72S30-550/MR, 150 units', 'Sunsynk 50K, 1 unit', 'Pylontech']);
    expect(delivery.rows).toEqual([
      { key: 'on-site', label: 'On site', lines: [{ text: '6 weeks' }] },
      { key: 'approvals', label: 'Approvals', lines: [{ text: 'Municipal SSEG approval' }, { text: 'Certificate of Compliance' }] },
    ]);
  });

  it('shows a row only when it is set, and a group only when it has a row', () => {
    expect(projectFacts({ vertical: 'wheeling', location: null, status: null, completionDate: null, metrics: [{ label: 'Solar PV', value: ' ' }] })).toEqual([
      { key: 'project', title: 'Project', rows: [{ key: 'service', label: 'Service', lines: [{ text: 'Wheeling', href: '/solutions/wheeling' }] }] },
    ]);
  });

  it('drops the Service row for an unknown service rather than failing', () => {
    const groups = projectFacts({ ...base, vertical: 'unknown' as SolutionVertical, metrics: [] });
    expect(groups[0].rows.map((r) => r.key)).toEqual(['location', 'status']);
  });

  it('leaves out values out of range or not in the lists, so no row reads "0 units" or stands empty', () => {
    const odd = {
      ...base,
      metrics: [],
      clientName: '  ',
      financing: ['lease-to-own', 'ppa', 'ppa'],
      equipment: [
        { component: 'inverter', brand: 'Sunsynk', quantity: 0 },
        { component: 'battery', brand: 'Pylontech', quantity: 1.5 },
        { component: 'flux-capacitor', brand: 'Acme', quantity: 2 },
        { component: 'mounting', brand: '  ', quantity: 4 },
      ],
      installationWeeks: 0,
      approvals: ['  ', 'Certificate of Compliance'],
    } as unknown as FactsSource;
    const groups = projectFacts(odd);
    expect(groups.map((g) => g.key)).toEqual(['project', 'equipment', 'delivery']);
    expect(groups[0].rows.find((r) => r.key === 'financing')?.lines.map((l) => l.text)).toEqual(['Power Purchase Agreement (PPA)']);
    expect(groups[0].rows.some((r) => r.key === 'client')).toBe(false);
    expect(groups[1].rows.map((r) => r.lines[0].text)).toEqual(['Sunsynk', 'Pylontech']);
    expect(groups[2].rows).toEqual([{ key: 'approvals', label: 'Approvals', lines: [{ text: 'Certificate of Compliance' }] }]);
    expect(projectFacts({ ...base, installationWeeks: 105 }).some((g) => g.key === 'delivery')).toBe(false);
  });

  it('falls back like an unset field, without throwing, when an API write or an import stores the wrong type', () => {
    const wrong = (fields: Record<string, unknown>) => projectFacts({ ...base, metrics: [], ...fields } as unknown as FactsSource);
    const keys = (fields: Record<string, unknown>) => wrong(fields).map((g) => g.key);
    // A string where the query expects a list: no Equipment or Delivery group.
    expect(keys({ equipment: 'Sunsynk 50K' })).toEqual(['project']);
    expect(keys({ approvals: 'Municipal SSEG approval' })).toEqual(['project']);
    // A brand given as a number gives no row for its component; a model given as a number, the brand alone.
    const equipment = wrong({ equipment: [{ component: 'inverter', brand: 50, model: '50K' }, { component: 'battery', brand: 'Pylontech', model: 5 }] });
    expect(equipment.find((g) => g.key === 'equipment')?.rows.map((r) => [r.label, r.lines[0].text])).toEqual([['Battery', 'Pylontech']]);
    // Financing as a string or a number: no Financing row.
    for (const financing of ['ppa', 5]) {
      expect(wrong({ financing })[0].rows.some((r) => r.key === 'financing'), String(financing)).toBe(false);
    }
  });
});

describe('financingHref', () => {
  it("links to the financing section of the services that have one, and to the service page otherwise", () => {
    expect(financingHref('ci-solar-storage')).toBe('/solutions/ci-solar-storage#financing');
    expect(financingHref('energy-optimisation')).toBe('/solutions/energy-optimisation#financing');
    expect(financingHref('ev-fleets')).toBe('/solutions/ev-fleets#financing');
    expect(financingHref('wheeling')).toBe('/solutions/wheeling');
    expect(financingHref('carbon-credits')).toBe('/solutions/carbon-credits');
    expect(financingHref('unknown' as SolutionVertical)).toBeUndefined();
  });
});

describe('countWords', () => {
  it('writes quantities as words, for reading aloud', () => {
    expect(countWords(1, 'unit', 'units')).toBe('1 unit');
    expect(countWords(3, 'unit', 'units')).toBe('3 units');
    expect(countWords(1, 'week', 'weeks')).toBe('1 week');
    expect(countWords(6, 'week', 'weeks')).toBe('6 weeks');
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

  it('opens the client when named, else the site, then Location, two System rows and Financing', () => {
    expect(splitMainRows(projectFacts(full)).main.map((r) => r.label)).toEqual(['Client', 'Location', 'Solar PV Capacity', 'Battery Energy Storage Capacity', 'Financing']);
    const unnamed = splitMainRows(projectFacts({ ...full, clientName: null }));
    expect(unnamed.main.map((r) => r.label)).toEqual(['Site', 'Location', 'Solar PV Capacity', 'Battery Energy Storage Capacity', 'Financing']);
    expect(splitMainRows(projectFacts(full)).rest.map((g) => [g.title, g.rows.map((r) => r.label)])).toEqual([
      ['Project', ['Site', 'Service', 'Status', 'Project value']],
      ['System', ['Hybrid Inverter Capacity', 'Deal Structure']],
      ['Equipment', ['Solar panels', 'Inverter', 'Battery']],
      ['Delivery', ['On site', 'Approvals']],
    ]);
  });

  it('opens the location alone when there are no System rows', () => {
    const { main, rest } = splitMainRows(projectFacts({ ...base, metrics: [] }));
    expect(main.map((r) => r.key)).toEqual(['location']);
    expect(rest.map((g) => g.key)).toEqual(['project']);
  });
});

describe('factColumnsClass', () => {
  it('gives each group its own column from 1024px, four sitting two by two until 1280px', () => {
    expect(factColumnsClass(1)).toBe('grid-cols-1 max-w-md');
    expect(factColumnsClass(2)).toBe('grid-cols-2');
    expect(factColumnsClass(3)).toBe('grid-cols-3');
    expect(factColumnsClass(4)).toBe('grid-cols-2 xl:grid-cols-4');
  });
});
