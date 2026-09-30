import { describe, expect, it } from 'vitest';
import { CONTACT } from '@/config/contact';
import { SITE_URL } from './seo';
import {
  AREA_SERVED,
  HOME_CRUMB,
  ORGANIZATION_ID,
  ORGANIZATION_REF,
  breadcrumbJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd,
} from './structuredData';

describe('organizationJsonLd', () => {
  it('describes the company once, under the id other blocks point to', () => {
    const org = organizationJsonLd();
    expect(org).toMatchObject({
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Phoenix Energy',
      legalName: 'Phoenix Energy Solutions (Pty) Ltd',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
      email: CONTACT.email,
      telephone: CONTACT.phone,
      address: { '@type': 'PostalAddress', addressLocality: 'Cape Town', postalCode: '7441', addressCountry: 'ZA' },
      areaServed: AREA_SERVED,
    });
    expect(ORGANIZATION_REF['@id']).toBe(org['@id']);
  });

  it('links the one public LinkedIn page', () => {
    expect(CONTACT.linkedin).toBe('https://www.linkedin.com/company/phoenix-energy-solutions');
    expect(organizationJsonLd().sameAs).toEqual([CONTACT.linkedin]);
  });
});

describe('websiteJsonLd', () => {
  it('names the organisation as publisher, and offers the search only when there is something to find', () => {
    expect(websiteJsonLd({ searchable: false })).toMatchObject({ '@type': 'WebSite', url: SITE_URL, inLanguage: 'en-ZA', publisher: ORGANIZATION_REF });
    expect(websiteJsonLd({ searchable: false })).not.toHaveProperty('potentialAction');
    expect(websiteJsonLd({ searchable: true }).potentialAction).toMatchObject({ '@type': 'SearchAction', target: `${SITE_URL}/blog?q={search_term_string}` });
  });
});

describe('serviceJsonLd', () => {
  it('points the service at the organisation and says where it is offered', () => {
    expect(serviceJsonLd({ name: 'Wheeling', description: 'Buy renewable energy.', path: '/solutions/wheeling' })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Wheeling',
      description: 'Buy renewable energy.',
      url: `${SITE_URL}/solutions/wheeling`,
      provider: ORGANIZATION_REF,
      areaServed: AREA_SERVED,
    });
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers the trail from 1, home first, with absolute URLs', () => {
    expect(
      breadcrumbJsonLd([HOME_CRUMB, { name: 'Solutions', path: '/solutions' }, { name: 'Wheeling', path: '/solutions/wheeling' }]).itemListElement,
    ).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE_URL}/solutions` },
      { '@type': 'ListItem', position: 3, name: 'Wheeling', item: `${SITE_URL}/solutions/wheeling` },
    ]);
  });
});
