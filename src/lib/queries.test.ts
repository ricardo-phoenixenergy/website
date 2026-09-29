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

// Every export in queries.ts is a GROQ string, so this also catches a future
// query that forgets to trim its asset fields. (Each export's inferred type is
// its own string literal, not `string`, so a type predicate can't narrow to
// [string, string]; the cast below just widens it back.)
const ALL_QUERIES = Object.entries(queries).filter(
  (entry) => typeof entry[1] === 'string',
) as [string, string][];

describe('project queries', () => {
  it.each(Object.entries(PROJECT_QUERIES))('%s leaves out the client, the project value and retired fields', (_name, query) => {
    expect(query).not.toMatch(/clientName|projectValue|systemSize|caseStudyReady/);
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

describe('every query', () => {
  // Safe: `asset->{ ... }` (a projection) or one of the two fields the site
  // reads directly, `asset->url` and `asset->metadata` (HERO_IMAGES_QUERY).
  // Unsafe: anything else after `asset->`, such as `asset->originalFilename`
  // or `asset->path`, which would still leak part of the asset document.
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
});
