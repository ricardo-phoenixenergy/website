import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectBreadcrumb } from './ProjectBreadcrumb';
import { ProjectHero } from './ProjectHero';
import { ProjectResults } from './ProjectResults';
import type { ProjectMetric } from '@/types/sanity';
import type { ResultsLabelling } from '@/lib/projectResults';

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
  const project = { title: '31 Sacks Circle', vertical: 'ci-solar-storage' as const, location: 'Cape Town', status: 'completed' as const, completionDate: 'Q2 2026' };

  it('has one H1, the service badge linking to its page, and the line under the headline', () => {
    const markup = html(createElement(ProjectHero, { project, overlapped: true }));
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
    expect(markup).toMatch(/<h1 id="project-title"[^>]*>31 Sacks Circle<\/h1>/);
    expect(markup).toMatch(/<a [^>]*href="\/solutions\/ci-solar-storage"[^>]*>C&amp;I Solar &amp; Storage<\/a>/);
    expect(markup).toContain('Cape Town');
    expect(markup).toContain('Completed Q2 2026');
  });

  it('breaks a long unbroken word instead of widening the page', () => {
    expect(html(createElement(ProjectHero, { project, overlapped: false }))).toMatch(/<h1 [^>]*class="[^"]*break-words/);
  });

  it('raises the text above the results card only when there are results', () => {
    expect(html(createElement(ProjectHero, { project, overlapped: true }))).toContain('md:pb-[92px]');
    expect(html(createElement(ProjectHero, { project, overlapped: false }))).toContain('md:pb-10');
  });

  it('shows no photo block on phones when there is no hero photo', () => {
    expect(html(createElement(ProjectHero, { project, overlapped: false }))).toMatch(/class="[^"]*aspect-\[4\/3\][^"]*hidden md:block/);
  });
});

describe('ProjectResults', () => {
  const labelling: ResultsLabelling = { heading: 'Projected results', asOf: '12 June 2026', note: 'Projections from our financial model for this site.' };
  const results: ProjectMetric[] = [
    { label: 'Payback period', value: '51 months' },
    { label: 'Energy bill reduction', value: '41.8%' },
    { label: 'Grid consumption offset', value: '50.4%' },
    { label: 'Peak coverage', value: '>95%' },
    { label: 'A fifth figure', value: '1' },
  ];
  const markup = html(createElement(ProjectResults, { results, labelling }));

  it('keeps the results-heading id, with the basis sentence and the date', () => {
    expect(markup).toMatch(/<h2 id="results-heading"[^>]*>Projected results<\/h2>/);
    expect(markup).toContain('as of 12 June 2026');
    expect(markup).toContain('Projections from our financial model for this site.');
  });

  it('shows up to four figures, each label with its value', () => {
    expect(markup.match(/<dt\b/g)).toHaveLength(4);
    expect(markup).toMatch(/<dt[^>]*>Peak coverage<\/dt><dd[^>]*>&gt;95%<\/dd>/);
    expect(markup).not.toContain('A fifth figure');
  });

  it('links to the disclaimer', () => {
    expect(markup).toMatch(/<a [^>]*href="\/disclaimer"[^>]*>Read the disclaimer/);
  });

  it('renders nothing without results', () => {
    expect(html(createElement(ProjectResults, { results: [], labelling }))).toBe('');
  });
});
