import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';
import { sanityServerClient } from '@/lib/sanity.server';
import { PROJECT_BY_SLUG_QUERY, ALL_PROJECT_SLUGS_QUERY } from '@/lib/queries';
import { SOLUTION_META } from '@/types/solutions';
import { ProjectStatsTiles } from '@/components/ui/ProjectStatsTiles';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { FeaturedProjectCard } from '@/components/sections/FeaturedProjectCard';
import { ProjectGallery } from '@/components/sections/ProjectGallery';
import { describeResults } from '@/lib/projectResults';
import { selectRelated } from '@/lib/relatedProjects';
import { PROJECTS_CTA, projectCta } from '@/config/ctas';
import { REPLY_PROMISE } from '@/config/contact';
import type { Project } from '@/types/sanity';

export const revalidate = 3600;

/** A search-snippet length description: whole words, at most `max` characters. */
function snippet(text: string | undefined, max = 155): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

const PT_COMPONENTS = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-base text-pe-text-soft leading-[1.75] mb-4 last:mb-0">
        {children}
      </p>
    ),
  },
};

export async function generateStaticParams() {
  try {
    const slugs = await sanityServerClient.fetch<Array<{ slug: string }>>(ALL_PROJECT_SLUGS_QUERY);
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
  const project = await sanityServerClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  if (!project) return { title: 'Project not found', robots: { index: false } };
  const description = snippet(project.summary);
  const ready = [project.challenge, project.solution, project.outcome].every((b) => b && b.length > 0);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    // A project whose story isn't written yet stays out of search until it is.
    ...(!ready && { robots: { index: false, follow: true } }),
    openGraph: {
      title: project.title,
      description,
      url: `/projects/${slug}`,
      ...(project.heroImage && {
        images: [{ url: urlFor(project.heroImage).width(1200).height(630).url() }],
      }),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Only a missing project is a 404. A CMS error throws, so the error page (or,
  // on revalidation, the last good static page) is served instead of a cached 404.
  const project = await sanityServerClient.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  if (!project) notFound();

  const meta = SOLUTION_META[project.vertical];
  const stats = project.metrics?.slice(0, 4) ?? [];

  // Only sections with content render: an unwritten case study shows what it
  // has instead of "Content coming soon" three times.
  const sections = [
    { key: 'challenge', tag: 'The challenge', content: project.challenge },
    { key: 'solution', tag: 'Our solution', content: project.solution },
    { key: 'outcome', tag: 'The outcome', content: project.outcome },
  ].filter((section) => section.content && section.content.length > 0);
  // Matches the card: "Read case study" only once all three parts are written.
  const isCaseStudy = sections.length === 3;
  // Forecasts are labelled as forecasts: "Measured results" only when the editor says so.
  const resultsLabel = describeResults(project);
  const cta = projectCta(project.vertical, project.title);
  // One related project is a wide card, never one card in a row of three.
  const related = selectRelated(project.related ?? [], project.otherProjects ?? []);

  const metaRows = [
    { label: 'Client',    value: project.clientName },
    { label: 'Location',  value: project.location },
    { label: 'Completed', value: project.completionDate },
    { label: 'Value',     value: project.projectValue },
    { label: 'Status',    value: project.status === 'in-progress' ? 'In progress' : project.status === 'planned' ? 'Planned' : 'Operational' },
  ].filter((r) => r.value);

  return (
    <div className="bg-pe-bg min-h-screen">

      {/* Breadcrumb */}
      <div className="page-container pt-24 pb-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body text-sm text-pe-muted">
          <Link href="/" className="hover:text-pe-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-pe-primary transition-colors">Projects</Link>
          <span>/</span>
          <span className="font-semibold text-pe-primary truncate" style={{ maxWidth: 200 }}>
            {project.title}
          </span>
        </nav>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="page-container pt-3">
        <div className="rounded-2xl overflow-hidden md:flex md:min-h-[380px]">

          {/* Desktop: dark left panel. Its content sits together at the bottom,
              so a project with few details leaves space above, not a gap inside. */}
          <div
            className="hidden md:flex md:w-[44%] flex-col justify-end p-8"
            style={{ background: 'linear-gradient(155deg, #1a3a3e 0%, #0d1f22 100%)' }}
          >
            <p className="font-body font-bold text-xs uppercase tracking-[0.14em] mb-4" style={{ color: 'var(--color-on-dark-muted)' }}>
              {isCaseStudy ? 'Case study' : 'Project'}
            </p>

            <div>
              <span
                className="inline-flex font-body font-bold text-xs uppercase tracking-[0.1em] rounded-full px-2.5 py-1 mb-4"
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
                      className="font-body font-bold text-xs uppercase tracking-[0.1em]"
                      style={{ color: 'var(--color-on-dark-subtle)' }}
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
                className="inline-flex font-body font-bold text-xs uppercase tracking-[0.1em] rounded-full px-2.5 py-1 mb-3"
                style={{ background: meta.accent, color: meta.accentText }}
              >
                {meta.label}
              </span>
              <h1 className="font-display font-extrabold text-lg text-white leading-[1.2] mb-2">
                {project.title}
              </h1>
              <p className="font-body text-xs flex gap-2 flex-wrap" style={{ color: 'var(--color-on-dark-subtle)' }}>
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
          <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--color-pe-border)' }}>
            <p className="font-body font-medium text-lg text-pe-text leading-[1.7] max-w-[56ch]">
              {project.summary}
            </p>
          </div>
        )}

        {/* Numbered sections — single responsive layout */}
        {sections.map((section, idx) => (
          <section
            key={section.key}
            aria-labelledby={`section-${section.key}`}
            className="py-6 md:grid md:gap-8"
            style={{
              borderBottom: idx < sections.length - 1 ? '1px solid var(--color-pe-border)' : undefined,
              gridTemplateColumns: '160px 1fr',
            }}
          >
            <h2
              id={`section-${section.key}`}
              className="font-display font-bold text-lg text-pe-text leading-snug mb-3 md:mb-0 md:pt-0.5"
            >
              {section.tag}
            </h2>

            {/* Content: a reading column of about 75 characters (56ch of Inter) */}
            <div className="max-w-[56ch]">
              <PortableText value={section.content} components={PT_COMPONENTS} />
            </div>
          </section>
        ))}

        {/* Results strip */}
        {project.results && project.results.length > 0 && (
          <section
            aria-labelledby="results-heading"
            className="rounded-2xl px-5 py-5 my-6"
            style={{ background: 'var(--color-pe-nav-dark)' }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
              <h2
                id="results-heading"
                className="font-body font-bold text-xs uppercase tracking-[0.14em]"
                style={{ color: 'var(--color-pe-secondary)' }}
              >
                {resultsLabel.heading}
              </h2>
              {resultsLabel.asOf && (
                <p className="font-body text-xs" style={{ color: 'var(--color-on-dark-subtle)' }}>
                  As of {resultsLabel.asOf}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0">
              {project.results.slice(0, 4).map((r, i) => (
                <div
                  key={i}
                  className="text-center rounded-xl p-3 bg-white/[0.06] md:rounded-none md:px-4 md:py-0 md:bg-transparent md:[&:not(:last-child)]:border-r md:border-white/[0.08]"
                >
                  <p className="font-display font-extrabold text-lg md:text-xl text-white leading-none">
                    {r.value}
                  </p>
                  <p
                    className="font-body text-xs uppercase tracking-[0.07em] mt-1.5"
                    style={{ color: 'var(--color-on-dark-subtle)' }}
                  >
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
            {resultsLabel.note && (
              <p
                className="font-body text-xs leading-relaxed mt-4 max-w-[60ch]"
                style={{ color: 'var(--color-on-dark-muted)' }}
              >
                {resultsLabel.note}
              </p>
            )}
          </section>
        )}
      </div>

      {/* ── Gallery ──────────────────────────────────────────────────────────── */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="page-container mt-2 mb-5">
          <ProjectGallery images={project.gallery} />
        </div>
      )}

      {/* ── Related projects (the id stays `similar-projects` whatever the heading says) ──
          The heading names the section, so the wide card's pill names the service
          rather than repeating it, and the one link to /projects is the CTA's below. */}
      {related && (
        <section aria-labelledby="similar-projects" className="bg-white py-8">
          <div className="page-container">
            <h2 id="similar-projects" className="font-body font-bold text-xs uppercase tracking-[0.14em] text-pe-muted mb-5">
              {related.heading}
            </h2>

            {related.layout === 'wide' ? (
              <FeaturedProjectCard
                project={related.projects[0]}
                headingLevel={3}
                kicker={related.projects[0].vertical ? SOLUTION_META[related.projects[0].vertical].label : 'Project'}
              />
            ) : (
              // One card per row on phones: an outcomes-first card needs the full width there.
              <div className={related.layout === 'three' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
                {related.projects.map((rel) => (
                  <ProjectCard key={rel._id} project={rel} fluid size={related.layout === 'two' ? 'large' : 'default'} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA banner ───────────────────────────────────────────────────────── */}
      <div className="page-container py-5">
        <div
          className="focus-on-dark rounded-2xl px-7 py-8 md:px-10 md:py-10"
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
                style={{ color: 'var(--color-on-dark-subtle)' }}
              >
                Start your project
              </p>
              <h2 className="font-display font-extrabold text-xl md:text-2xl text-white leading-[1.2] mb-2.5">
                Ready for a similar project?
              </h2>
              <p className="font-body text-sm leading-[1.7]" style={{ color: 'var(--color-on-dark-subtle)' }}>
                Tell us about your site. {REPLY_PROMISE.sentence}
              </p>
            </div>

            {/* Buttons: the service's CTA, with this project named in the message */}
            <div className="flex gap-3 flex-col sm:flex-row md:flex-col lg:flex-row flex-shrink-0">
              <Button variant="light" href={cta.href}>
                {cta.label}
              </Button>
              <Button variant="ghost" href={PROJECTS_CTA.href}>
                {PROJECTS_CTA.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
