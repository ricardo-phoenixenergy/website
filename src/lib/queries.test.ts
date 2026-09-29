import { describe, expect, it } from 'vitest';
import * as queries from './queries';

const PROJECT_QUERIES = {
  ALL_PROJECTS_QUERY: queries.ALL_PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY: queries.FEATURED_PROJECTS_QUERY,
  PROJECTS_BY_VERTICAL_QUERY: queries.PROJECTS_BY_VERTICAL_QUERY,
  PROJECT_BY_SLUG_QUERY: queries.PROJECT_BY_SLUG_QUERY,
  ALL_PROJECT_SLUGS_QUERY: queries.ALL_PROJECT_SLUGS_QUERY,
  PROJECT_SITEMAP_QUERY: queries.PROJECT_SITEMAP_QUERY,
};

describe('project queries', () => {
  it.each(Object.entries(PROJECT_QUERIES))('%s leaves out the client, the project value and retired fields', (_name, query) => {
    expect(query).not.toMatch(/clientName|projectValue|systemSize|caseStudyReady/);
  });

  it.each(Object.entries(PROJECT_QUERIES))('%s never expands a whole asset document', (_name, query) => {
    // Each `asset->` is followed by a projection, so file names and other asset metadata stay out.
    expect(query).not.toMatch(/asset->(?!\s*\{)/);
  });

  it('lists the newest first, and never sorts on the free-text completion date', () => {
    for (const query of [queries.ALL_PROJECTS_QUERY, queries.PROJECTS_BY_VERTICAL_QUERY, queries.PROJECT_BY_SLUG_QUERY]) {
      expect(query).toContain('order(_createdAt desc)');
      expect(query).not.toContain('completionDate desc');
    }
    expect(queries.FEATURED_PROJECTS_QUERY).toContain('order(coalesce(featuredOrder, 99) asc, _createdAt desc)');
  });

  it('keeps no case-study rule or unused project query', () => {
    expect('CASE_STUDY_READY' in queries).toBe(false);
    expect('FLAGSHIP_BY_VERTICAL_QUERY' in queries).toBe(false);
  });
});
