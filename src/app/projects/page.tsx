import type { Metadata } from 'next';
import { sanityClient } from '@/lib/sanity';
import { ALL_PROJECTS_QUERY } from '@/lib/queries';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
import type { ProjectPreview } from '@/types/sanity';
import { PageFooter } from '@/components/layout/PageFooter';

export const metadata: Metadata = {
  title: 'Projects & Installations | Phoenix Energy',
  description:
    'Explore Phoenix Energy\'s portfolio of completed renewable energy projects across Southern Africa — solar, wheeling, EV fleets, carbon credits, and more.',
  alternates: { canonical: 'https://phoenixenergy.solutions/projects' },
  openGraph: {
    title: 'Projects & Installations | Phoenix Energy',
    description: 'Explore Phoenix Energy\'s portfolio of completed renewable energy projects across Southern Africa.',
    url: 'https://phoenixenergy.solutions/projects',
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630 }],
  },
};

export default async function ProjectsPage() {
  let projects: ProjectPreview[] = [];
  try {
    projects = await sanityClient.fetch<ProjectPreview[]>(ALL_PROJECTS_QUERY);
  } catch {
    // Graceful fallback — grid renders empty state
  }
  return (
    <>
      <ProjectsGrid projects={projects} />
      <PageFooter showCta={false} />
    </>
  );
}
