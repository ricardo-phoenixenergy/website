import { describe, expect, it } from 'vitest';
import { projectArticleJsonLd, projectBreadcrumbJsonLd, projectDescription, snippet, type ArticleSource } from './projectSeo';

const project: ArticleSource = {
  title: '31 Sacks Circle',
  summary: 'A Cape Town logistics warehouse was paying peak rates in its busiest hours. A rooftop array and a battery now carry them.',
  vertical: 'ci-solar-storage',
  location: 'Cape Town',
  _createdAt: '2026-05-01T08:00:00Z',
  _updatedAt: '2026-09-20T10:00:00Z',
};
const url = 'https://phoenixenergy.solutions/projects/31-sacks-circle';

describe('snippet', () => {
  it('keeps short text whole, with its spaces tidied', () => {
    expect(snippet('  Two   sentences.  Short. ')).toBe('Two sentences. Short.');
  });

  it('cuts long text at a word boundary, within the limit, with an ellipsis', () => {
    const long = 'word '.repeat(60).trim();
    const cut = snippet(long)!;
    expect(cut.length).toBeLessThanOrEqual(155);
    expect(cut.endsWith('word…')).toBe(true);
  });

  it('gives nothing for empty text', () => {
    expect(snippet('   ')).toBeUndefined();
    expect(snippet(null)).toBeUndefined();
  });
});

describe('projectDescription', () => {
  it('is the summary as a search snippet', () => {
    expect(projectDescription(project)).toBe(project.summary);
    expect(projectDescription({ summary: null })).toBeUndefined();
  });
});

describe('projectArticleJsonLd', () => {
  it('describes the project as an article by Phoenix Energy about the service, set in its city', () => {
    expect(projectArticleJsonLd(project, { url, imageUrl: 'https://cdn.sanity.io/x.jpg' })).toMatchObject({
      '@type': 'Article',
      headline: '31 Sacks Circle',
      description: project.summary,
      image: 'https://cdn.sanity.io/x.jpg',
      datePublished: '2026-05-01T08:00:00Z',
      dateModified: '2026-09-20T10:00:00Z',
      author: { '@type': 'Organization', name: 'Phoenix Energy' },
      publisher: { '@type': 'Organization', name: 'Phoenix Energy', logo: { '@type': 'ImageObject' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      about: { '@type': 'Service', name: 'C&I Solar & Storage', url: 'https://phoenixenergy.solutions/solutions/ci-solar-storage' },
      contentLocation: { '@type': 'Place', name: 'Cape Town' },
    });
  });

  it('never carries a results figure, a System value, a client name or an address', () => {
    const withExtras = { ...project, clientName: 'Hidden Client Ltd', results: [{ label: 'Payback period', value: '51 months' }], metrics: [{ label: 'Solar PV Capacity', value: '82.8 kWp' }] };
    const json = JSON.stringify(projectArticleJsonLd(withExtras, { url }));
    for (const text of ['51 months', '82.8 kWp', 'Hidden Client Ltd', '"address"']) {
      expect(json).not.toContain(text);
    }
  });

  it('leaves out what is missing', () => {
    const data = projectArticleJsonLd({ ...project, summary: null, location: null }, { url });
    expect(data).not.toHaveProperty('description');
    expect(data).not.toHaveProperty('image');
    expect(data).not.toHaveProperty('contentLocation');
  });
});

describe('projectBreadcrumbJsonLd', () => {
  it('runs Home, Projects, then the project', () => {
    expect(projectBreadcrumbJsonLd('31 Sacks Circle', url).itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://phoenixenergy.solutions' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://phoenixenergy.solutions/projects' },
      { '@type': 'ListItem', position: 3, name: '31 Sacks Circle', item: url },
    ]);
  });
});
