// The cards are server components (ProjectsGrid is a client one); rendered to markup here.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from './ProjectCard';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { ProjectsGrid } from './ProjectsGrid';
import type { ProjectCard as ProjectCardData, ProjectPreview } from '@/types/sanity';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);
const project = (id: string, extra: Partial<ProjectPreview> = {}): ProjectPreview => ({
  _id: id,
  title: `Project ${id}`,
  slug: { current: id },
  vertical: 'ci-solar-storage',
  location: 'Cape Town',
  status: 'completed',
  metrics: [{ label: 'Solar PV Capacity', value: '82.8 kWp' }],
  results: [{ label: 'Payback period', value: '51 months' }],
  ...extra,
});

describe('ProjectCard', () => {
  it('says "View project" and shows the place', () => {
    const markup = html(createElement(ProjectCard, { project: project('a'), fluid: true }));
    expect(markup).toContain('View project');
    expect(markup).not.toContain('case study');
    expect(markup).toMatch(/<p [^>]*>Cape Town<\/p>/);
  });

  it("names the client after the place when the data carries the name, which the queries allow only with the client's consent", () => {
    const named: ProjectCardData = { ...project('a'), clientName: 'Example Client' };
    expect(html(createElement(ProjectCard, { project: named, fluid: true }))).toMatch(/<p [^>]*>Cape Town · Example Client<\/p>/);
  });
});

describe('FeaturedProjectCard', () => {
  it('carries the "Featured project" pill by default and says "View project"', () => {
    const markup = html(createElement(FeaturedProjectCard, { project: project('a') }));
    expect(markup).toContain('Featured project');
    expect(markup).toContain('View project');
    expect(markup).not.toContain('case study');
  });

  it('names the client after the place when the data carries the name', () => {
    const markup = html(createElement(FeaturedProjectCard, { project: { ...project('a'), clientName: 'Example Client' } }));
    expect(markup).toMatch(/<p [^>]*>Cape Town · Example Client<\/p>/);
  });
});

describe('ProjectsGrid', () => {
  it('leads with the first featured project in the order given, and keeps it out of the grid', () => {
    const projects = [
      project('f1', { featured: true, featuredOrder: 1 }),
      project('f2', { featured: true, featuredOrder: 2 }),
      project('n1'),
      project('n2', { vertical: 'wheeling' }),
      project('n3'),
    ];
    const markup = html(createElement(ProjectsGrid, { projects, header: null }));
    expect(markup).toContain('Featured project');
    expect(markup.split('Project f1').length - 1).toBe(1);
    expect(markup).toContain('No project is published for these yet. See how each one works.');
    expect(markup).not.toContain('case study');
  });
});
