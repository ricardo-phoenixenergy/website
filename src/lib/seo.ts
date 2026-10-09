// src/lib/seo.ts
// Every page's search and sharing tags come from pageMetadata(). Next.js puts a
// page's openGraph block in place of the layout's rather than merging the two,
// so a page that set only its title and image lost the site name, the locale
// and the type. Building every page's tags here means none is left out, and
// every URL is absolute, so none depends on metadataBase.
import type { Metadata } from 'next';

export const SITE_URL = 'https://phoenixenergy.solutions';
export const SITE_NAME = 'Phoenix Energy';
/** The site's language in Open Graph's form (the HTML says en-ZA). */
export const SITE_LOCALE = 'en_ZA';
/** The home page's title, and the title of any page that sets none. */
export const SITE_TITLE = 'Phoenix Energy: Integrated Clean Energy for SA Businesses';
/** The home page's description, and the description of any page that sets none. */
export const SITE_DESCRIPTION =
  'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.';

/** A share image: its absolute URL, its size in pixels and its alt text. */
export interface ShareImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/** The share image of a page without one of its own. */
export const DEFAULT_SHARE_IMAGE: ShareImage = {
  url: `${SITE_URL}/og-default.png`,
  width: 1200,
  height: 630,
  alt: "The Phoenix Energy logo and the line: Powering Africa's energy transition.",
};

/** A path on the site as an absolute URL. "/" is the bare domain, the home page's canonical. A full URL is returned as it is. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === '' || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface PageMetadataInput {
  /** The page's own title: the root template adds " | Phoenix Energy" unless absoluteTitle is set. */
  title: string;
  /** Use the title as written, because it already names the brand. */
  absoluteTitle?: boolean;
  /** The meta description. Without one the page has none: it never inherits another page's. */
  description?: string | null;
  /** The page's path, such as "/about" or "/blog?page=2": its canonical URL and og:url. */
  path: string;
  /** A canonical URL on another site, for a post first published there. og:url stays on this site. */
  canonical?: string | null;
  /** The sharing title, when it differs from the page title. Defaults to the full page title. */
  shareTitle?: string;
  /** The sharing description, when it differs from the meta description. */
  shareDescription?: string | null;
  /** Defaults to DEFAULT_SHARE_IMAGE. */
  image?: ShareImage;
  /** Makes the page an Open Graph article, with its dates, its authors (their page URLs), its section and its tags. */
  article?: { publishedTime?: string | null; modifiedTime?: string | null; authors?: string[]; section?: string | null; tags?: string[] | null };
  /** Keeps the page out of search results; its links are still followed. */
  noindex?: boolean;
  /** The paths of the previous and next pages of a list. */
  pagination?: { previous?: string; next?: string };
}

/** Text with its spaces tidied, or nothing when it's blank. */
const text = (value: string | null | undefined): string | undefined => value?.replace(/\s+/g, ' ').trim() || undefined;

export function pageMetadata(input: PageMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  const description = text(input.description);
  const shareTitle = text(input.shareTitle) ?? (input.absoluteTitle ? input.title : `${input.title} | ${SITE_NAME}`);
  const shareDescription = input.shareDescription === undefined ? description : text(input.shareDescription);
  const image = input.image ?? DEFAULT_SHARE_IMAGE;
  const previous = input.pagination?.previous;
  const next = input.pagination?.next;
  const shared = {
    title: shareTitle,
    ...(shareDescription ? { description: shareDescription } : {}),
    url,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [image],
  };
  const article = input.article;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    // null, not undefined: Next.js then gives the page no description rather than the root layout's.
    description: description ?? null,
    alternates: { canonical: input.canonical ? absoluteUrl(input.canonical) : url },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
    ...(previous || next
      ? { pagination: { ...(previous ? { previous: absoluteUrl(previous) } : {}), ...(next ? { next: absoluteUrl(next) } : {}) } }
      : {}),
    openGraph: article
      ? {
          ...shared,
          type: 'article' as const,
          ...(article.publishedTime ? { publishedTime: article.publishedTime } : {}),
          ...(article.modifiedTime ? { modifiedTime: article.modifiedTime } : {}),
          ...(article.authors?.length ? { authors: article.authors } : {}),
          ...(article.section ? { section: article.section } : {}),
          ...(article.tags?.length ? { tags: article.tags } : {}),
        }
      : { ...shared, type: 'website' as const },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      ...(shareDescription ? { description: shareDescription } : {}),
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
