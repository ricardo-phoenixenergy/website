import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectFacts } from './ProjectFacts';
import { ProjectStory } from './ProjectStory';
import { projectFacts } from '@/lib/projectFacts';
import { projectChapters } from '@/lib/projectStory';
import { REPLY_PROMISE } from '@/config/contact';
import type { PortableTextBlock } from '@/types/sanity';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const block = (text: string, key = 'k'): PortableTextBlock => ({ _type: 'block', _key: key, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }] });
const groups = projectFacts({
  vertical: 'ci-solar-storage',
  location: 'Cape Town',
  status: 'completed',
  completionDate: 'Q2 2026',
  metrics: [
    { label: 'Solar PV Capacity', value: '82.8 kWp' },
    { label: 'Battery Energy Storage Capacity', value: '80 kWh' },
    { label: 'Hybrid Inverter Capacity', value: '90 kW' },
    { label: 'Deal Structure', value: 'Outright Purchase' },
  ],
});
const cta = { label: 'Book a discovery meeting', href: '/contact?service=ci' };
const facts = (variant: 'panel' | 'compact' | 'columns') => html(createElement(ProjectFacts, { groups, variant, cta, ctaLocation: 'project_facts:a' }));

describe('ProjectFacts', () => {
  it('panel: every group, the Service link, the booking button and the reply line', () => {
    const markup = facts('panel');
    expect(markup).toMatch(/<h2 id="project-facts-panel"[^>]*>Project facts<\/h2>/);
    expect(markup.match(/<h3\b/g)).toHaveLength(2);
    expect(markup).toMatch(/<dt[^>]*>Service<\/dt><dd[^>]*><a [^>]*href="\/solutions\/ci-solar-storage"/);
    expect(markup).toContain('href="/contact?service=ci"');
    expect(markup).toContain(REPLY_PROMISE.sentence);
    expect(markup).not.toContain('<details');
  });

  it('compact: the main rows open, and the rest under "All project facts"', () => {
    const [open, closed] = facts('compact').split('<details');
    expect(open).toMatch(/<h2 id="project-facts-compact"/);
    expect(open).toContain('Solar PV Capacity');
    expect(open).not.toContain('Hybrid Inverter Capacity');
    expect(closed).toMatch(/<summary[^>]*>All project facts/);
    expect(closed).toContain('Hybrid Inverter Capacity');
    expect(closed).toContain('Service');
  });

  it("compact: the full panel's 18px heading, with 20px of padding on phones and 24px from 640px", () => {
    const markup = facts('compact');
    expect(markup).toMatch(/<section [^>]*class="[^"]*\bp-5 sm:p-6\b/);
    expect(markup).toMatch(/<h2 id="project-facts-compact" class="[^"]*\btext-lg\b/);
  });

  it('columns: one column per group, with the booking row and its sentence', () => {
    const markup = facts('columns');
    expect(markup).toMatch(/<h2 id="project-facts-columns"/);
    // Two groups, two columns (factColumnsClass in src/lib/projectFacts.ts).
    expect(markup).toContain('class="mt-3 grid gap-x-8 gap-y-4 grid-cols-2"');
    expect(markup).toContain(`Planning something similar? ${REPLY_PROMISE.sentence}`);
  });

  it('puts each Financing option and each approval on its own line, the options linking to the financing section', () => {
    const withLines = projectFacts({
      vertical: 'ci-solar-storage',
      financing: ['outright-purchase', 'ppa'],
      approvals: ['Municipal SSEG approval', 'Certificate of Compliance'],
    });
    const markup = html(createElement(ProjectFacts, { groups: withLines, variant: 'panel', cta, ctaLocation: 'x' }));
    expect(markup).toMatch(
      /<dt[^>]*>Financing<\/dt><dd[^>]*><span class="block"><a [^>]*href="\/solutions\/ci-solar-storage#financing"[^>]*>Outright Purchase<\/a><\/span><span class="block"><a [^>]*>Power Purchase Agreement \(PPA\)<\/a><\/span><\/dd>/,
    );
    expect(markup).toMatch(/<dt[^>]*>Approvals<\/dt><dd[^>]*><span class="block">Municipal SSEG approval<\/span><span class="block">Certificate of Compliance<\/span><\/dd>/);
    expect(markup.match(/<h3\b/g)).toHaveLength(2);
  });
});

describe('ProjectStory', () => {
  const chapters = projectChapters({ challenge: [block('Peak tariffs landed on the busiest hours.')], outcome: [block('Lower costs.')] });

  it('with a story: the lead, the compact facts, the chapters, then the panel, in that order', () => {
    const markup = html(createElement(ProjectStory, { summary: 'The lead paragraph.', chapters, facts: groups, cta, ctaLocation: 'project_facts:a' }));
    const order = ['The lead paragraph.', 'project-facts-compact', 'chapter-challenge', 'chapter-outcome', 'project-facts-panel'].map((s) => markup.indexOf(s));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(markup).toMatch(/<h2 id="chapter-challenge"[^>]*>The challenge<\/h2>/);
  });

  it('without a story: the facts full width in columns, and no chapters', () => {
    const markup = html(createElement(ProjectStory, { summary: null, chapters: [], facts: groups, cta, ctaLocation: 'project_facts:a' }));
    expect(markup).toContain('project-facts-columns');
    expect(markup).toContain('project-facts-compact');
    expect(markup).not.toContain('project-facts-panel');
    expect(markup).not.toContain('chapter-');
  });

  it('gives a project whose chapters hold only images or empty text the no-story layout', () => {
    const imageOnly = projectChapters({ solution: [{ _type: 'image', _key: 'i', asset: { _ref: 'image-x-10x10-png' } }], outcome: [block('  ')] });
    const markup = html(createElement(ProjectStory, { summary: null, chapters: imageOnly, facts: groups, cta, ctaLocation: 'x' }));
    expect(markup).toContain('project-facts-columns');
  });

  it('renders the story text as paragraphs and leaves images out', () => {
    const withImage = projectChapters({ solution: [block('A battery twice a day.'), { _type: 'image', _key: 'img', asset: { _ref: 'image-x-10x10-png' } }] });
    const markup = html(createElement(ProjectStory, { summary: null, chapters: withImage, facts: groups, cta, ctaLocation: 'x' }));
    expect(markup).toMatch(/<p class="[^"]*">A battery twice a day\.<\/p>/);
    expect(markup).not.toContain('<img');
  });

  it("makes a chapter's headline its h2, under the label, and keeps the label as the h2 without one", () => {
    const headlined = projectChapters({
      challenge: [block('Peak tariffs.')],
      challengeHeadline: 'Peak tariffs landed on the busiest hours',
      outcome: [block('Lower costs.')],
    });
    const markup = html(createElement(ProjectStory, { summary: null, chapters: headlined, facts: groups, cta, ctaLocation: 'x' }));
    expect(markup).toMatch(
      /<p class="[^"]*uppercase[^"]*">The challenge<\/p><h2 id="chapter-challenge" class="[^"]*text-\[26px\][^"]*">Peak tariffs landed on the busiest hours<\/h2>/,
    );
    expect(markup).toMatch(/<h2 id="chapter-outcome" class="[^"]*uppercase[^"]*">The outcome<\/h2>/);
    expect(markup.match(/<h2 id="chapter-/g)).toHaveLength(2);
  });
});
