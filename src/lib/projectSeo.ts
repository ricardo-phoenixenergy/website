// src/lib/projectSeo.ts
// A project page's search and sharing data: the title (the headline, else the
// project title), the meta description (the search description, else the
// summary) and the structured data (an Article and its BreadcrumbList),
// mirroring the blog post's. The Article never carries the client's name, an
// `address` property, or any results figure or System value; its headline is
// the page title, its description the meta description, and its author and
// publisher the organisation by its @id.
import { SOLUTION_META, type SolutionMeta, type SolutionVertical } from '@/types/solutions';
import { SITE_URL } from '@/lib/seo';
import { ORGANIZATION_REF, breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

export { SITE_URL };

/** A search-snippet length description: whole words, at most `max` characters. */
export function snippet(text: string | null | undefined, max = 155): string | undefined {
  const clean = text?.replace(/\s+/g, ' ').trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

/** The page title and the sharing title: the headline, else the project title. */
export function projectTitle(project: { title: string; headline?: string | null }): string {
  return project.headline?.trim() || project.title;
}

/** The meta description: the search description, else the summary cut to 155 characters at a word boundary. */
export function projectDescription(project: { summary?: string | null; seoDescription?: string | null }): string | undefined {
  return snippet(project.seoDescription) ?? snippet(project.summary);
}

export interface ArticleSource {
  title: string;
  headline?: string | null;
  summary?: string | null;
  seoDescription?: string | null;
  vertical: SolutionVertical;
  location?: string | null;
  _createdAt: string;
  _updatedAt: string;
}

export function projectArticleJsonLd(project: ArticleSource, page: { url: string; imageUrl?: string }) {
  const meta: SolutionMeta | undefined = SOLUTION_META[project.vertical];
  const description = projectDescription(project);
  const city = project.location?.trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: projectTitle(project),
    ...(description ? { description } : {}),
    ...(page.imageUrl ? { image: page.imageUrl } : {}),
    datePublished: project._createdAt,
    dateModified: project._updatedAt,
    inLanguage: 'en-ZA',
    author: ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
    mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
    ...(meta ? { about: { '@type': 'Service', name: meta.label, url: `${SITE_URL}${meta.slug}` } } : {}),
    ...(city ? { contentLocation: { '@type': 'Place', name: city } } : {}),
  };
}

export function projectBreadcrumbJsonLd(title: string, url: string) {
  return breadcrumbJsonLd([HOME_CRUMB, { name: 'Projects', path: '/projects' }, { name: title, path: url }]);
}
