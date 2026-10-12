// The location pages' own sections, rendered to markup.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MunicipalityCards } from './MunicipalityCards';
import { ServiceAreaList } from './ServiceAreaList';
import { LocationLinks } from './LocationLinks';
import { ExplainerCards } from './ExplainerCards';
import type { MunicipalityCard } from '@/types/locations';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const text = (markup: string) => markup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const ACCENT = '#E3C58D';

const card: MunicipalityCard = {
  name: 'City Power',
  servesWhere: 'Most of Johannesburg',
  tariff: 'Business customers pay an energy charge and fixed charges.',
  solar: ['Register before you connect.', 'An engineer signs off the design.'],
  recent: 'A new charge applies from July.',
  readMore: { label: 'What the billing change means for your payback', href: '/blog/joburg-solar-billing-change' },
  sources: [{ label: 'City Power', url: 'https://www.citypower.co.za/' }],
  asOf: '2026-10-12',
};

describe('MunicipalityCards', () => {
  const markup = html(createElement(MunicipalityCards, { eyebrow: 'Your municipality, your numbers', heading: 'Who supplies your power', cards: [card], accent: ACCENT }));

  it('gives each supplier a heading, its tariff and its solar steps as a list', () => {
    expect(markup).toMatch(/<h2[^>]*>Who supplies your power<\/h2>/);
    expect(markup).toMatch(/<h3[^>]*>City Power<\/h3>/);
    expect(markup.match(/<li/g)).toHaveLength(2);
    expect(text(markup)).toContain('A new charge applies from July.');
  });

  it('says when the facts were checked and links the source, so a reader can see they are dated', () => {
    expect(text(markup)).toContain('Checked 12 October 2026');
    expect(markup).toContain('href="https://www.citypower.co.za/"');
    expect(markup).toMatch(/href="https:\/\/www\.citypower\.co\.za\/"[^>]*rel="noopener noreferrer"/);
  });

  it('links the article when there is one', () => {
    expect(markup).toContain('href="/blog/joburg-solar-billing-change"');
  });

  it('leaves out the recent-change line and the article link when there are none', () => {
    const bare = html(createElement(MunicipalityCards, { eyebrow: 'e', heading: 'h', cards: [{ ...card, recent: undefined, readMore: undefined }], accent: ACCENT }));
    expect(bare).not.toContain('A new charge');
    expect(bare).not.toContain('/blog/');
  });
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
