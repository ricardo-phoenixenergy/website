// src/lib/blogSeo.ts
// A blog post's and an author page's structured data, and the blog index's
// canonical path, as pure functions (src/lib/projectSeo.ts does the same for
// projects).
import type { BlogCategory } from '@/types/sanity';
import { absoluteUrl } from '@/lib/seo';
import { ORGANIZATION_REF } from '@/lib/structuredData';

/** News for company news and press releases; a blog post for insights and project spotlights. */
export function articleType(category: BlogCategory | null | undefined): 'NewsArticle' | 'BlogPosting' {
  return category === 'Company News' || category === 'Press Release' ? 'NewsArticle' : 'BlogPosting';
}

/** An author's page. */
export function authorUrl(slug: string): string {
  return absoluteUrl(`/blog/authors/${slug}`);
}

export interface AuthorSource {
  name: string;
  slug: string;
  role?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  /** The author's photo, as an absolute URL. */
  photoUrl?: string | null;
}

/** The author as a Person, under an @id their page and their posts share. */
export function personJsonLd(author: AuthorSource) {
  const url = authorUrl(author.slug);
  const role = author.role?.trim();
  const linkedin = author.linkedin?.trim();
  return {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: author.name,
    url,
    ...(role ? { jobTitle: role } : {}),
    ...(author.photoUrl ? { image: author.photoUrl } : {}),
    ...(linkedin ? { sameAs: [linkedin] } : {}),
    worksFor: ORGANIZATION_REF,
  };
}

export interface BlogArticleSource {
  title: string;
  category?: BlogCategory | null;
  tags?: string[] | null;
  excerpt?: string | null;
  seoDescription?: string | null;
  publishedAt: string;
  updatedAt?: string | null;
  author: AuthorSource;
}

export function blogArticleJsonLd(post: BlogArticleSource, page: { url: string; images: string[] }) {
  const description = post.seoDescription?.trim() || post.excerpt?.trim();
  return {
    '@context': 'https://schema.org',
    '@type': articleType(post.category),
    // The display title: an SEO title may end in " | Phoenix Energy".
    headline: post.title,
    ...(description ? { description } : {}),
    ...(page.images.length > 0 ? { image: page.images } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: 'en-ZA',
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
    author: personJsonLd(post.author),
    publisher: ORGANIZATION_REF,
    mainEntityOfPage: { '@type': 'WebPage', '@id': page.url },
  };
}

/** An author's page as a profile of them. */
export function authorProfileJsonLd(author: AuthorSource) {
  const bio = author.bio?.trim();
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: authorUrl(author.slug),
    mainEntity: { ...personJsonLd(author), ...(bio ? { description: bio } : {}) },
  };
}

/**
 * The blog index's canonical path. A filtered or searched view points at /blog,
 * whose posts it repeats; a later page of the whole list points at itself.
 */
export function blogIndexPath(view: { page: number; category?: string; tag?: string; q?: string }): string {
  if (view.category || view.tag || view.q?.trim()) return '/blog';
  return view.page > 1 ? `/blog?page=${view.page}` : '/blog';
}
