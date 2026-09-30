import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projectData';
import { ProjectsGrid } from '@/components/sections/ProjectsGrid';
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
    <>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-5 font-body text-sm text-pe-muted">
        <Link href="/" className="hover:text-pe-primary transition-colors duration-150">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-pe-primary" aria-current="page">Projects</span>
      </nav>
      <div className="mb-8">
        <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-pe-secondary-ink mb-2">
          Our work
        </p>
        <h1 className="font-display font-extrabold text-4xl text-pe-text leading-[1.2] mb-2">
          Projects &amp; <em className="not-italic text-pe-primary">installations</em>
        </h1>
        <p className="font-body text-base text-pe-muted leading-[1.7] max-w-[60ch]">
          Commercial solar and battery installations by Phoenix Energy: the site and system for
          each project, with projected results where available.
        </p>
      </div>
    </>
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([HOME_CRUMB, { name: 'Projects', path: '/projects' }])} />
      <ProjectsGrid projects={projects} header={header} />
      <PageFooter ctaVariant="centered" />
    </>
  );
}
