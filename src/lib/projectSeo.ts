// src/lib/projectSeo.ts
// A project page's search and sharing data: the meta description and the
// structured data (an Article and its BreadcrumbList), mirroring the blog post's.
// The Article never carries the client's name, an `address` property, or any
// results figure or System value; its description is the meta description.
import { SOLUTION_META, type SolutionMeta, type SolutionVertical } from '@/types/solutions';

export const SITE_URL = 'https://phoenixenergy.solutions';

/** A search-snippet length description: whole words, at most `max` characters. */
export function snippet(text: string | null | undefined, max = 155): string | undefined {
  const clean = text?.replace(/\s+/g, ' ').trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

export function projectDescription(project: { summary?: string | null }): string | undefined {
  return snippet(project.summary);
}

export interface ArticleSource {
  title: string;
  summary?: string | null;
  vertical: SolutionVertical;
  location?: string | null;
  _createdAt: string;
  _updatedAt: string;
}

const ORGANISATION = {
  '@type': 'Organization',
  name: 'Phoenix Energy',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
} as const;

export function projectArticleJsonLd(project: ArticleSource, page: { url: string; imageUrl?: string }) {
  const meta: SolutionMeta | undefined = SOLUTION_META[project.vertical];
  const description = projectDescription(project);
  const city = project.location?.trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    ...(description ? { description } : {}),
    ...(page.imageUrl ? { image: page.imageUrl } : {}),
    datePublished: project._createdAt,
    dateModified: project._updatedAt,
    author: ORGANISATION,
    publisher: ORGANISATION,
    mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
    ...(meta ? { about: { '@type': 'Service', name: meta.label, url: `${SITE_URL}${meta.slug}` } } : {}),
    ...(city ? { contentLocation: { '@type': 'Place', name: city } } : {}),
  };
}

export function projectBreadcrumbJsonLd(title: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };
}
