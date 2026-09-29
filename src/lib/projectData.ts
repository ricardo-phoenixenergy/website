// src/lib/projectData.ts
// Every read of project content goes through here, so the disclosure rules apply
// before anything renders (docs/superpowers/specs/2026-09-29-project-page-design.md).
// The queries leave out the client's name and the project value, and trim image
// fields to what the pages use; discloseProject() drops rand amounts from results
// figures and System rows. The project page and its metadata share one read per
// request (React cache). CMS errors are passed on: each caller decides whether
// to show nothing or to let ISR keep serving the last good page.
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
import { discloseProject } from '@/lib/projectDisclosure';
import { orderForProjectsPage } from '@/lib/projectOrder';
import type { Project, ProjectCard, ProjectPreview } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const project = await sanityServerClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  if (!project) return null;
  return {
    ...discloseProject(project),
    related: (project.related ?? []).map(discloseProject),
    otherProjects: (project.otherProjects ?? []).map(discloseProject),
  };
});

/** /projects, in display order: featured projects first, then the newest. */
export async function getAllProjects(): Promise<ProjectPreview[]> {
  const projects = await sanityServerClient.fetch<ProjectPreview[] | null>(ALL_PROJECTS_QUERY);
  return orderForProjectsPage((projects ?? []).map(discloseProject));
}

/** The home page carousel, in the featured order. */
export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  const projects = await sanityServerClient.fetch<ProjectCard[] | null>(FEATURED_PROJECTS_QUERY);
  return (projects ?? []).map(discloseProject);
}

/** A solution page's projects: its service's newest six. */
export async function getProjectsByVertical(vertical: SolutionVertical): Promise<ProjectCard[]> {
  const projects = await sanityServerClient.fetch<ProjectCard[] | null>(PROJECTS_BY_VERTICAL_QUERY, { vertical });
  return (projects ?? []).map(discloseProject);
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
