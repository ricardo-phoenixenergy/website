// The GROQ in queries.ts, evaluated with groq-js against a small dataset, so
// these tests check what each query returns rather than how it is spelled.
import { describe, expect, it } from 'vitest';
import { evaluate, parse } from 'groq-js';
import * as queries from './queries';
import { orderForProjectsPage } from './projectOrder';
import { BLOG_FILTER_THRESHOLD } from './blogUtils';

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
  systemSize: '82 kWp',
  status: 'completed',
  heroImage: image(),
  gallery: [image({ caption: 'The plant room' })],
  metrics: [{ _key: 'm', label: 'Solar PV', value: '82.8 kWp' }],
  results: [{ _key: 'r', label: 'Payback period', value: '51 months', note: 'Year 1' }],
  ...extra,
});

describe('project queries: the client name, and the fields that were removed', () => {
  // Documents written before October 2026 still hold the switches, the project
  // value, the free-text date and the results basis fields until they are
  // cleared. The queries return none of them, and the name whatever the old switch said.
  const OLD_FIELDS: Doc = {
    showClientName: false,
    clientConsentOn: '2026-09-01',
    showRandAmounts: false,
    projectValue: 'R42M',
    completionDate: 'Q3 2027',
    resultsBasis: 'measured',
    resultsAsOf: '2026-06-30',
    resultsAssumptions: 'Projected from our model.',
    resultsInputs: [{ _key: 'i', label: 'Tariff escalation', value: '8% a year' }],
  };
  const REMOVED = Object.keys(OLD_FIELDS);
  const dataset = [
    ASSET,
    project('old', { ...OLD_FIELDS, featured: true }),
    project('unnamed', { clientName: null, featured: true }),
    project('other-service', { ...OLD_FIELDS, vertical: 'wheeling', featured: true }),
  ];
  const byId = (rows: unknown, id: string) => (rows as Row[]).find((row) => row._id === id);

  it.each(['ALL_PROJECTS_QUERY', 'FEATURED_PROJECTS_QUERY', 'PROJECTS_BY_VERTICAL_QUERY'] as const)(
    '%s names the client whenever the name is set, and returns none of the removed fields',
    async (name) => {
      const rows = await run(queries[name], dataset, { vertical: 'ci-solar-storage' });
      expect(byId(rows, 'old')?.clientName).toBe('Hidden Client Ltd');
      expect(byId(rows, 'unnamed')?.clientName).toBeNull();
      for (const row of rows as Row[]) {
        for (const field of [...REMOVED, 'systemSize', 'caseStudyReady']) {
          expect(row, `${row._id}: ${field}`).not.toHaveProperty(field);
        }
      }
    },
  );

  it('gives the page and its next project cards the client name, and none of the removed fields', async () => {
    const page = (await run(queries.PROJECT_BY_SLUG_QUERY, dataset, { slug: 'old' })) as Row;
    expect(page.clientName).toBe('Hidden Client Ltd');
    expect(byId(page.otherProjects, 'other-service')?.clientName).toBe('Hidden Client Ltd');
    const json = JSON.stringify(page);
    for (const field of REMOVED) {
      expect(json, field).not.toContain(`"${field}"`);
    }
    for (const text of ['R42M', 'Q3 2027', 'Projected from our model.', 'Tariff escalation']) {
      expect(json, text).not.toContain(text);
    }
  });

  it('passes a rand figure through as written', async () => {
    const rands = project('rands', { results: [{ _key: 'r', label: 'Off the municipal bill in year one', value: 'R276k' }] });
    const page = (await run(queries.PROJECT_BY_SLUG_QUERY, [ASSET, rands], { slug: 'rands' })) as Row;
    expect(page.results).toEqual([{ label: 'Off the municipal bill in year one', value: 'R276k', note: null }]);
  });
});

describe('project queries: the page fields', () => {
  it('returns every page field, and the gallery captions', async () => {
    const full = project('full', {
      headline: 'Rooftop solar and a battery for a Cape Town logistics warehouse',
      siteType: 'Logistics warehouse',
      commissionedOn: '2026-06-12',
      financing: ['outright-purchase'],
      challengeHeadline: 'Peak tariffs landed on the busiest hours',
      solutionHeadline: 'A battery that covers the peak',
      outcomeHeadline: 'Lower bills from month one',
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
  // "Newest" is the completion date (commissionedOn), else the date the project was added.
  const dataset = [
    ASSET,
    project('added-june', { _createdAt: '2026-06-20T08:00:00Z' }),
    project('commissioned-2025', { _createdAt: '2026-08-01T08:00:00Z', commissionedOn: '2025-11-30' }),
    project('commissioned-july', { _createdAt: '2026-02-01T08:00:00Z', commissionedOn: '2026-07-01' }),
    project('unreadable-date', { _createdAt: '2026-03-01T08:00:00Z', commissionedOn: '12 June 2026' }),
    project('added-january', { _createdAt: '2026-01-10T08:00:00Z', completionDate: 'Q3 2027' }),
  ];
  const expected = ['commissioned-july', 'added-june', 'unreadable-date', 'added-january', 'commissioned-2025'];

  it('orders /projects and the solution pages by the completion date, else the date added, never an old free-text date', async () => {
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

describe('blog queries: live posts only', () => {
  // A post goes live on its publish date: one dated in the future, or without a
  // slug, is left out of every list, count, lookup and the sitemap.
  const author: Doc = { _id: 'author-a', _type: 'author', name: 'An Author', slug: { current: 'a' } };
  const quiet: Doc = { _id: 'author-b', _type: 'author', name: 'Another Author', slug: { current: 'b' } };
  const post = (id: string, extra: Doc = {}): Doc => ({
    _id: id,
    _type: 'blogPost',
    title: `Post ${id}`,
    slug: { current: id },
    category: 'Company News',
    tags: ['Wheeling'],
    excerpt: 'An excerpt',
    publishedAt: '2026-01-01T08:00:00.000Z',
    featured: false,
    author: { _type: 'reference', _ref: 'author-a' },
    ...extra,
  });
  const dataset: Doc[] = [
    author,
    quiet,
    post('live', { updatedAt: '2026-03-01T08:00:00.000Z' }),
    post('future', { publishedAt: '2999-01-01T08:00:00.000Z', author: { _type: 'reference', _ref: 'author-b' } }),
    post('no-slug', { slug: undefined }),
  ];
  const listParams = { category: '', tag: '', q: '', offset: 0, exclude: '' };

  it('lists, counts and finds only the live post', async () => {
    expect(await run(queries.PUBLISHED_POSTS_COUNT_QUERY, dataset)).toBe(1);
    expect(await run(queries.BLOG_COUNT_QUERY, dataset, listParams)).toBe(1);
    expect(ids(await run(queries.BLOG_INDEX_QUERY, dataset, listParams))).toEqual(['live']);
    expect(ids(await run(queries.LATEST_POSTS_QUERY, dataset))).toEqual(['live']);
    expect(ids(await run(queries.POSTS_BY_VERTICAL_QUERY, dataset, { tag: 'Wheeling' }))).toEqual(['live']);
    expect(ids(await run(queries.POSTS_BY_AUTHOR_QUERY, dataset, { slug: 'a' }))).toEqual(['live']);
    expect(ids(await run(queries.POSTS_BY_AUTHOR_QUERY, dataset, { slug: 'b' }))).toEqual([]);
    expect((await run(queries.FEATURED_POST_QUERY, dataset)) as Row).toMatchObject({ _id: 'live' });
    expect(await run(queries.ALL_BLOG_SLUGS_QUERY, dataset)).toEqual([{ slug: 'live' }]);
    expect(await run(queries.BLOG_FILTER_ROWS_QUERY, dataset)).toEqual([{ category: 'Company News', tags: ['Wheeling'] }]);
    expect(await run(queries.POST_BY_SLUG_QUERY, dataset, { slug: 'future' })).toBeNull();
    expect((await run(queries.POST_BY_SLUG_QUERY, dataset, { slug: 'live' })) as Row).toMatchObject({ _id: 'live' });
  });

  it('dates each live post in the sitemap by its last update, and lists only authors with a live post', async () => {
    expect(new Date((await run(queries.BLOG_SITEMAP_QUERY, dataset) as Row[])[0].lastModified as string).toISOString()).toBe('2026-03-01T08:00:00.000Z');
    expect(await run(queries.AUTHOR_SITEMAP_QUERY, dataset)).toEqual([{ slug: 'a', lastModified: '2026-01-01T08:00:00.000Z' }]);
  });

  it('reads a publish date written as a bare date or without a time zone, keeps a future one off the site, and treats an unreadable one as unpublished', async () => {
    const forms: Doc[] = [
      author,
      post('bare-date-past', { publishedAt: '2026-01-02' }),
      post('no-zone-past', { publishedAt: '2026-01-03T08:00:00' }),
      post('bare-date-future', { publishedAt: '2999-01-02' }),
      post('unreadable-published', { publishedAt: 'TBC' }),
    ];
    expect(await run(queries.PUBLISHED_POSTS_COUNT_QUERY, forms)).toBe(2);
    expect(ids(await run(queries.LATEST_POSTS_QUERY, forms)).sort()).toEqual(['bare-date-past', 'no-zone-past']);
    expect(await run(queries.POST_BY_SLUG_QUERY, forms, { slug: 'bare-date-future' })).toBeNull();
  });

  it("falls the sitemap's last-updated date back to the publish date when the update date can't be read", async () => {
    const forms: Doc[] = [author, post('unreadable-update', { updatedAt: 'TBC' })];
    const rows = (await run(queries.BLOG_SITEMAP_QUERY, forms)) as Row[];
    expect(new Date(rows[0].lastModified as string).toISOString()).toBe('2026-01-01T08:00:00.000Z');
  });
});

describe('blog index: the featured post kept out of the grid', () => {
  // /blog shows a featured post in its own card on page 1, so the grid and the
  // page count leave it out ($exclude), on every page, or the pages would shift.
  const post = (id: string, publishedAt: string, extra: Doc = {}): Doc => ({
    _id: id,
    _type: 'blogPost',
    title: `Post ${id}`,
    slug: { current: id },
    category: 'Industry Insights',
    tags: ['Energy Optimisation'],
    excerpt: 'An excerpt',
    publishedAt,
    featured: false,
    ...extra,
  });
  const dataset: Doc[] = [
    post('one', '2026-01-01T08:00:00Z'),
    post('two', '2026-02-01T08:00:00Z'),
    post('lead', '2026-03-01T08:00:00Z', { featured: true }),
    post('four', '2026-04-01T08:00:00Z', { category: 'Company News', tags: ['Wheeling'] }),
  ];
  const params = { category: '', tag: '', q: '', offset: 0 };

  it('leaves the excluded post out of the list and the count', async () => {
    expect(queries.BLOG_INDEX_QUERY).toContain('_id != $exclude');
    expect(queries.BLOG_COUNT_QUERY).toContain('_id != $exclude');
    expect(ids(await run(queries.BLOG_INDEX_QUERY, dataset, { ...params, exclude: 'lead' }))).toEqual(['four', 'two', 'one']);
    expect(await run(queries.BLOG_COUNT_QUERY, dataset, { ...params, exclude: 'lead' })).toBe(3);
  });

  it('leaves nothing out when nothing is excluded', async () => {
    expect(ids(await run(queries.BLOG_INDEX_QUERY, dataset, { ...params, exclude: '' }))).toEqual(['lead', 'four', 'two', 'one']);
    expect(await run(queries.BLOG_COUNT_QUERY, dataset, { ...params, exclude: '' })).toBe(4);
  });

  it('lists every live post, newest first, with no cap, for the index below the threshold', async () => {
    // More posts than the threshold, so raising BLOG_FILTER_THRESHOLD can never hide one.
    const many = Array.from({ length: BLOG_FILTER_THRESHOLD + 3 }, (_, i) => post(`p${i + 1}`, `2026-01-${String(i + 1).padStart(2, '0')}T08:00:00Z`));
    const future = post('future', '2999-01-01T08:00:00Z');
    expect(ids(await run(queries.LIVE_POSTS_QUERY, [...many, future]))).toEqual(many.map((row) => row._id).reverse());
  });

  it("gives the pills each live post's category and tags", async () => {
    expect(await run(queries.BLOG_FILTER_ROWS_QUERY, dataset)).toHaveLength(4);
    expect(await run(queries.BLOG_FILTER_ROWS_QUERY, dataset)).toContainEqual({ category: 'Company News', tags: ['Wheeling'] });
  });
});

describe('every query', () => {
  // One of each document the queries read, every image pointing at ASSET, and
  // enough of each to feed every nested list: the author's slug matches $slug
  // so AUTHOR_BY_SLUG_QUERY and POSTS_BY_AUTHOR_QUERY return something; a
  // second post feeds POST_BY_SLUG_QUERY's "related"; a second project (a
  // different service) feeds PROJECT_BY_SLUG_QUERY's "otherProjects"; and
  // every hero image key is set, so a leak in any of them would show up below.
  const dataset: Doc[] = [
    ASSET,
    { _id: 'author-a', _type: 'author', name: 'An Author', slug: { current: 'a' }, photo: image() },
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
    {
      _id: 'post-b',
      _type: 'blogPost',
      title: 'Another post',
      slug: { current: 'b' },
      category: 'Company News',
      tags: ['Wheeling'],
      excerpt: 'Another excerpt',
      publishedAt: '2026-02-01T08:00:00Z',
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
    {
      _id: 'heroImages',
      _type: 'heroImages',
      ciSolarStorage: image(),
      wheeling: image(),
      energyOptimisation: image(),
      carbonCredits: image(),
      webuysolar: image(),
      evFleets: image(),
    },
    { _id: 'energyPrices', _type: 'energyPrices', dieselPricePerL: 21.5 },
    project('a', { featured: true, projectValue: 'R42M' }),
    // Shares project('a')'s vertical, and the same ASSET (via the default
    // heroImage and gallery the project() helper gives every fixture), so
    // PROJECT_BY_SLUG_QUERY's "related" is fed and a leak living only in that
    // nested projection would show up in the check below.
    project('c', { vertical: 'ci-solar-storage' }),
    project('b', { vertical: 'wheeling' }),
  ];
  const params = { slug: 'a', vertical: 'ci-solar-storage', tag: 'Wheeling', category: '', q: '', offset: 0, exclude: '', id: 'howItWorks.home' };

  // Every export in queries.ts is a GROQ string. (Each export's inferred type is
  // its own string literal, not `string`, so a type predicate can't narrow to
  // [string, string]; the cast below just widens it back.)
  const ALL_QUERIES = Object.entries(queries).filter((entry) => typeof entry[1] === 'string') as [string, string][];

  it('covers all 28 queries', () => {
    expect(ALL_QUERIES).toHaveLength(28);
  });

  // From the base file (git show 57a7bed:src/lib/queries.test.ts): a static
  // check over each query's own text, so it doesn't depend on the fixture
  // feeding every branch. Safe: `asset->{ ... }` (a projection) or one of the
  // two fields the site reads directly, `asset->url` and `asset->metadata`
  // (HERO_IMAGES_QUERY). Unsafe: anything else after `asset->`, such as
  // `asset->originalFilename` or `asset->path`, which would still leak part
  // of the asset document even where the fixture below returns nothing.
  const UNSAFE_ASSET_DEREF = /asset->(?!\s*\{|\s*(?:url|metadata)\b)/;

  it('treats a field other than url or metadata after asset-> as unsafe', () => {
    expect('"heroImage": heroImage { asset->originalFilename }').toMatch(UNSAFE_ASSET_DEREF);
    expect('"heroImage": heroImage { asset->path }').toMatch(UNSAFE_ASSET_DEREF);
    expect('"asset": asset->{ _id, url }').not.toMatch(UNSAFE_ASSET_DEREF);
    expect('"url": asset->url').not.toMatch(UNSAFE_ASSET_DEREF);
    expect('"lqip": asset->metadata.lqip').not.toMatch(UNSAFE_ASSET_DEREF);
  });

  it.each(ALL_QUERIES)('%s never expands a whole asset document', (_name, query) => {
    expect(query).not.toMatch(UNSAFE_ASSET_DEREF);
  });

  it.each(ALL_QUERIES)('%s never mentions originalFilename', (_name, query) => {
    expect(query).not.toContain('originalFilename');
  });

  it('feeds every hero image slot so the leak check can see it', async () => {
    const heroes = (await run(queries.HERO_IMAGES_QUERY, dataset, params)) as Row;
    for (const key of ['ci-solar-storage', 'wheeling', 'energy-optimisation', 'carbon-credits', 'webuysolar', 'ev-fleets']) {
      expect(heroes[key], key).not.toBeNull();
    }
  });

  it('feeds both the related and otherProjects lists so the leak check can see them', async () => {
    // The generic null-or-empty guard below only looks at each query's
    // top-level result, so a nested list such as this one can still go empty,
    // unnoticed, even while PROJECT_BY_SLUG_QUERY itself returns an object.
    const page = (await run(queries.PROJECT_BY_SLUG_QUERY, dataset, params)) as Row;
    expect((page.related as Row[]).length, 'related').toBeGreaterThan(0);
    expect((page.otherProjects as Row[]).length, 'otherProjects').toBeGreaterThan(0);
  });

  it.each(ALL_QUERIES)('%s returns no asset file name or metadata, and no project value', async (_name, query) => {
    // A query that returns null or an empty array feeds nothing to the text
    // check below, so a leak inside it would pass here silently.
    const value = await run(query, dataset, params);
    expect(value, `${_name} returned nothing for this check to see`).not.toBeNull();
    if (Array.isArray(value)) {
      expect(value.length, `${_name} returned no rows for this check to see`).toBeGreaterThan(0);
    }
    const json = JSON.stringify(value);
    for (const text of ['originalFilename', 'HIDDEN-CLIENT', 'sha1hash', 'deadbeef', 'exif', '"path"', 'R42M']) {
      expect(json).not.toContain(text);
    }
  });

  it('keeps no case-study rule or unused project query', () => {
    expect('CASE_STUDY_READY' in queries).toBe(false);
    expect('FLAGSHIP_BY_VERTICAL_QUERY' in queries).toBe(false);
  });
});
