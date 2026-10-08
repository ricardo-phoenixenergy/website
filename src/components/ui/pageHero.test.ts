// As in projectTop.test.ts, next/image's getImageProps() runs under vitest without a mock.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PageHero } from './PageHero';
import type { SanityImage } from '@/types/sanity';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

const photo: SanityImage = {
  _type: 'image',
  asset: { _id: 'image-hero-4000x2250-jpg', url: 'https://cdn.sanity.io/images/p/production/hero-4000x2250.jpg', metadata: { lqip: 'data:image/jpeg;base64,blur' } },
  alt: 'A meter room',
} as SanityImage;

const badge = { label: 'Energy Optimisation', href: '/solutions/energy-optimisation', accent: '#709DA9', accentText: '#0E2A31' };
const base = { image: photo, alt: 'A meter room', title: 'Ekurhuleni Tariff C', titleId: 'post-title' };

describe('PageHero', () => {
  it('has one H1 with the given id and text, and the section is labelled by it', () => {
    const markup = html(createElement(PageHero, base));
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
    expect(markup).toMatch(/<h1 id="post-title"[^>]*>Ekurhuleni Tariff C<\/h1>/);
    // The preload links come first, hoisted from the photo.
    expect(markup).toMatch(/<section aria-labelledby="post-title"/);
  });

  it('links the badge with its accent colours, and drops it when there is none', () => {
    const markup = html(createElement(PageHero, { ...base, badge }));
    const link = markup.match(/<a [^>]*>Energy Optimisation<\/a>/)?.[0] ?? '';
    expect(link).toContain('href="/solutions/energy-optimisation"');
    expect(link).toContain('style="background:#709DA9;color:#0E2A31"');
    expect(html(createElement(PageHero, base))).not.toContain('<a ');
  });

  it('puts the separator before the second part of the line only when both parts are set', () => {
    const both = html(createElement(PageHero, { ...base, line: { first: 'Ricardo De Sousa', second: '8 October 2026 · 6 min read' } }));
    expect(both).toMatch(/<span class="block md:inline">Ricardo De Sousa<\/span><span class="block md:inline"><span class="hidden md:inline"> · <\/span>8 October 2026 · 6 min read<\/span>/);
    const first = html(createElement(PageHero, { ...base, line: { first: 'Ricardo De Sousa' } }));
    expect(first).toContain('Ricardo De Sousa');
    expect(first).not.toContain('hidden md:inline');
    expect(html(createElement(PageHero, base))).not.toContain('<p ');
  });

  it('shows no photo block on phones without a photo, and the gradient from the fallback accent', () => {
    const markup = html(createElement(PageHero, { ...base, image: null, fallbackAccent: '#709DA9' }));
    expect(markup).not.toContain('<img');
    expect(markup).toMatch(/class="[^"]*aspect-\[4\/3\][^"]*hidden md:block/);
    expect(markup).toContain('linear-gradient(135deg, #709DA944 0%, var(--color-pe-nav-dark) 100%)');
    expect(html(createElement(PageHero, { ...base, image: undefined }))).toContain('background:var(--color-pe-nav-dark)');
  });

  it('names the photo by its alt and sits clear of an overlapping card only when asked', () => {
    const markup = html(createElement(PageHero, base));
    expect(markup).toMatch(/<img alt="A meter room"/);
    expect(markup).toContain('md:pb-10');
    expect(html(createElement(PageHero, { ...base, overlapped: true }))).toContain('md:pb-[92px]');
  });
});
