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
  it('says "View project" and shows the place without a client name, even if one reached it', () => {
    const withClient = { ...project('a'), clientName: 'Hidden Client Ltd' } as ProjectCardData;
    const markup = html(createElement(ProjectCard, { project: withClient, fluid: true }));
    expect(markup).toContain('View project');
    expect(markup).not.toContain('case study');
    expect(markup).toContain('Cape Town');
    expect(markup).not.toContain('Hidden Client Ltd');
  });
});

describe('FeaturedProjectCard', () => {
  it('carries the "Featured project" pill by default and says "View project"', () => {
    const markup = html(createElement(FeaturedProjectCard, { project: project('a') }));
    expect(markup).toContain('Featured project');
    expect(markup).toContain('View project');
    expect(markup).not.toContain('case study');
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
