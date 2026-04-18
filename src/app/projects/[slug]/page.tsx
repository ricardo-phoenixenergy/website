import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { sanityClient, urlFor } from '@/lib/sanity';
import { PROJECT_BY_SLUG_QUERY, ALL_PROJECT_SLUGS_QUERY } from '@/lib/queries';
import { SOLUTION_META } from '@/types/solutions';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import type { Project } from '@/types/sanity';

export const revalidate = 3600;

const PT_COMPONENTS = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-sm text-[#6B7280] leading-[1.8] mb-3 last:mb-0">
        {children}
      </p>
    ),
  },
};

export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(ALL_PROJECT_SLUGS_QUERY);
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await sanityClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
    if (!project) return { title: 'Project | Phoenix Energy' };
    return {
      title: `${project.title} | Phoenix Energy`,
      description: project.summary,
      openGraph: project.heroImage
        ? { images: [{ url: urlFor(project.heroImage).width(1200).height(630).url() }] }
        : undefined,
    };
  } catch {
    return { title: 'Project | Phoenix Energy' };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project: Project | null = null;
  try {
    project = await sanityClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  } catch {
    // fall through to notFound
  }

  if (!project) notFound();

  const meta = SOLUTION_META[project.vertical];
  const stats = project.metrics?.slice(0, 4) ?? [];

  const sections = [
    { num: '01', tag: 'The Challenge', content: project.challenge },
    { num: '02', tag: 'Our Solution', content: project.solution },
    { num: '03', tag: 'The Outcome', content: project.outcome },
  ];

  return (
    <div className="bg-[#F5F5F5] min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-[960px] mx-auto px-5 pt-5 pb-0">
        <div className="flex items-center gap-1.5 font-body text-sm text-[#6B7280]">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-[#39575C] transition-colors">Projects</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C] truncate" style={{ maxWidth: 200 }}>
            {project.title}
          </span>
        </div>
      </div>

      {/* Hero — split desktop, full-bleed mobile */}
      <div className="max-w-[960px] mx-auto px-5 pt-3">
        <div className="rounded-xl overflow-hidden md:flex md:min-h-[280px]">

          {/* Desktop: dark left panel */}
          <div className="hidden md:flex md:w-1/2 bg-[#0d1f22] p-7 flex-col justify-end">
            <p
              className="font-body font-bold text-xs uppercase tracking-[0.14em] mb-3"
              style={{ color: '#709DA9' }}
            >
              CASE STUDY
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.accent }} />
              <span
                className="font-body font-bold text-xs uppercase tracking-[0.12em] rounded-full px-2.5 py-1"
                style={{ background: `${meta.accent}33`, color: meta.accent }}
              >
                {meta.label}
              </span>
            </div>
            <h1
              className="font-display font-extrabold text-xl text-white leading-[1.2] mb-4"
            >
              {project.title}
            </h1>
            <div className="flex flex-col gap-[5px]">
              {[
                { label: 'Client', value: project.clientName },
                { label: 'Location', value: project.location },
                { label: 'Completed', value: project.completionDate },
                { label: 'Value', value: project.projectValue },
                { label: 'Status', value: project.status === 'in-progress' ? 'In progress' : project.status === 'planned' ? 'Planned' : 'Operational' },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex gap-2">
                  <span
                    className="font-body font-semibold text-xs min-w-[64px]"
                    style={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    {row.label}
                  </span>
                  <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo panel */}
          <div className="relative h-[210px] md:h-auto md:w-1/2 overflow-hidden group">
            {/* Left-edge veil — desktop only */}
            <div
              className="absolute inset-0 z-10 hidden md:block pointer-events-none"
              style={{ background: 'linear-gradient(270deg, transparent 50%, rgba(13,31,34,0.2) 100%)' }}
            />
            {/* Mobile gradient overlay */}
            <div
              className="absolute inset-0 z-10 md:hidden pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.92) 100%)' }}
            />

            {project.heroImage ? (
              <Image
                src={project.heroImage.asset.url}
                alt={project.heroImage.alt ?? project.title}
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.03]"
                placeholder="blur"
                blurDataURL={project.heroImage.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                sizes="(max-width:768px) 100vw, 480px"
                priority
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: `linear-gradient(135deg, ${meta.accent}44, #0d1f22)` }}
              />
            )}

            {/* Mobile: bottom-anchored content */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-[14px] md:hidden">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1 h-1 rounded-full" style={{ background: meta.accent }} />
                <span
                  className="font-body font-bold text-xs uppercase tracking-[0.1em] rounded-full px-2 py-0.5"
                  style={{ background: `${meta.accent}33`, color: meta.accent }}
                >
                  {meta.label}
                </span>
              </div>
              <h1 className="font-display font-extrabold text-base text-white leading-[1.2] mb-1.5">
                {project.title}
              </h1>
              <p
                className="font-body text-xs flex gap-2 flex-wrap"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {project.location && <span>{project.location}</span>}
                {project.completionDate && <span>· {project.completionDate}</span>}
                {project.projectValue && <span>· {project.projectValue}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {stats.length > 0 && (
        <div className="max-w-[960px] mx-auto px-5 mt-3">
          <StatsStrip stats={stats} responsive className="rounded-xl" />
        </div>
      )}

      {/* Body */}
      <div
        className="max-w-[760px] mx-auto px-5 md:px-6 mt-6 mb-0"
      >
        {/* Intro paragraph */}
        {project.summary && (
          <p
            className="font-body font-medium text-base text-[#1A1A1A] leading-[1.7] mb-5 pb-5"
            style={{ borderBottom: '1px solid #E5E7EB' }}
          >
            {project.summary}
          </p>
        )}

        {/* Numbered sections */}
        {sections.map((section, idx) => (
          <div
            key={section.num}
            className="py-[18px]"
            style={{ borderBottom: idx < sections.length - 1 ? '1px solid #E5E7EB' : undefined }}
          >
            {/* Desktop: 2-col */}
            <div className="hidden md:grid gap-5" style={{ gridTemplateColumns: '96px 1fr' }}>
              <div>
                <p
                  className="font-display font-extrabold text-5xl leading-none mb-1"
                  style={{ color: '#E5E7EB' }}
                >
                  {section.num}
                </p>
                <p
                  className="font-body font-bold text-xs uppercase tracking-[0.12em]"
                  style={{ color: '#709DA9' }}
                >
                  {section.tag}
                </p>
              </div>
              <div>
                {section.content && section.content.length > 0 ? (
                  <PortableText value={section.content} components={PT_COMPONENTS} />
                ) : (
                  <p className="font-body text-sm text-[#6B7280] leading-[1.8]">
                    Content coming soon.
                  </p>
                )}
              </div>
            </div>

            {/* Mobile: stacked */}
            <div className="md:hidden">
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="font-display font-extrabold text-2xl leading-none"
                  style={{ color: '#E5E7EB' }}
                >
                  {section.num}
                </span>
                <span
                  className="font-body font-bold text-xs uppercase tracking-[0.12em]"
                  style={{ color: '#709DA9' }}
                >
                  {section.tag}
                </span>
              </div>
              {section.content && section.content.length > 0 ? (
                <PortableText value={section.content} components={PT_COMPONENTS} />
              ) : (
                <p className="font-body text-xs text-[#6B7280] leading-[1.75]">
                  Content coming soon.
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Results strip */}
        {project.results && project.results.length > 0 && (
          <div
            className="rounded-[14px] md:rounded-xl px-5 py-[18px] my-5"
            style={{ background: '#0d1f22' }}
          >
            <p
              className="font-body font-bold text-xs uppercase tracking-[0.14em] mb-3"
              style={{ color: '#709DA9' }}
            >
              PROJECT RESULTS
            </p>

            {/* Desktop: 4-col */}
            <div className="hidden md:grid grid-cols-4 gap-4">
              {project.results.slice(0, 4).map((r, i) => (
                <div
                  key={i}
                  className="text-center"
                  style={
                    i < project.results.length - 1
                      ? { borderRight: '1px solid rgba(255,255,255,0.08)' }
                      : undefined
                  }
                >
                  <p className="font-display font-extrabold text-xl text-white leading-none">
                    {r.value}
                  </p>
                  <p
                    className="font-body text-xs uppercase tracking-[0.07em] mt-1"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {r.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile: 2×2 */}
            <div className="md:hidden grid grid-cols-2 gap-2">
              {project.results.slice(0, 4).map((r, i) => (
                <div
                  key={i}
                  className="rounded-[8px] p-2.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <p className="font-display font-extrabold text-base text-white leading-none">
                    {r.value}
                  </p>
                  <p
                    className="font-body text-xs uppercase tracking-[0.07em] mt-1"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-[960px] mx-auto px-5 mt-2 mb-5">
          <ProjectGallery images={project.gallery} />
        </div>
      )}

      {/* Related projects */}
      {project.related && project.related.length > 0 && (
        <div className="bg-white px-5 py-[18px]">
          <div className="max-w-[960px] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p
                className="font-body font-bold text-xs uppercase tracking-[0.14em]"
                style={{ color: '#6B7280' }}
              >
                SIMILAR PROJECTS
              </p>
              <Link
                href="/projects"
                className="font-body text-sm text-[#39575C] font-semibold hover:underline"
              >
                View all projects →
              </Link>
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              {project.related.map((rel) => (
                <ProjectCard key={rel._id} project={rel} fluid />
              ))}
            </div>

            {/* Mobile: horizontal scroll */}
            <div
              className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-none"
              style={{ scrollbarWidth: 'none' }}
            >
              {project.related.map((rel) => (
                <div key={rel._id} style={{ width: 130, flexShrink: 0 }}>
                  <ProjectCard project={rel} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA banner */}
      <div className="max-w-[960px] mx-auto px-5 py-4">
        <div
          className="rounded-[14px] md:rounded-xl px-5 py-[22px] md:px-[20px] text-center"
          style={{ background: '#39575C' }}
        >
          <h2 className="font-display font-extrabold text-lg md:text-lg text-white mb-2">
            Ready for a similar project?
          </h2>
          <p
            className="font-body text-sm mb-5"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Get a free assessment for your facility in under 48 hours.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link
              href="/contact"
              className="font-body font-semibold text-sm text-[#39575C] rounded-full px-5 py-2.5 transition-colors hover:bg-[#e8e8e8]"
              style={{ background: '#F5F5F5' }}
            >
              Get a Quote
            </Link>
            <Link
              href="/projects"
              className="font-body font-semibold text-sm text-white rounded-full px-5 py-2.5 transition-all hover:bg-white/20"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              View all projects
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
