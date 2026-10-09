// The hero takes its image attributes from next/image's getImageProps(), which
// runs here as it does in the page: under vitest (NODE_ENV "test") the default
// loader skips its remotePatterns check, so no mock is needed.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectBreadcrumb } from './ProjectBreadcrumb';
import { ProjectHero } from './ProjectHero';
import { ProjectResults } from './ProjectResults';
import type { Project, ProjectResult, SanityImage } from '@/types/sanity';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

describe('ProjectBreadcrumb', () => {
  const markup = html(createElement(ProjectBreadcrumb, { title: '31 Sacks Circle', url: 'https://phoenixenergy.solutions/projects/31-sacks-circle' }));

  it('marks the current page and hides the separators from screen readers', () => {
    expect(markup).toContain('aria-label="Breadcrumb"');
    expect(markup).toMatch(/aria-current="page"[^>]*>31 Sacks Circle</);
    expect(markup.match(/aria-hidden="true">\/</g)).toHaveLength(2);
    expect(markup).toContain('href="/projects"');
  });

  it('truncates a long title rather than widening the row, and ends the row with Copy link', () => {
    expect(markup).toMatch(/class="[^"]*truncate[^"]*"[^>]*>31 Sacks Circle</);
    expect(markup).toMatch(/Copy link<\/button>/);
  });
});

describe('ProjectHero', () => {
  const project = { title: '31 Sacks Circle', vertical: 'ci-solar-storage' as const, location: 'Cape Town', status: 'completed' as const, commissionedOn: '2026-06-12' };

  it('has one H1, the service badge linking to its page, and the line under the headline', () => {
    const markup = html(createElement(ProjectHero, { project, overlapped: true }));
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
    expect(markup).toMatch(/<h1 id="project-title"[^>]*>31 Sacks Circle<\/h1>/);
    expect(markup).toMatch(/<a [^>]*href="\/solutions\/ci-solar-storage"[^>]*>C&amp;I Solar &amp; Storage<\/a>/);
    expect(markup).toContain('Cape Town');
    expect(markup).toContain('Completed June 2026');
  });

  it('words the date line by the status: due for a project in progress, planned for one still to start, the status alone without a date', () => {
    const line = (extra: Partial<Project>) => html(createElement(ProjectHero, { project: { ...project, ...extra }, overlapped: false }));
    expect(line({ status: 'in-progress', commissionedOn: '2027-09-01' })).toContain('In progress, due September 2027');
    expect(line({ status: 'planned', commissionedOn: '2027-09-01' })).toContain('Planned for September 2027');
    expect(line({ status: 'planned', commissionedOn: undefined })).toMatch(/>Planned</);
    expect(line({ status: 'completed', commissionedOn: undefined })).toMatch(/>Completed</);
  });

  it("names the client and ignores the old free-text date on a document that still holds the removed fields", () => {
    const old = { ...project, clientName: 'Example Client', showClientName: false, completionDate: 'Q3 2027', commissionedOn: undefined } as unknown as Project;
    const markup = html(createElement(ProjectHero, { project: old, overlapped: false }));
    expect(markup).toContain('Example Client · Cape Town');
    expect(markup).not.toContain('Q3 2027');
    expect(markup).toMatch(/>Completed</);
  });

  it('breaks a long unbroken word instead of widening the page', () => {
    expect(html(createElement(ProjectHero, { project, overlapped: false }))).toMatch(/<h1 [^>]*class="[^"]*break-words/);
  });

  it('raises the text above the results card only when there are results', () => {
    expect(html(createElement(ProjectHero, { project, overlapped: true }))).toContain('md:pb-[92px]');
    expect(html(createElement(ProjectHero, { project, overlapped: false }))).toContain('md:pb-10');
  });

  it("darkens behind a headline of more than one line, from where a one-line title's text ends", () => {
    // The text block's own layer runs from its top to where its bottom padding starts, fading in
    // over the badge row. Its mask leaves out a one-line block's height (115px, 124px from lg),
    // so a one-line title keeps today's scrim and each line above it gets the extra darkness.
    const layer = (markup: string) => markup.match(/<div aria-hidden="true" class="[^"]*--scrim-from[^"]*" style="[^"]*"><\/div>/)?.[0] ?? '';
    const overlapped = html(createElement(ProjectHero, { project, overlapped: true }));
    const clear = html(createElement(ProjectHero, { project, overlapped: false }));
    expect(layer(overlapped)).toMatch(/\bmd:bottom-\[92px\]/);
    expect(layer(clear)).toMatch(/\bmd:bottom-10\b/);
    for (const markup of [overlapped, clear]) {
      const tag = layer(markup);
      expect(tag).toMatch(/\bhidden md:block\b/);
      expect(tag).toContain('md:[--scrim-from:115px] lg:[--scrim-from:124px]');
      expect(tag).toContain('mask-image:linear-gradient(0deg, transparent var(--scrim-from), black calc(var(--scrim-from) + 24px))');
      expect(tag).toContain('color-mix(in srgb, var(--color-pe-nav-dark) 50%, transparent) 40px');
      expect(tag).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      // The text follows the layer in a positioned container, so it paints over the layer.
      expect(markup.indexOf('--scrim-from')).toBeLessThan(markup.indexOf('<h1'));
      expect(markup).toMatch(/<div class="page-container relative\b/);
    }
  });

  it('shows no photo block on phones when there is no hero photo', () => {
    expect(html(createElement(ProjectHero, { project, overlapped: false }))).toMatch(/class="[^"]*aspect-\[4\/3\][^"]*hidden md:block/);
  });

  const heroImage = (alt: string, url = 'https://cdn.sanity.io/images/p/production/hero-4000x2250.jpg'): SanityImage => ({
    _type: 'image',
    asset: { _id: 'image-hero-4000x2250-jpg', url, metadata: { lqip: 'data:image/jpeg;base64,blur' } },
    alt,
  });

  it('names the hero photo by its alt text, or by the title when the alt text is blank', () => {
    const blank = html(createElement(ProjectHero, { project: { ...project, heroImage: heroImage('  ') }, overlapped: true }));
    expect(blank).toMatch(/<img alt="31 Sacks Circle"/);
    const written = html(createElement(ProjectHero, { project: { ...project, heroImage: heroImage('Rooftop solar on the warehouse') }, overlapped: true }));
    expect(written).toMatch(/<img alt="Rooftop solar on the warehouse"/);
  });

  it('heads the page with the headline, else the title', () => {
    const headed = html(createElement(ProjectHero, { project: { ...project, headline: 'Rooftop solar for a Cape Town warehouse' }, overlapped: true }));
    expect(headed).toMatch(/<h1 id="project-title"[^>]*>Rooftop solar for a Cape Town warehouse<\/h1>/);
    const blank = html(createElement(ProjectHero, { project: { ...project, headline: '  ' }, overlapped: true }));
    expect(blank).toMatch(/<h1 id="project-title"[^>]*>31 Sacks Circle<\/h1>/);
  });

  it('starts the line under the headline with the site type, or the client when the data carries the name', () => {
    const site = html(createElement(ProjectHero, { project: { ...project, siteType: 'Logistics warehouse', commissionedOn: '2026-06-12' }, overlapped: true }));
    expect(site).toContain('Logistics warehouse · Cape Town');
    expect(site).toContain('Completed June 2026');
    const named = html(createElement(ProjectHero, { project: { ...project, siteType: 'Logistics warehouse', clientName: 'Example Client' }, overlapped: true }));
    expect(named).toContain('Example Client · Cape Town');
    expect(named).not.toContain('Logistics warehouse');
  });

  it('serves one image in a <picture>: a 5:2 crop from md (48rem, 768px by default) and a 4:3 crop below, each preloaded for its own widths', () => {
    const markup = html(createElement(ProjectHero, { project: { ...project, heroImage: heroImage('A roof') }, overlapped: true }));
    expect(markup.match(/<img\b/g)).toHaveLength(1);
    // The crops' Sanity URLs, encoded inside next/image's srcset: rect=0,325,4000,1600 and rect=500,0,3000,2250.
    expect(markup).toMatch(/<picture><source media="\(min-width: 48rem\)" srcSet="[^"]*rect%3D0%2C325%2C4000%2C1600[^"]*" sizes="\(min-width: 1175px\) 100vw, [^"]*"\/><img /);
    expect(markup).toMatch(/<img [^>]*loading="eager" fetchPriority="high"[^>]*srcSet="[^"]*rect%3D500%2C0%2C3000%2C2250/);
    expect(markup).toMatch(/<link rel="preload" as="image" fetchPriority="high" imageSrcSet="[^"]*rect%3D0%2C325[^"]*" imageSizes="[^"]*" media="\(min-width: 48rem\)"\/>/);
    expect(markup).toMatch(/<link rel="preload" as="image" fetchPriority="high" imageSrcSet="[^"]*rect%3D500%2C0[^"]*" imageSizes="[^"]*" media="not all and \(min-width: 48rem\)"\/>/);
    expect(markup).toContain('data:image/jpeg;base64,blur');
  });

  it('shows the service gradient, not a broken photo, when the photo has no readable size', () => {
    const markup = html(createElement(ProjectHero, { project: { ...project, heroImage: heroImage('A roof', 'https://example.com/photo.jpg') }, overlapped: true }));
    expect(markup).not.toContain('<img');
    expect(markup).toMatch(/class="[^"]*aspect-\[4\/3\][^"]*hidden md:block/);
  });
});

describe('ProjectResults', () => {
  const results: ProjectResult[] = [
    { label: 'Payback period', value: '51 months' },
    { label: 'Energy bill reduction', value: '41.8%' },
    { label: 'Grid consumption offset', value: '50.4%' },
    { label: 'Peak coverage', value: '>95%' },
    { label: 'A fifth figure', value: '1' },
  ];
  const markup = html(createElement(ProjectResults, { results }));

  it('heads the card "Impact", keeping the results-heading id', () => {
    expect(markup).toMatch(/<h2 id="results-heading" class="[^"]*\btext-xs\b[^"]*\buppercase\b[^"]*\btext-pe-muted\b[^"]*">Impact<\/h2>/);
    expect(markup).toContain('aria-labelledby="results-heading"');
  });

  it('shows up to four figures, each label with its value', () => {
    expect(markup.match(/<dt\b/g)).toHaveLength(4);
    expect(markup).toMatch(/<dt[^>]*>Peak coverage<\/dt><dd[^>]*>&gt;95%<\/dd>/);
    expect(markup).not.toContain('A fifth figure');
  });

  it("puts a figure's note under it, inside the list, and nothing for a figure without one", () => {
    const noted = html(createElement(ProjectResults, { results: [{ label: 'Payback period', value: '51 months', note: 'Year 1, against 2025 municipal bills' }, results[1]] }));
    expect(noted).toMatch(/<dt[^>]*>Payback period<\/dt><dd[^>]*>51 months<\/dd><dd class="[^"]*text-xs[^"]*text-pe-muted[^"]*">Year 1, against 2025 municipal bills<\/dd>/);
    expect(noted.match(/<dd\b/g)).toHaveLength(3);
  });

  it('ends after the figures: no basis, date, note, disclosure or disclaimer link', () => {
    for (const text of ['<details', 'How we calculated this', 'disclaimer', 'as of', 'Projected', 'Measured', '<a ']) {
      expect(markup, text).not.toContain(text);
    }
    expect(markup).toMatch(/<\/dl><\/div><\/section>$/);
  });

  it('shows a rand figure as written', () => {
    const rands = html(createElement(ProjectResults, { results: [{ label: 'Off the municipal bill in year one', value: 'R276k' }] }));
    expect(rands).toMatch(/<dt[^>]*>Off the municipal bill in year one<\/dt><dd[^>]*>R276k<\/dd>/);
  });

  it('renders nothing without results', () => {
    expect(html(createElement(ProjectResults, { results: [] }))).toBe('');
  });
});
