// src/lib/structuredData.ts
// The structured data pages share: the organisation, the website, a service and
// a breadcrumb trail. The organisation is described once, in the root layout,
// under a fixed @id; other blocks point to it by that id instead of each
// describing a bare "Phoenix Energy" of its own.
import { CONTACT } from '@/config/contact';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** The organisation as another block names it: its @id, with its name and URL for readers that don't follow ids. */
export const ORGANIZATION_REF = { '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL } as const;

/** Where Phoenix Energy works. */
export const AREA_SERVED = { '@type': 'Country', name: 'South Africa' } as const;

/** The organisation, on every page (src/app/layout.tsx). */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: CONTACT.legalName,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: { '@type': 'PostalAddress', ...CONTACT.address },
    areaServed: AREA_SERVED,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: CONTACT.phone,
      email: CONTACT.email,
      areaServed: 'ZA',
      availableLanguage: 'English',
    },
    sameAs: [CONTACT.linkedin],
  };
}

/** The website, on the home page. The blog search is offered only once there's a post to find. */
export function websiteJsonLd({ searchable }: { searchable: boolean }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-ZA',
    publisher: ORGANIZATION_REF,
    ...(searchable
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }
      : {}),
  };
}

/** A service, on its solution page. */
export function serviceJsonLd(service: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: ORGANIZATION_REF,
    areaServed: AREA_SERVED,
  };
}

export interface Crumb {
  name: string;
  /** The page's path, "/" for home. */
  path: string;
}

/** The first crumb of every trail. */
export const HOME_CRUMB: Crumb = { name: 'Home', path: '/' };

/** The trail a page's visible breadcrumb shows, as a BreadcrumbList: home first, the page itself last. */
export function breadcrumbJsonLd(crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}
