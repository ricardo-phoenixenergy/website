import type { Metadata } from 'next';
import { sanityClient } from '@/lib/sanity';
import { ALL_PROJECTS_QUERY } from '@/lib/queries';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
import type { ProjectPreview } from '@/types/sanity';

export const metadata: Metadata = {
  title: 'Projects & Installations | Phoenix Energy',
  description:
    'Explore Phoenix Energy\'s portfolio of completed renewable energy projects across Southern Africa — solar, wheeling, EV fleets, carbon credits, and more.',
};

export default async function ProjectsPage() {
  let projects: ProjectPreview[] = [];
  try {
    projects = await sanityClient.fetch<ProjectPreview[]>(ALL_PROJECTS_QUERY);
  } catch {
    // Graceful fallback — grid renders empty state
  }
  return <ProjectsGrid projects={projects} />;
}
