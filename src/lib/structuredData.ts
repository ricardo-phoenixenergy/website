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

/** A place a service is offered in, for a location page. */
export interface PlaceServed {
  '@type': 'City' | 'AdministrativeArea';
  name: string;
}

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

/**
 * A service, on its solution page, or on a location page with the places it serves, its type, audience and ways to pay.
 * `offers` and `businessAudience` apply only when `serviceType` is given.
 */
export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
  areaServed?: readonly PlaceServed[];
  serviceType?: string;
  offers?: readonly string[];
  businessAudience?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    ...(service.serviceType ? { '@id': `${absoluteUrl(service.path)}#service`, serviceType: service.serviceType } : {}),
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: ORGANIZATION_REF,
    areaServed: service.areaServed?.length ? service.areaServed : AREA_SERVED,
    ...(service.serviceType && service.businessAudience ? { audience: { '@type': 'BusinessAudience' } } : {}),
    ...(service.serviceType && service.offers?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Ways to pay',
            itemListElement: service.offers.map((name) => ({ '@type': 'Offer', name })),
          },
        }
      : {}),
  };
}

/** A page of the site: when it was last checked, the site it belongs to, what it is about and the bodies it mentions. */
export function webPageJsonLd(page: {
  path: string;
  name: string;
  description: string;
  dateModified: string;
  aboutId?: string;
  /** The `@id` of the page's BreadcrumbList block. */
  breadcrumbId?: string;
  mentions?: readonly { name: string; url: string }[];
}) {
  const url = absoluteUrl(page.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.name,
    description: page.description,
    dateModified: page.dateModified,
    inLanguage: 'en-ZA',
    isPartOf: { '@id': WEBSITE_ID },
    ...(page.aboutId ? { about: { '@id': page.aboutId } } : {}),
    ...(page.breadcrumbId ? { breadcrumb: { '@id': page.breadcrumbId } } : {}),
    ...(page.mentions?.length
      ? { mentions: page.mentions.map((m) => ({ '@type': 'Organization', name: m.name, sameAs: m.url })) }
      : {}),
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
export function breadcrumbJsonLd(crumbs: readonly Crumb[], options: { id?: string } = {}) {
  return {
    '@context': 'https://schema.org',
    ...(options.id ? { '@id': options.id } : {}),
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}
