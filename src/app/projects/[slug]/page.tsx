// src/app/projects/[slug]/page.tsx
// One template for every project: each part shows only when it has content
// (docs/superpowers/specs/2026-09-29-project-page-design.md, build step 1).
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { urlFor } from '@/lib/sanity';
import { getProjectBySlug, getProjectSlugs } from '@/lib/projectData';
import { describeResults } from '@/lib/projectResults';
import { galleryWithoutHero } from '@/lib/projectPhotos';
import { projectChapters } from '@/lib/projectStory';
import { projectFacts } from '@/lib/projectFacts';
import { projectArticleJsonLd, projectBreadcrumbJsonLd, projectDescription, SITE_URL } from '@/lib/projectSeo';
import { selectRelated } from '@/lib/relatedProjects';
import { projectCta } from '@/config/ctas';
import { JsonLd } from '@/components/layout/JsonLd';
import { ProjectBreadcrumb } from '@/components/project/ProjectBreadcrumb';
import { ProjectHero } from '@/components/project/ProjectHero';
import { ProjectResults } from '@/components/project/ProjectResults';
import { ProjectPhotos } from '@/components/project/ProjectPhotos';
import { ProjectStory } from '@/components/project/ProjectStory';
import { ProjectNext } from '@/components/project/ProjectNext';
import { ProjectBand } from '@/components/project/ProjectBand';

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    return (await getProjectSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  const description = projectDescription(project);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description,
      url: `/projects/${slug}`,
      ...(project.heroImage?.asset ? { images: [{ url: urlFor(project.heroImage).width(1200).height(630).url() }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  // Only a missing project is a 404. A CMS error throws, so the error page (or,
  // on revalidation, the last good static page) is served instead of a cached 404.
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const url = `${SITE_URL}/projects/${slug}`;
  const shareImage = project.heroImage?.asset ? urlFor(project.heroImage).width(1200).height(630).url() : undefined;
  const results = project.results ?? [];
  const photos = galleryWithoutHero(project.gallery, project.heroImage);
  const related = selectRelated(project.related ?? [], project.otherProjects ?? []);
  const cta = projectCta(project.vertical, project.title);

  return (
    <div className="min-h-screen bg-pe-bg">
      <JsonLd data={projectArticleJsonLd(project, { url, imageUrl: shareImage })} />
      <JsonLd data={projectBreadcrumbJsonLd(project.title, url)} />

      <ProjectBreadcrumb title={project.title} url={url} />
      <ProjectHero project={project} overlapped={results.length > 0} />
      {results.length > 0 && <ProjectResults results={results} labelling={describeResults(project)} />}
      {photos.length > 0 && <ProjectPhotos photos={photos} />}
      <ProjectStory
        summary={project.summary}
        chapters={projectChapters(project)}
        facts={projectFacts(project)}
        cta={cta}
        ctaLocation={`project_facts:${slug}`}
      />
      {related && <ProjectNext related={related} />}
      <ProjectBand cta={cta} ctaLocation={`project_band:${slug}`} afterStory={!related} />
    </div>
  );
}
