import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projectData';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
import { IndexHeader } from '@/components/ui/IndexHeader';
import { PageFooter } from '@/components/layout/PageFooter';
import { JsonLd } from '@/components/layout/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

export const metadata: Metadata = pageMetadata({
  title: 'Projects & Installations',
  // Not every project has results yet, and those shown are projections, so the
  // copy promises neither "results for each project" nor measured outcomes.
  description:
    'Commercial solar and battery installations by Phoenix Energy in South Africa: the site and system for each, with projected results where available.',
  path: '/projects',
  shareDescription: 'Commercial solar and battery installations by Phoenix Energy in South Africa, with projected results where available.',
});

export const revalidate = 3600;

export default async function ProjectsPage() {
  // A CMS error throws, so ISR keeps serving the last good page rather than an
  // empty "coming soon" portfolio.
  const projects = await getAllProjects();

  const header = (
    <IndexHeader
      crumb="Projects"
      eyebrow="Our work"
      title={<>Projects &amp; <em className="not-italic text-pe-primary">installations</em></>}
      intro="Commercial solar and battery installations by Phoenix Energy: the site and system for each project, with projected results where available."
    />
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, { name: 'Projects', path: '/projects' }])} />
      <ProjectsGrid projects={projects} header={header} />
      <PageFooter ctaVariant="centered" />
    </>
  );
}
