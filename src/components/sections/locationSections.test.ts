// The location pages' own sections, rendered to markup.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SupplierAccordion, rowIdFromHash } from './SupplierAccordion';
import { ServiceAreaList } from './ServiceAreaList';
import { LocationLinks } from './LocationLinks';
import { ExplainerCards } from './ExplainerCards';
import type { MunicipalityCard } from '@/types/locations';
import type { ProjectCard as ProjectCardData } from '@/types/sanity';
import { AreaProjects } from './AreaProjects';
import { PartnerBand } from './PartnerBand';
import { WEG_BAND } from '@/config/wegPartner';
import { claimValue } from '@/config/claims';
import { ProjectAreaLink } from '@/components/project/ProjectAreaLink';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const text = (markup: string) => markup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const ACCENT = '#E3C58D';

const row = (id: string, name: string): MunicipalityCard => ({
  id,
  name,
  servesWhere: 'Most of Johannesburg',
  keyFact: 'Up 8.63% on average from 1 July 2026',
  weHandle: 'We prepare the registration and follow it up.',
  tariff: 'Business customers pay an energy charge and fixed charges.',
  solar: ['Register before you connect.', 'An engineer signs off the design.'],
  recent: 'A new charge applies from July.',
  readMore: { label: 'Read the article', href: '/blog/a-post' },
  sources: [{ label: 'City Power', url: 'https://www.citypower.co.za/' }],
  asOf: '2026-10-12',
});
const help = { text: 'Not sure who supplies you? The name on your electricity bill tells you.', linkLabel: 'Send us a bill', href: '/contact' };

describe('SupplierAccordion', () => {
  const markup = html(createElement(SupplierAccordion, {
    eyebrow: 'Your municipality, your numbers',
    heading: 'Johannesburg tariffs and solar rules',
    subtitle: 'Each supplier sets its own rules.',
    cards: [row('city-power', 'City Power'), row('eskom', 'Eskom (direct supply)')],
    help,
    accent: ACCENT,
  }));

  it('shows each supplier as a button row with its anchor, where it supplies and its key fact', () => {
    expect(markup).toMatch(/<h2[^>]*>Johannesburg tariffs and solar rules<\/h2>/);
    expect(markup).toContain('id="city-power"');
    expect(markup).toContain('id="eskom"');
    expect(markup.match(/<button[^>]*aria-expanded="false"/g)).toHaveLength(2);
    expect(text(markup)).toContain('Up 8.63% on average from 1 July 2026');
    expect(text(markup)).toContain('Most of Johannesburg');
  });

  it('keeps every panel in the page, collapsed but findable, and labelled by its button', () => {
    const panels = markup.match(/<div[^>]*role="region"[^>]*>/g) ?? [];
    expect(panels).toHaveLength(2);
    for (const p of panels) {
      expect(p).toMatch(/hidden="until-found"|hidden=""/);
      expect(p).toMatch(/aria-labelledby="[^"]+"/);
    }
    const controls = [...markup.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1]);
    for (const id of controls) expect(markup).toContain(`id="${id}"`);
    expect(text(markup)).toContain('Register before you connect.');
  });

  it('leads the panel with what Phoenix handles, lists the steps in order, and dates the sources', () => {
    const t = text(markup);
    expect(t.indexOf('We prepare the registration')).toBeLessThan(t.indexOf('Business customers pay'));
    expect(markup).toMatch(/<ol[^>]*>\s*<li/);
    expect(t).toContain('Checked 12 October 2026');
    expect(markup).toMatch(/href="https:\/\/www\.citypower\.co\.za\/"[^>]*rel="noopener noreferrer"/);
  });

  it('opens the rows named in defaultOpen', () => {
    const open = html(createElement(SupplierAccordion, {
      eyebrow: 'e', heading: 'h', subtitle: 's', cards: [row('tshwane', 'City of Tshwane')], help, accent: ACCENT, defaultOpen: ['tshwane'],
    }));
    expect(open).toMatch(/<button[^>]*aria-expanded="true"/);
    expect(open.match(/<div[^>]*role="region"[^>]*>/)?.[0]).not.toMatch(/hidden=/);
  });

  it('shows the help box with its link', () => {
    expect(text(markup)).toContain('The name on your electricity bill tells you.');
    expect(markup).toContain('href="/contact"');
  });
});

describe('rowIdFromHash', () => {
  const ids = new Set(['city-power', 'eskom']);
  it('returns the row a hash names', () => expect(rowIdFromHash('#city-power', ids)).toBe('city-power'));
  it('returns null for an unknown id or an empty hash', () => {
    expect(rowIdFromHash('#nowhere', ids)).toBeNull();
    expect(rowIdFromHash('', ids)).toBeNull();
    expect(rowIdFromHash('#', ids)).toBeNull();
  });
  it('returns null for a malformed hash instead of throwing', () => expect(rowIdFromHash('#%E0%A4%A', ids)).toBeNull());
});

describe('ServiceAreaList', () => {
  const markup = html(
    createElement(ServiceAreaList, {
      eyebrow: 'Where we work',
      heading: 'Across Gauteng',
      groups: [{ name: 'Ekurhuleni', places: ['Germiston', 'Kempton Park'] }],
      sister: { heading: 'Based in Pretoria or Centurion?', body: 'Tshwane has its own tariffs.', label: 'Commercial solar in Pretoria and Centurion', href: '/solutions/ci-solar-storage/pretoria-centurion' },
      accent: ACCENT,
    }),
  );

  it('lists each municipality’s places', () => {
    expect(markup).toMatch(/<h3[^>]*>Ekurhuleni<\/h3>/);
    expect(text(markup)).toContain('Germiston');
    expect(text(markup)).toContain('Kempton Park');
  });

  it('hands the reader to the other location page', () => {
    expect(markup).toContain('href="/solutions/ci-solar-storage/pretoria-centurion"');
    expect(text(markup)).toContain('Based in Pretoria or Centurion?');
  });
});

describe('LocationLinks', () => {
  it('links each location page with its line', () => {
    const markup = html(
      createElement(LocationLinks, {
        heading: 'Where we install',
        links: [{ label: 'Gauteng', href: '/solutions/ci-solar-storage/gauteng', line: 'Johannesburg, Ekurhuleni and the Vaal.' }],
        accent: ACCENT,
      }),
    );
    expect(markup).toContain('href="/solutions/ci-solar-storage/gauteng"');
    expect(text(markup)).toContain('Johannesburg, Ekurhuleni and the Vaal.');
  });
});

describe('LocationLinks top padding', () => {
  const props = { heading: 'h', links: [], accent: ACCENT };
  it('pads the top by default and not when flush', () => {
    expect(html(createElement(LocationLinks, props))).toContain('pt-16 md:pt-24');
    expect(html(createElement(LocationLinks, { ...props, flushTop: true }))).not.toContain('pt-16');
  });
});

describe('ExplainerCards', () => {
  it('lets one card span two columns', () => {
    const markup = html(
      createElement(ExplainerCards, {
        cards: [
          { icon: 'Sun', title: 'Design', body: 'b' },
          { icon: 'Activity', title: 'Operate', body: 'b', wide: true },
        ],
      }),
    );
    expect(markup.match(/md:col-span-2/g)).toHaveLength(1);
  });
});

describe('AreaProjects', () => {
  const projectCard = (id: string): ProjectCardData => ({
    _id: id,
    title: `Project ${id}`,
    slug: { current: id },
    vertical: 'ci-solar-storage',
    location: 'Cape Town',
    status: 'completed',
    metrics: [{ label: 'Solar PV Capacity', value: '82.8 kWp' }],
    results: [{ label: 'Payback period', value: '51 months' }],
  });
  const props = (n: number) => ({
    eyebrow: 'Our work in Gauteng',
    heading: 'Commercial solar projects in Gauteng',
    accent: ACCENT,
    projects: Array.from({ length: n }, (_, i) => projectCard(`p${i}`)),
  });

  it('renders nothing without projects', () => {
    expect(html(createElement(AreaProjects, props(0)))).toBe('');
  });

  it('shows one project as one wide card, with no empty grid cells', () => {
    const m = html(createElement(AreaProjects, props(1)));
    expect(m).toMatch(/<h2[^>]*>Commercial solar projects in Gauteng<\/h2>/);
    expect(m.match(/href="\/projects\/p0"/g)).toHaveLength(1);
    expect(m).not.toMatch(/md:grid-cols-3/);
  });

  it('matches the row to the count for two and three', () => {
    expect(html(createElement(AreaProjects, props(2)))).toMatch(/md:grid-cols-2/);
    expect(html(createElement(AreaProjects, props(3)))).toMatch(/md:grid-cols-3/);
  });

  it('leads with a wide card when there are four or more, then the rest', () => {
    const m = html(createElement(AreaProjects, props(4)));
    for (let i = 0; i < 4; i += 1) expect(m).toContain(`href="/projects/p${i}"`);
  });

  it('links to all projects', () => {
    expect(html(createElement(AreaProjects, props(1)))).toContain('href="/projects"');
  });
});

describe('PartnerBand', () => {
  const logo = { url: 'https://cdn.sanity.io/x.png', alt: 'WEG logo', width: 512, height: 512 };

  it('states the partnership, the two WEG figures from the claims register, credited to WEG, and the three points', () => {
    const m = html(createElement(PartnerBand, { content: WEG_BAND, logo }));
    const t = text(m);
    expect(m).toMatch(/<h2[^>]*>Backed by WEG, from panel to motor<\/h2>/);
    expect(t).toContain(claimValue('weg-solar-capacity'));
    expect(t).toContain(claimValue('weg-countries'));
    expect(t).toContain('Source: WEG');
    expect(m.match(/<h3/g)).toHaveLength(3);
    expect(m).toContain('alt="WEG logo"');
    expect(m).toMatch(/href="https:\/\/www\.weg\.net"[^>]*rel="noopener noreferrer"/);
  });

  it('still says everything without the logo', () => {
    const m = html(createElement(PartnerBand, { content: WEG_BAND, logo: null }));
    expect(m).not.toContain('<img');
    expect(text(m)).toContain('Since June 2025');
  });
});

describe('ProjectAreaLink', () => {
  it('links a tagged commercial solar project to its area page', () => {
    const m = html(createElement(ProjectAreaLink, { serviceArea: 'gauteng', vertical: 'ci-solar-storage' }));
    expect(m).toContain('href="/solutions/ci-solar-storage/gauteng"');
    expect(text(m)).toContain('More commercial solar in Gauteng');
  });

  it.each([
    ['untagged', { serviceArea: null, vertical: 'ci-solar-storage' }],
    ['another service', { serviceArea: 'gauteng', vertical: 'wheeling' }],
    ['an unknown area', { serviceArea: 'cape-town', vertical: 'ci-solar-storage' }],
  ])('renders nothing for a project that is %s', (_name, props) => {
    expect(html(createElement(ProjectAreaLink, props))).toBe('');
  });
});
