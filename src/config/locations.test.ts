// The location pages' words, checked against the rules in the spec
// (docs/superpowers/specs/2026-10-12-location-pages-design.md).
import { describe, expect, it } from 'vitest';
import { LIFECYCLE, LOCATION_CONTENT, OPERATE_BODY } from './locations';
import { claimValue } from './claims';
import { LOCATION_AREAS, type LocationArea } from '@/lib/locationAreas';

/** Every string anywhere inside a value. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

const ALL = [LIFECYCLE, OPERATE_BODY, LOCATION_CONTENT];

// The other page's places, which this page's title, H1 and section headings never name (D5).
const FORBIDDEN: Record<LocationArea, RegExp> = {
  gauteng: /pretoria|centurion|tshwane/i,
  'pretoria-centurion': /johannesburg|joburg|ekurhuleni|emfuleni|vaal|gauteng/i,
};

describe('location content', () => {
  it('has content for every area', () => {
    expect(Object.keys(LOCATION_CONTENT).sort()).toEqual([...LOCATION_AREAS].sort());
  });

  it('uses no em or en dashes', () => {
    for (const s of strings(ALL)) expect(s, s).not.toMatch(/[–—]/); // en dash, em dash
  });

  it('never says what Phoenix is not, or turns readers away', () => {
    for (const s of strings(ALL)) expect(s, s).not.toMatch(/\b(we don[’']t|we do not|not just|only for businesses|homeowners|residential)\b/i);
  });

  it.each(LOCATION_AREAS)('%s: keeps the other page’s places out of its title, H1 and headings', (area) => {
    const c = LOCATION_CONTENT[area];
    for (const s of [c.seoTitle, c.eyebrow, c.h1, c.municipalities.heading, c.areas.heading, c.faqHeading]) {
      expect(s, s).not.toMatch(FORBIDDEN[area]);
    }
  });

  it.each(LOCATION_AREAS)('%s: has a title and description search engines show in full', (area) => {
    const c = LOCATION_CONTENT[area];
    expect(c.seoTitle).toMatch(/^Commercial Solar Installers/);
    expect(c.seoTitle.length).toBeLessThanOrEqual(70);
    expect(c.seoDescription.length).toBeGreaterThanOrEqual(120);
    expect(c.seoDescription.length).toBeLessThanOrEqual(160);
    expect(c.seoDescription).toMatch(/^We design, engineer, fund, install and operate/);
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

  it('runs Design, Engineer, Fund, Build, Operate, with Operate the wide card', () => {
    expect(LIFECYCLE.cards.map((c) => c.title)).toEqual(['Design', 'Engineer', 'Fund', 'Build', 'Operate']);
    expect(LIFECYCLE.cards.filter((c) => c.wide).map((c) => c.title)).toEqual(['Operate']);
    expect(LIFECYCLE.cards[4].body).toBe(OPERATE_BODY);
  });

  it('takes the upfront figure from the claims register', () => {
    expect(LIFECYCLE.cards[2].body).toContain(`${claimValue('ci-ppa-upfront')} upfront`);
  });
});
