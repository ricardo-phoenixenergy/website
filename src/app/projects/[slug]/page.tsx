import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { sanityClient, urlFor } from '@/lib/sanity';
import { PROJECT_BY_SLUG_QUERY, ALL_PROJECT_SLUGS_QUERY } from '@/lib/queries';
import { SOLUTION_META } from '@/types/solutions';
import { ProjectStatsTiles } from '@/components/ui/ProjectStatsTiles';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { IconArrowRight } from '@/components/ui/Icons';
import type { Project } from '@/types/sanity';
import { PageFooter } from '@/components/layout/PageFooter';

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
    { num: '02', tag: 'Our Solution',  content: project.solution },
    { num: '03', tag: 'The Outcome',   content: project.outcome },
  ];

  const metaRows = [
    { label: 'Client',    value: project.clientName },
    { label: 'Location',  value: project.location },
    { label: 'Completed', value: project.completionDate },
    { label: 'Value',     value: project.projectValue },
    { label: 'Status',    value: project.status === 'in-progress' ? 'In progress' : project.status === 'planned' ? 'Planned' : 'Operational' },
  ].filter((r) => r.value);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">

      {/* Breadcrumb */}
      <div className="page-container pt-24 pb-0">
        <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280]">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-[#39575C] transition-colors">Projects</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C] truncate" style={{ maxWidth: 200 }}>
            {project.title}
          </span>
        </nav>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="page-container pt-3">
        <div className="rounded-2xl overflow-hidden md:flex md:min-h-[380px]">

          {/* Desktop: dark left panel */}
          <div
            className="hidden md:flex md:w-[44%] flex-col justify-between p-8"
            style={{ background: 'linear-gradient(155deg, #1a3a3e 0%, #0d1f22 100%)' }}
          >
            <p className="font-body font-bold text-xs uppercase tracking-[0.14em]" style={{ color: '#709DA9' }}>
              Case Study
            </p>

            <div>
              <span
                className="inline-flex font-body font-bold text-[10px] uppercase tracking-[0.1em] rounded-full px-2.5 py-1 mb-4"
                style={{ background: meta.accent, color: meta.accentText }}
              >
                {meta.label}
              </span>
              <h1 className="font-display font-extrabold text-2xl text-white leading-[1.2] mb-6">
                {project.title}
              </h1>
              <div className="flex flex-col">
                {metaRows.map((row, i, arr) => (
                  <div
                    key={row.label}
                    className="grid items-baseline py-2"
                    style={{
                      gridTemplateColumns: '80px 1fr',
                      columnGap: '10px',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : undefined,
                    }}
                  >
                    <span
                      className="font-body font-bold text-[10px] uppercase tracking-[0.1em]"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="font-body text-xs"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photo panel */}
          <div className="relative h-[280px] md:h-auto md:flex-1 overflow-hidden group">
            {/* Left-edge veil — desktop only */}
            <div
              className="absolute inset-0 z-10 hidden md:block pointer-events-none"
              style={{ background: 'linear-gradient(270deg, transparent 55%, rgba(13,31,34,0.25) 100%)' }}
            />
            {/* Mobile gradient overlay */}
            <div
              className="absolute inset-0 z-10 md:hidden pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(13,31,34,0.05) 0%, rgba(13,31,34,0.88) 100%)' }}
            />

            {project.heroImage ? (
              <Image
                src={project.heroImage.asset.url}
                alt={project.heroImage.alt ?? project.title}
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.03]"
                placeholder="blur"
                blurDataURL={project.heroImage.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                sizes="(max-width:768px) 100vw, 56vw"
                priority
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: `linear-gradient(135deg, ${meta.accent}44 0%, #0d1f22 100%)` }}
              />
            )}

            {/* Mobile: bottom-anchored content */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 md:hidden">
              <span
                className="inline-flex font-body font-bold text-[10px] uppercase tracking-[0.1em] rounded-full px-2.5 py-1 mb-3"
                style={{ background: meta.accent, color: meta.accentText }}
              >
                {meta.label}
              </span>
              <h1 className="font-display font-extrabold text-lg text-white leading-[1.2] mb-2">
                {project.title}
              </h1>
              <p className="font-body text-xs flex gap-2 flex-wrap" style={{ color: 'rgba(255,255,255,0.55)' }}>
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
        <div className="page-container mt-2">
          <ProjectStatsTiles stats={stats} />
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="page-container mt-8 mb-0">

        {/* Intro paragraph */}
        {project.summary && (
          <p
            className="font-body font-medium text-base text-[#1A1A1A] leading-[1.75] mb-6 pb-6"
            style={{ borderBottom: '1px solid #E5E7EB' }}
          >
            {project.summary}
          </p>
        )}

        {/* Numbered sections — single responsive layout */}
        {sections.map((section, idx) => (
          <div
            key={section.num}
            className="py-5 md:grid md:gap-6"
            style={{
              borderBottom: idx < sections.length - 1 ? '1px solid #E5E7EB' : undefined,
              gridTemplateColumns: '96px 1fr',
            }}
          >
            {/* Number + tag: inline flex on mobile, stacked block in left column on desktop */}
            <div className="flex items-baseline gap-2.5 mb-3 md:block md:mb-0">
              <p
                className="font-display font-extrabold text-3xl md:text-5xl leading-none md:mb-2"
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

            {/* Content */}
            <div>
              {section.content && section.content.length > 0 ? (
                <PortableText value={section.content} components={PT_COMPONENTS} />
              ) : (
                <p className="font-body text-sm text-[#6B7280] leading-[1.8]">Content coming soon.</p>
              )}
            </div>
          </div>
        ))}

        {/* Results strip */}
        {project.results && project.results.length > 0 && (
          <div className="rounded-2xl px-5 py-5 my-6" style={{ background: '#0d1f22' }}>
            <p
              className="font-body font-bold text-xs uppercase tracking-[0.14em] mb-4"
              style={{ color: '#709DA9' }}
            >
              Project Results
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0">
              {project.results.slice(0, 4).map((r, i) => (
                <div
                  key={i}
                  className="text-center rounded-xl p-3 bg-white/[0.06] md:rounded-none md:p-0 md:bg-transparent md:[&:not(:last-child)]:border-r md:border-white/[0.08]"
                >
                  <p className="font-display font-extrabold text-lg md:text-xl text-white leading-none">
                    {r.value}
                  </p>
                  <p
                    className="font-body text-xs uppercase tracking-[0.07em] mt-1.5"
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

      {/* ── Gallery ──────────────────────────────────────────────────────────── */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="page-container mt-2 mb-5">
          <ProjectGallery images={project.gallery} />
        </div>
      )}

      {/* ── Related projects ─────────────────────────────────────────────────── */}
      {project.related && project.related.length > 0 && (
        <div className="bg-white py-8">
          <div className="page-container">
            <div className="flex items-center justify-between mb-5">
              <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-[#6B7280]">
                Similar Projects
              </p>
              <Link href="/projects" className="group flex items-center gap-1.5 font-body text-sm text-[#39575C] font-semibold hover:underline">
                View all
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  <IconArrowRight size={13} />
                </span>
              </Link>
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              {project.related.map((rel) => (
                <ProjectCard key={rel._id} project={rel} fluid />
              ))}
            </div>

            {/* Mobile: 2-col grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {project.related.map((rel) => (
                <ProjectCard key={rel._id} project={rel} fluid />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA banner ───────────────────────────────────────────────────────── */}
      <div className="page-container py-5">
        <div
          className="rounded-2xl px-7 py-8 md:px-10 md:py-10"
          style={{
            background: 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Text */}
            <div className="md:max-w-sm">
              <p
                className="font-body font-bold text-xs uppercase tracking-[0.14em] mb-2"
                style={{ color: '#709DA9' }}
              >
                Start your project
              </p>
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-white leading-[1.2] mb-2.5">
                Ready for a similar project?
              </h2>
              <p className="font-body text-sm leading-[1.7]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Get a free assessment for your facility in under 48 hours.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row md:flex-col lg:flex-row flex-shrink-0">
              <Link
                href="/contact"
                className="flex items-center justify-center font-body font-semibold text-sm text-[#39575C] rounded-full px-6 py-3 transition-colors hover:bg-[#e8e8e8]"
                style={{ background: '#F5F5F5' }}
              >
                Get a Quote
              </Link>
              <Link
                href="/projects"
                className="flex items-center justify-center font-body font-semibold text-sm text-white rounded-full px-6 py-3 transition-all hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                View all projects
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
