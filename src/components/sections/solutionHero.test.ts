// SolutionHero is a server component, rendered to markup here like the cards.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SolutionHero } from './SolutionHero';

const base = {
  title: 'Commercial solar in Gauteng, <em>designed, funded and built</em> by one team',
  subtitle: 'For factories.',
  accent: '#E3C58D',
  badge: 'Gauteng',
  heroBg: 'linear-gradient(#000, #111)',
  primaryCta: { label: 'Book a discovery meeting', href: '/contact' },
};
const nav = (markup: string) => markup.match(/<nav[^>]*aria-label="Breadcrumb"[^>]*>(.*?)<\/nav>/)?.[1] ?? '';

describe('SolutionHero', () => {
  it('keeps the solution pages\' trail when no extra crumbs are given', () => {
    const crumbs = nav(renderToStaticMarkup(createElement(SolutionHero, { ...base, badge: 'Wheeling' })));
    expect(crumbs).toContain('href="/solutions"');
    expect(crumbs).not.toContain('href="/solutions/ci-solar-storage"');
    expect(crumbs).toMatch(/>Wheeling<\/span>$/);
  });

  it('puts a location page under its solution in the trail', () => {
    const crumbs = nav(
      renderToStaticMarkup(createElement(SolutionHero, { ...base, trail: [{ label: 'C&I Solar & Storage', href: '/solutions/ci-solar-storage' }] })),
    );
    const order = ['href="/"', 'href="/solutions"', 'href="/solutions/ci-solar-storage"', '>Gauteng</span>'].map((s) => crumbs.indexOf(s));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(crumbs.match(/aria-hidden="true">\/</g)).toHaveLength(3);
  });

  it('wraps the breadcrumb between crumbs, never inside one', () => {
    const markup = renderToStaticMarkup(createElement(SolutionHero, { ...base, trail: [{ label: 'C&I Solar & Storage', href: '/solutions/ci-solar-storage' }] }));
    const navTag = markup.match(/<nav[^>]*aria-label="Breadcrumb"[^>]*>/)?.[0] ?? '';
    expect(navTag).toContain('flex-wrap');
    const crumbs = [...nav(markup).matchAll(/<(?:a|span)(?![^>]*aria-hidden)[^>]*>/g)].map((m) => m[0]);
    expect(crumbs).toHaveLength(4);
    for (const tag of crumbs) expect(tag).toContain('whitespace-nowrap');
  });

  it('uses the badge as the photo alt unless told otherwise', () => {
    const image = 'https://cdn.sanity.io/images/p/production/abc123-1448x1086.png';
    expect(renderToStaticMarkup(createElement(SolutionHero, { ...base, heroImage: image }))).toContain('alt="Gauteng"');
    expect(renderToStaticMarkup(createElement(SolutionHero, { ...base, heroImage: image, imageAlt: 'C&I Solar' }))).toContain('alt="C&amp;I Solar"');
  });

  it('shows the eyebrow above the H1, and nothing when there is none', () => {
    const withEyebrow = renderToStaticMarkup(createElement(SolutionHero, { ...base, eyebrow: 'Commercial solar installers · Gauteng' }));
    expect(withEyebrow.indexOf('Commercial solar installers · Gauteng')).toBeLessThan(withEyebrow.indexOf('<h1'));
    expect(renderToStaticMarkup(createElement(SolutionHero, base))).not.toContain('data-hero-eyebrow');
  });
});
