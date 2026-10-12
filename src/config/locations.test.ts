// The location pages' words, checked against the rules in the spec
// (docs/superpowers/specs/2026-10-12-location-pages-design.md).
import { describe, expect, it } from 'vitest';
import { LIFECYCLE, LOCATION_CONTENT, OPERATE_BODY } from './locations';
import { claimValue } from './claims';
import { LOCATION_AREAS } from '@/lib/locationAreas';

/** Every string anywhere inside a value. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

const ALL = [LIFECYCLE, OPERATE_BODY, LOCATION_CONTENT];

describe('location content', () => {
  it('has content for every area', () => {
    expect(Object.keys(LOCATION_CONTENT).sort()).toEqual([...LOCATION_AREAS].sort());
  });

  it('uses no em or en dashes', () => {
    for (const s of strings(ALL)) expect(s, s).not.toMatch(/[–—]/); // en dash, em dash
  });

  it('links only articles on this site from the municipality cards', () => {
    for (const area of LOCATION_AREAS) {
      for (const card of LOCATION_CONTENT[area].municipalities.cards) {
        if (card.readMore) expect(card.readMore.href).toMatch(/^\/blog\//);
      }
    }
    const ekurhuleni = LOCATION_CONTENT.gauteng.municipalities.cards.find((c) => c.name === 'City of Ekurhuleni');
    expect(ekurhuleni?.readMore?.href).toBe('/blog/ekurhuleni-tariff-c-2026-27-switch-to-tariff-e');
  });

  it('never says what Phoenix is not, or turns readers away', () => {
    for (const s of strings(ALL)) expect(s, s).not.toMatch(/\b(we don[’']t|we do not|not just|only for businesses|homeowners|residential)\b/i);
  });

  it('names Pretoria and Centurion on the Gauteng page, which took over their page', () => {
    const g = LOCATION_CONTENT.gauteng;
    expect(g.seoTitle).toContain('Pretoria');
    expect(g.seoDescription).toMatch(/Pretoria, Centurion/);
    expect(g.municipalities.heading).toContain('Pretoria');
    expect(g.municipalities.cards.map((c) => c.id)).toEqual(expect.arrayContaining(['tshwane', 'tshwane-industrial']));
    expect(g.areas.groups.map((x) => x.name)).toEqual(expect.arrayContaining(['Pretoria', 'Centurion']));
    expect(g.faqs.some((f) => /Pretoria or Centurion/.test(f.question))).toBe(true);
  });

  it.each(LOCATION_AREAS)('%s: has a title and description search engines show in full', (area) => {
    const c = LOCATION_CONTENT[area];
    expect(c.seoTitle).toMatch(/^Commercial Solar Installers/);
    expect(c.seoTitle.length).toBeLessThanOrEqual(70);
    expect(c.seoDescription.length).toBeGreaterThanOrEqual(120);
    expect(c.seoDescription.length).toBeLessThanOrEqual(160);
    expect(c.seoDescription).toMatch(/^Commercial solar installers in /);
  });

  it.each(LOCATION_AREAS)('%s: carries the keyword in the eyebrow and one accent phrase in the H1', (area) => {
    const c = LOCATION_CONTENT[area];
    expect(c.eyebrow).toMatch(/^Commercial solar installers · /);
    expect(c.h1.match(/<em>/g)).toHaveLength(1);
  });

  it.each(LOCATION_AREAS)('%s: dates and sources every municipal fact, and ends every list item with a full stop', (area) => {
    for (const card of LOCATION_CONTENT[area].municipalities.cards) {
      expect(card.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(card.sources.length).toBeGreaterThan(0);
      for (const source of card.sources) expect(source.url).toMatch(/^https:\/\//);
      for (const item of card.solar) expect(item, item).toMatch(/\.$/);
    }
  });

  it.each(LOCATION_AREAS)('%s: has five to eight FAQs in plain text, since the answers go into FAQPage markup', (area) => {
    const faqs = LOCATION_CONTENT[area].faqs;
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    expect(faqs.length).toBeLessThanOrEqual(8);
    for (const { question, answer } of faqs) {
      expect(question).toMatch(/\?$/);
      for (const s of [question, answer]) expect(s, s).not.toMatch(/[<>&]/);
    }
  });

  it.each(LOCATION_AREAS)('%s: gives every supplier row a unique anchor, a short key fact and a one-sentence promise', (area) => {
    const cards = LOCATION_CONTENT[area].municipalities.cards;
    const ids = cards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of cards) {
      expect(c.id).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(c.keyFact.length).toBeLessThanOrEqual(45);
      expect(c.weHandle).toMatch(/^We .*\.$/);
    }
    for (const id of LOCATION_CONTENT[area].municipalities.defaultOpen ?? []) expect(ids).toContain(id);
  });

  it('carries the search phrases in visible text', () => {
    const g = strings(LOCATION_CONTENT.gauteng).join(' ');
    for (const phrase of ['Commercial solar installers', 'solar installers in Johannesburg', 'best solar companies in Johannesburg', 'solar installation', 'Pretoria', 'Centurion']) expect(g).toContain(phrase);
  });

  it('names its further reading by slug and gives each page a local close', () => {
    expect(LOCATION_CONTENT.gauteng.articleSlugs).toEqual(['ekurhuleni-tariff-c-2026-27-switch-to-tariff-e']);
    expect(LOCATION_CONTENT.gauteng.closing.heading).toContain('Gauteng');
  });

  it('runs Design, Engineer, Fund, Build, Operate, with Operate the wide card', () => {
    expect(LIFECYCLE.cards.map((c) => c.title)).toEqual(['Design', 'Engineer', 'Fund', 'Build', 'Operate']);
    expect(LIFECYCLE.cards.filter((c) => c.wide).map((c) => c.title)).toEqual(['Operate']);
    expect(LIFECYCLE.cards[4].body).toBe(OPERATE_BODY);
  });

  it('takes the upfront figure from the claims register', () => {
    expect(LIFECYCLE.cards[2].body).toContain(`${claimValue('ci-ppa-upfront')} upfront`);
  });

  it('credits the Tshwane embedded generation rules to their source and drops the Rekord report', () => {
    const cards = LOCATION_CONTENT.gauteng.municipalities.cards;
    const url = 'https://www.tshwane.gov.za/wp-content/uploads/2025/08/Proposed-Embedded-Generation-Policy-to-support-and-formalise-procedure.pdf';
    for (const id of ['tshwane', 'tshwane-industrial']) {
      const source = cards.find((c) => c.id === id)?.sources.find((x) => x.url === url);
      expect(source?.label).toBe('City of Tshwane embedded generation requirements, republished with its proposed policy (August 2025)');
    }
    const industrial = cards.find((c) => c.id === 'tshwane-industrial');
    expect(industrial?.solar[0]).toMatch(/^The City’s embedded generation requirements say /);
    expect(industrial?.solar[1]).toMatch(/^The same requirements limit /);
    expect(industrial?.recent).toBe('Nissan agreed in January 2026 to sell its Rosslyn plant to Chery, which has chosen Tshwane as its new manufacturing base.');
    expect(industrial?.sources.some((x) => x.label.startsWith('Rekord'))).toBe(false);
  });
});
