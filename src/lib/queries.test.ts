// The GROQ in queries.ts, evaluated with groq-js against a small dataset, so
// these tests check what each query returns rather than how it is spelled.
import { describe, expect, it } from 'vitest';
import { evaluate, parse } from 'groq-js';
import * as queries from './queries';
import { orderForProjectsPage } from './projectOrder';

type Doc = Record<string, unknown>;
type Row = Record<string, unknown>;

async function run(query: string, dataset: readonly Doc[], params: Record<string, unknown> = {}): Promise<unknown> {
  // Params are also given to parse(), so slices such as [$offset...$offset+6] fold to numbers.
  const value = await evaluate(parse(query, { params }), { dataset, params });
  return value.get();
}

const ids = (rows: unknown) => (rows as Row[]).map((row) => row._id);

// An asset document as Sanity stores it: its file name and metadata may name the
// client or say where the photo was taken, so no query may return them.
const ASSET: Doc = {
  _id: 'image-abc123-4000x2250-jpg',
  _type: 'sanity.imageAsset',
  url: 'https://cdn.sanity.io/images/p/production/abc123-4000x2250.jpg',
  originalFilename: 'HIDDEN-CLIENT-roof.jpg',
  path: 'images/p/production/abc123-4000x2250.jpg',
  sha1hash: 'deadbeef',
  metadata: { lqip: 'data:image/jpeg;base64,x', dimensions: { width: 4000, height: 2250, aspectRatio: 1.78 }, exif: { Make: 'Canon' }, location: { lat: -33.9, lng: 18.4 } },
};
const image = (extra: Doc = {}): Doc => ({ _type: 'image', asset: { _type: 'reference', _ref: ASSET._id }, alt: 'A roof', ...extra });

const project = (id: string, extra: Doc = {}): Doc => ({
  _id: id,
  _type: 'project',
  _createdAt: '2026-01-01T08:00:00Z',
  _updatedAt: '2026-09-01T08:00:00Z',
  title: `Project ${id}`,
  slug: { current: id },
  vertical: 'ci-solar-storage',
  location: 'Cape Town',
  clientName: 'Hidden Client Ltd',
  projectValue: 'R42M',
  clientConsentOn: null,
  systemSize: '82 kWp',
  status: 'completed',
  heroImage: image(),
  gallery: [image({ caption: 'The plant room' })],
  metrics: [{ _key: 'm', label: 'Solar PV', value: '82.8 kWp' }],
  results: [{ _key: 'r', label: 'Payback period', value: '51 months', note: 'Year 1' }],
  ...extra,
});

describe('project queries: the consent switches', () => {
  const dataset = [
    ASSET,
    project('off'),
    project('named', { showClientName: true, clientConsentOn: '2026-09-01' }),
    project('switch-only', { showClientName: true }),
    project('date-only', { clientConsentOn: '2026-09-01' }),
    project('rands', { showRandAmounts: true }),
  ];
  const byId = (rows: unknown, id: string) => (rows as Row[]).find((row) => row._id === id);

  it.each(['ALL_PROJECTS_QUERY', 'FEATURED_PROJECTS_QUERY', 'PROJECTS_BY_VERTICAL_QUERY'] as const)(
    '%s names the client only with "Show client name" on and a consent date set',
    async (name) => {
      const withFeatured = dataset.map((doc) => (doc._type === 'project' ? { ...doc, featured: true } : doc));
      const rows = await run(queries[name], withFeatured, { vertical: 'ci-solar-storage' });
      expect(byId(rows, 'named')?.clientName).toBe('Hidden Client Ltd');
      for (const id of ['off', 'switch-only', 'date-only', 'rands']) {
        expect(byId(rows, id), id).not.toHaveProperty('clientName');
      }
    },
  );

  it('never returns the project value, the consent date or a retired field to a card', async () => {
    const json = JSON.stringify(await run(queries.ALL_PROJECTS_QUERY, dataset));
    for (const text of ['projectValue', 'R42M', 'clientConsentOn', 'showClientName', 'systemSize', 'caseStudyReady']) {
      expect(json).not.toContain(text);
    }
  });

  it('gives every card its "Show rand amounts" switch, false unless it is on', async () => {
    const rows = await run(queries.ALL_PROJECTS_QUERY, dataset);
    expect(byId(rows, 'rands')?.showRandAmounts).toBe(true);
    expect(byId(rows, 'off')?.showRandAmounts).toBe(false);
  });

  it('gives the page the project value only with "Show rand amounts" on', async () => {
    const off = (await run(queries.PROJECT_BY_SLUG_QUERY, dataset, { slug: 'off' })) as Row;
    const rands = (await run(queries.PROJECT_BY_SLUG_QUERY, dataset, { slug: 'rands' })) as Row;
    expect(off).not.toHaveProperty('projectValue');
    expect(off).not.toHaveProperty('clientName');
    expect(rands.projectValue).toBe('R42M');
  });

  it('names the client on the page and on the next project cards only with consent', async () => {
    const named = (await run(queries.PROJECT_BY_SLUG_QUERY, dataset, { slug: 'named' })) as Row;
    const off = (await run(queries.PROJECT_BY_SLUG_QUERY, dataset, { slug: 'off' })) as Row;
    expect(named.clientName).toBe('Hidden Client Ltd');
    expect(byId(off.related, 'named')?.clientName).toBe('Hidden Client Ltd');
    expect(byId(named.related, 'off')).not.toHaveProperty('clientName');
  });
});

describe('project queries: the page fields', () => {
  it('returns every step 2 field, and the gallery captions', async () => {
    const full = project('full', {
      headline: 'Rooftop solar and a battery for a Cape Town logistics warehouse',
      siteType: 'Logistics warehouse',
      commissionedOn: '2026-06-12',
      completionDate: 'Q2 2026',
      financing: ['outright-purchase'],
      challengeHeadline: 'Peak tariffs landed on the busiest hours',
      solutionHeadline: 'A battery that covers the peak',
      outcomeHeadline: 'Lower bills from month one',
      resultsInputs: [{ _key: 'i', label: 'Tariff escalation', value: '8% a year' }],
      equipment: [{ _key: 'e', component: 'inverter', brand: 'Sunsynk', model: '50K', quantity: 2, internalNote: 'x' }],
      installationWeeks: 6,
      approvals: ['Municipal SSEG approval'],
      seoDescription: 'A search description.',
    });
    const page = (await run(queries.PROJECT_BY_SLUG_QUERY, [ASSET, full], { slug: 'full' })) as Row;
    expect(page).toMatchObject({
      headline: 'Rooftop solar and a battery for a Cape Town logistics warehouse',
      siteType: 'Logistics warehouse',
      commissionedOn: '2026-06-12',
      financing: ['outright-purchase'],
      challengeHeadline: 'Peak tariffs landed on the busiest hours',
      solutionHeadline: 'A battery that covers the peak',
      outcomeHeadline: 'Lower bills from month one',
      resultsInputs: [{ label: 'Tariff escalation', value: '8% a year' }],
      equipment: [{ component: 'inverter', brand: 'Sunsynk', model: '50K', quantity: 2 }],
      installationWeeks: 6,
      approvals: ['Municipal SSEG approval'],
      seoDescription: 'A search description.',
      results: [{ label: 'Payback period', value: '51 months', note: 'Year 1' }],
    });
    expect((page.gallery as Row[])[0]).toMatchObject({ alt: 'A roof', caption: 'The plant room' });
    expect(JSON.stringify(page)).not.toContain('internalNote');
  });
});

describe('project queries: newest first', () => {
  // "Newest" is the commissioning date, else the date the project was added.
  const dataset = [
    ASSET,
    project('added-june', { _createdAt: '2026-06-20T08:00:00Z' }),
    project('commissioned-2025', { _createdAt: '2026-08-01T08:00:00Z', commissionedOn: '2025-11-30' }),
    project('commissioned-july', { _createdAt: '2026-02-01T08:00:00Z', commissionedOn: '2026-07-01' }),
    project('unreadable-date', { _createdAt: '2026-03-01T08:00:00Z', commissionedOn: '12 June 2026' }),
    project('added-january', { _createdAt: '2026-01-10T08:00:00Z', completionDate: 'Q3 2027' }),
  ];
  const expected = ['commissioned-july', 'added-june', 'unreadable-date', 'added-january', 'commissioned-2025'];

  it('orders /projects and the solution pages by the commissioning date, else the date added, never the free text', async () => {
    expect(ids(await run(queries.ALL_PROJECTS_QUERY, dataset))).toEqual(expected);
    expect(ids(await run(queries.PROJECTS_BY_VERTICAL_QUERY, dataset, { vertical: 'ci-solar-storage' }))).toEqual(expected);
  });

  it('orders the next project section the same way', async () => {
    const page = (await run(queries.PROJECT_BY_SLUG_QUERY, [...dataset, project('other', { vertical: 'wheeling' })], { slug: 'added-june' })) as Row;
    expect(ids(page.related)).toEqual(['commissioned-july', 'unreadable-date', 'added-january']);
    expect(ids(page.otherProjects)).toEqual(['other']);
  });

  it('shows a solution page its six newest projects', async () => {
    const many = [ASSET, ...Array.from({ length: 8 }, (_, i) => project(`p${i}`, { _createdAt: `2026-0${i + 1}-01T08:00:00Z` }))];
    expect(ids(await run(queries.PROJECTS_BY_VERTICAL_QUERY, many, { vertical: 'ci-solar-storage' }))).toEqual(['p7', 'p6', 'p5', 'p4', 'p3', 'p2']);
  });
});

describe('the featured order', () => {
  const dataset = [
    ASSET,
    project('n150', { featured: true, featuredOrder: 150 }),
    project('unnumbered-new', { featured: true, _createdAt: '2026-09-01T08:00:00Z' }),
    project('n1', { featured: true, featuredOrder: 1 }),
    project('unnumbered-old', { featured: true, featuredOrder: null, _createdAt: '2026-02-01T08:00:00Z' }),
    project('n99', { featured: true, featuredOrder: 99 }),
    project('not-featured', { featured: false }),
  ];

  it('puts numbered projects first, lowest first, then unnumbered ones newest first, on home', async () => {
    expect(ids(await run(queries.FEATURED_PROJECTS_QUERY, dataset))).toEqual(['n1', 'n99', 'n150', 'unnumbered-new', 'unnumbered-old']);
  });

  it('matches the order /projects gives its featured projects', async () => {
    const home = ids(await run(queries.FEATURED_PROJECTS_QUERY, dataset));
    const all = (await run(queries.ALL_PROJECTS_QUERY, dataset)) as Array<{ _id: string; featured?: boolean | null; featuredOrder?: number | null }>;
    const projectsPage = orderForProjectsPage(all).filter((row) => row.featured).map((row) => row._id);
    expect(projectsPage).toEqual(home);
  });
});

describe('slugs and sitemap entries', () => {
  it('list every project with a slug', async () => {
    const dataset = [ASSET, project('a'), { _id: 'no-slug', _type: 'project', title: 'Draft' }];
    expect(await run(queries.ALL_PROJECT_SLUGS_QUERY, dataset)).toEqual(['a']);
    expect(await run(queries.PROJECT_SITEMAP_QUERY, dataset)).toEqual([{ slug: 'a', _updatedAt: '2026-09-01T08:00:00Z' }]);
  });
});

describe('every query', () => {
  // One of each document the queries read, every image pointing at ASSET.
  const dataset: Doc[] = [
    ASSET,
    { _id: 'author-a', _type: 'author', name: 'An Author', slug: { current: 'an-author' }, photo: image() },
    {
      _id: 'post-a',
      _type: 'blogPost',
      title: 'A post',
      slug: { current: 'a' },
      category: 'Company News',
      tags: ['Wheeling'],
      excerpt: 'An excerpt',
      publishedAt: '2026-01-01T08:00:00Z',
      featured: false,
      author: { _type: 'reference', _ref: 'author-a' },
      heroImage: image(),
      ogImage: image(),
      body: [{ _type: 'image', _key: 'b', asset: { _type: 'reference', _ref: ASSET._id } }],
    },
    { _id: 'member-a', _type: 'teamMember', name: 'A Member', slug: { current: 'a-member' }, photo: image(), role: 'Engineer', category: 'founders', order: 1, active: true },
    { _id: 'milestone-a', _type: 'milestoneTimeline', date: '2020', title: 'Founded', isFuture: false, order: 1, active: true },
    { _id: 'companyStats', _type: 'companyStats', stats: [{ value: '40+', label: 'Projects' }] },
    { _id: 'partner-a', _type: 'partner', name: 'A Partner', category: 'partners', order: 1, active: true, logo: image() },
    { _id: 'howItWorks.home', _type: 'howItWorks', title: 'How', steps: [{ label: 'One', description: 'First' }], showCta: true },
    { _id: 'heroImages', _type: 'heroImages', ciSolarStorage: image(), wheeling: image() },
    { _id: 'energyPrices', _type: 'energyPrices', dieselPricePerL: 21.5 },
    project('a', { featured: true, showRandAmounts: false }),
  ];
  const params = { slug: 'a', vertical: 'ci-solar-storage', tag: 'Wheeling', category: '', q: '', offset: 0, id: 'howItWorks.home' };

  // Every export in queries.ts is a GROQ string. (Each export's inferred type is
  // its own string literal, not `string`, so a type predicate can't narrow to
  // [string, string]; the cast below just widens it back.)
  const ALL_QUERIES = Object.entries(queries).filter((entry) => typeof entry[1] === 'string') as [string, string][];

  it('covers all 25 queries', () => {
    expect(ALL_QUERIES).toHaveLength(25);
  });

  it.each(ALL_QUERIES)('%s returns no asset file name or metadata, and no withheld project field', async (_name, query) => {
    const json = JSON.stringify(await run(query, dataset, params));
    for (const text of ['originalFilename', 'HIDDEN-CLIENT', 'sha1hash', 'deadbeef', 'exif', '"path"', 'Hidden Client Ltd', 'R42M']) {
      expect(json).not.toContain(text);
    }
  });

  it('keeps no case-study rule or unused project query', () => {
    expect('CASE_STUDY_READY' in queries).toBe(false);
    expect('FLAGSHIP_BY_VERTICAL_QUERY' in queries).toBe(false);
  });
});
