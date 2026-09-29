import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectNext } from './ProjectNext';
import { ProjectBand } from './ProjectBand';
import { REPLY_PROMISE } from '@/config/contact';
import type { ProjectCard } from '@/types/sanity';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const next: ProjectCard = { _id: 'b', title: 'St Andrews Office Park', slug: { current: 'st-andrews-office-park' }, vertical: 'ci-solar-storage', location: 'Germiston', metrics: [], results: [] };
const cta = { label: 'Book a discovery meeting', href: '/contact?m=x' };

describe('ProjectNext', () => {
  it('shows one project as a wide card under "Next project", its pill naming the service', () => {
    const markup = html(createElement(ProjectNext, { related: { heading: 'Next project', layout: 'wide', projects: [next] } }));
    expect(markup).toMatch(/<h2 id="similar-projects"[^>]*>Next project<\/h2>/);
    expect(markup).toContain('C&amp;I Solar &amp; Storage');
    expect(markup).toContain('View project');
    expect(markup).toContain('href="/projects/st-andrews-office-park"');
  });

  it('shows two projects as two large cards under "Similar projects"', () => {
    const markup = html(createElement(ProjectNext, { related: { heading: 'Similar projects', layout: 'two', projects: [next, { ...next, _id: 'c', slug: { current: 'c' } }] } }));
    expect(markup).toContain('Similar projects');
    expect(markup.match(/href="\/projects\//g)).toHaveLength(2);
  });
});

describe('ProjectBand', () => {
  it('keeps its heading and both buttons, the booking one first', () => {
    const markup = html(createElement(ProjectBand, { cta, ctaLocation: 'project_band:a' }));
    expect(markup).toContain('Ready for a similar project?');
    expect(markup).toContain(REPLY_PROMISE.sentence);
    expect([...markup.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1])).toEqual(['/contact?m=x', '/projects']);
  });

  it('keeps the gap between parts itself only when no next project sits above it', () => {
    expect(html(createElement(ProjectBand, { cta, ctaLocation: 'x' }))).not.toContain('lg:mt-11');
    expect(html(createElement(ProjectBand, { cta, ctaLocation: 'x', afterStory: true }))).toContain('lg:mt-11');
  });
});
