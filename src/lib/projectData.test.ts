import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@/lib/sanity.server', () => ({ sanityServerClient: { fetch: fetchMock } }));

import { getAllProjects, getFeaturedProjects, getProjectBySlug, getProjectSitemapEntries, getProjectSlugs, getProjectsByVertical } from './projectData';
import { ALL_PROJECTS_QUERY, FEATURED_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY, PROJECTS_BY_VERTICAL_QUERY } from './queries';

const RAND = { label: 'Off the municipal bill in year one', value: 'R276k' };
const KEEP = { label: 'Payback period', value: '51 months' };
// A row missing its label or its value: the page has nothing to pair it with.
const HALF = { label: 'Grid bill reduction', value: '  ' };
const card = (id: string, extra: Record<string, unknown> = {}) => ({
  _id: id,
  title: id,
  slug: { current: id },
  vertical: 'ci-solar-storage',
  results: [RAND, KEEP, HALF],
  metrics: [{ label: 'Capital cost', value: 'R1.5M' }, { label: 'Solar PV', value: null }],
  ...extra,
});

beforeEach(() => {
  fetchMock.mockReset();
});

describe('getProjectBySlug', () => {
  it('returns null for a missing project', async () => {
    fetchMock.mockResolvedValueOnce(null);
    expect(await getProjectBySlug('nope')).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(PROJECT_BY_SLUG_QUERY, { slug: 'nope' });
  });

  it('shows rand amounts as written, and drops only rows missing a label or a value, on the project and every project it links to', async () => {
    fetchMock.mockResolvedValueOnce({ ...card('a'), related: [card('b')], otherProjects: [card('c')] });
    const project = await getProjectBySlug('a');
    expect(project?.results).toEqual([RAND, KEEP]);
    expect(project?.metrics).toEqual([{ label: 'Capital cost', value: 'R1.5M' }]);
    expect(project?.related?.[0].results).toEqual([RAND, KEEP]);
    expect(project?.otherProjects?.[0].metrics).toEqual([{ label: 'Capital cost', value: 'R1.5M' }]);
  });

  it('gives empty lists when the CMS returns none', async () => {
    fetchMock.mockResolvedValueOnce({ ...card('a'), results: null, metrics: null, related: null, otherProjects: null });
    const project = await getProjectBySlug('a');
    expect(project?.results).toEqual([]);
    expect(project?.metrics).toEqual([]);
    expect(project?.related).toEqual([]);
    expect(project?.otherProjects).toEqual([]);
  });

  it('passes a CMS error on, so ISR keeps serving the last good page', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Sanity is down'));
    await expect(getProjectBySlug('a')).rejects.toThrow('Sanity is down');
  });
});

describe('listings', () => {
  it('orders /projects with featured projects first, figures as written', async () => {
    fetchMock.mockResolvedValueOnce([card('newest'), card('featured', { featured: true, featuredOrder: 1 })]);
    const projects = await getAllProjects();
    expect(projects.map((p) => p._id)).toEqual(['featured', 'newest']);
    expect(projects.every((p) => p.results?.length === 2 && p.metrics?.length === 1)).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(ALL_PROJECTS_QUERY);
  });

  it('gives the home and solution page cards their figures as written', async () => {
    fetchMock.mockResolvedValueOnce([card('home')]).mockResolvedValueOnce([card('service')]);
    expect((await getFeaturedProjects())[0].results).toEqual([RAND, KEEP]);
    expect((await getProjectsByVertical('wheeling'))[0].metrics).toEqual([{ label: 'Capital cost', value: 'R1.5M' }]);
    expect(fetchMock).toHaveBeenNthCalledWith(1, FEATURED_PROJECTS_QUERY);
    expect(fetchMock).toHaveBeenNthCalledWith(2, PROJECTS_BY_VERTICAL_QUERY, { vertical: 'wheeling' });
  });

  it('treats a null listing as empty', async () => {
    fetchMock.mockResolvedValue(null);
    expect(await getAllProjects()).toEqual([]);
    expect(await getFeaturedProjects()).toEqual([]);
    expect(await getProjectsByVertical('wheeling')).toEqual([]);
  });
});

describe('slugs and sitemap entries', () => {
  it('skips projects without a slug', async () => {
    fetchMock.mockResolvedValueOnce(['a', null, '', 'b']);
    expect(await getProjectSlugs()).toEqual(['a', 'b']);
  });

  it("gives each project its last update", async () => {
    fetchMock.mockResolvedValueOnce([{ slug: 'a', _updatedAt: '2026-09-20T10:00:00Z' }, { slug: null, _updatedAt: '2026-09-21T10:00:00Z' }]);
    expect(await getProjectSitemapEntries()).toEqual([{ slug: 'a', updatedAt: '2026-09-20T10:00:00Z' }]);
  });
});
