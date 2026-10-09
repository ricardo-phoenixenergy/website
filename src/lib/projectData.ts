// src/lib/projectData.ts
// Every read of project content goes through here. The queries trim image
// fields to what the pages use, and each project's results figures and System
// rows lose any row without both a label and a value, so a label never shows
// without its figure. An ESLint rule keeps the project queries out of every
// other file (eslint.config.mjs). The project page and its metadata share one
// read per request (React cache). CMS errors are passed on: each caller
// decides whether to show nothing or to let ISR keep serving the last good page.
import { cache } from 'react';
import { sanityServerClient } from '@/lib/sanity.server';
import {
  ALL_PROJECT_SLUGS_QUERY,
  ALL_PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SITEMAP_QUERY,
  PROJECTS_BY_VERTICAL_QUERY,
} from '@/lib/queries';
import { orderForProjectsPage } from '@/lib/projectOrder';
import type { Project, ProjectCard, ProjectMetric, ProjectPreview, ProjectResult } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';

/** The rows with both a label and a value. GROQ gives null for a field that isn't set. */
function completeRows<R extends ProjectMetric>(rows: readonly R[] | null | undefined): R[] {
  return (rows ?? []).filter((row) => Boolean(row?.label?.trim() && row?.value?.trim()));
}

type WithFigures = { results?: ProjectResult[] | null; metrics?: ProjectMetric[] | null };

/** A project, or a card, with only its complete results figures and System rows. */
function withCompleteRows<T extends WithFigures>(item: T): T {
  // Only the lists change, and they keep their element types, so this is still a T.
  return { ...item, results: completeRows(item.results), metrics: completeRows(item.metrics) } as T;
}

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const project = await sanityServerClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  if (!project) return null;
  return {
    ...withCompleteRows(project),
    related: (project.related ?? []).map(withCompleteRows),
    otherProjects: (project.otherProjects ?? []).map(withCompleteRows),
  };
});

/** /projects, in display order: featured projects first, then the newest. */
export async function getAllProjects(): Promise<ProjectPreview[]> {
  const projects = await sanityServerClient.fetch<ProjectPreview[] | null>(ALL_PROJECTS_QUERY);
  return orderForProjectsPage((projects ?? []).map(withCompleteRows));
}

/** The home page carousel, in the featured order. */
export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  const projects = await sanityServerClient.fetch<ProjectCard[] | null>(FEATURED_PROJECTS_QUERY);
  return (projects ?? []).map(withCompleteRows);
}

/** A solution page's projects: its service's newest six. */
export async function getProjectsByVertical(vertical: SolutionVertical): Promise<ProjectCard[]> {
  const projects = await sanityServerClient.fetch<ProjectCard[] | null>(PROJECTS_BY_VERTICAL_QUERY, { vertical });
  return (projects ?? []).map(withCompleteRows);
}

export async function getProjectSlugs(): Promise<string[]> {
  const slugs = await sanityServerClient.fetch<Array<string | null> | null>(ALL_PROJECT_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => Boolean(slug));
}

export interface ProjectSitemapEntry {
  slug: string;
  updatedAt: string;
}

export async function getProjectSitemapEntries(): Promise<ProjectSitemapEntry[]> {
  const rows = await sanityServerClient.fetch<Array<{ slug: string | null; _updatedAt: string }> | null>(PROJECT_SITEMAP_QUERY);
  return (rows ?? []).flatMap((row) => (row.slug ? [{ slug: row.slug, updatedAt: row._updatedAt }] : []));
}
