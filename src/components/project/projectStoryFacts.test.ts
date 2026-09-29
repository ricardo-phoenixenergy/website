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

  it('columns: the groups side by side across the full width, with the booking row and its sentence', () => {
    const markup = facts('columns');
    expect(markup).toMatch(/<h2 id="project-facts-columns"/);
    // auto-fit, not auto-fill: two groups share the width instead of leaving empty tracks beside them.
    expect(markup).toContain('grid-cols-[repeat(auto-fit,minmax(240px,1fr))]');
    expect(markup).toContain(`Planning something similar? ${REPLY_PROMISE.sentence}`);
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
});
