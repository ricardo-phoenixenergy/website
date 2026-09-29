import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@/lib/sanity.server', () => ({ sanityServerClient: { fetch: fetchMock } }));

import { getAllProjects, getFeaturedProjects, getProjectBySlug, getProjectSitemapEntries, getProjectSlugs, getProjectsByVertical } from './projectData';
import { ALL_PROJECTS_QUERY, FEATURED_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY, PROJECTS_BY_VERTICAL_QUERY } from './queries';

const RAND = { label: 'Capital cost', value: 'R1.5M' };
const KEEP = { label: 'Payback period', value: '51 months' };
const card = (id: string, extra: Record<string, unknown> = {}) => ({
  _id: id,
  title: id,
  slug: { current: id },
  vertical: 'ci-solar-storage',
  results: [RAND, KEEP],
  metrics: [RAND],
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

  it('drops rand amounts from the project and from every project it links to', async () => {
    fetchMock.mockResolvedValueOnce({ ...card('a'), related: [card('b')], otherProjects: [card('c')] });
    const project = await getProjectBySlug('a');
    expect(project?.results).toEqual([KEEP]);
    expect(project?.metrics).toEqual([]);
    expect(project?.related?.[0].results).toEqual([KEEP]);
    expect(project?.otherProjects?.[0].metrics).toEqual([]);
  });

  it('gives empty related lists when the CMS returns none', async () => {
    fetchMock.mockResolvedValueOnce({ ...card('a'), related: null, otherProjects: null });
    const project = await getProjectBySlug('a');
    expect(project?.related).toEqual([]);
    expect(project?.otherProjects).toEqual([]);
  });

  it('passes a CMS error on, so ISR keeps serving the last good page', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Sanity is down'));
    await expect(getProjectBySlug('a')).rejects.toThrow('Sanity is down');
  });
});

describe('listings', () => {
  it('orders /projects with featured projects first, and clears rand amounts', async () => {
    fetchMock.mockResolvedValueOnce([card('newest'), card('featured', { featured: true, featuredOrder: 1 })]);
    const projects = await getAllProjects();
    expect(projects.map((p) => p._id)).toEqual(['featured', 'newest']);
    expect(projects.every((p) => p.results?.length === 1 && p.metrics?.length === 0)).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(ALL_PROJECTS_QUERY);
  });

  it('clears rand amounts from the home and solution page cards', async () => {
    fetchMock.mockResolvedValueOnce([card('home')]).mockResolvedValueOnce([card('service')]);
    expect((await getFeaturedProjects())[0].results).toEqual([KEEP]);
    expect((await getProjectsByVertical('wheeling'))[0].metrics).toEqual([]);
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
