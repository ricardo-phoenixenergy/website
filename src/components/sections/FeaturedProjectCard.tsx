// src/components/sections/FeaturedProjectCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectCard as ProjectCardData } from '@/types/sanity';
import { IconArrowRight } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';
import { isMeasured } from '@/lib/projectResults';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const STATUS_LABEL: Record<NonNullable<ProjectCardData['status']>, string | null> = {
  completed: null,
  'in-progress': 'In progress',
  planned: 'Planned',
};

interface FeaturedProjectCardProps {
  project: ProjectCardData & { summary?: string };
  /** 2 where the card sits straight under the page's H1 (/projects); 3 under a section h2. */
  headingLevel?: 2 | 3;
  /** The pill on the photo. */
  kicker?: string;
  /** Preload the photo: only where the card is the first image on the page. */
  priority?: boolean;
}

/**
 * One project as a wide card, outcomes first like ProjectCard: its first two
 * results (captioned as projected unless an editor marks them measured), then
 * what was installed. A project with no results shows its specs instead.
 */
export function FeaturedProjectCard({
  project,
  headingLevel = 2,
  kicker = 'Featured case study',
  priority = false,
}: FeaturedProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;
  const Title = headingLevel === 2 ? 'h2' : 'h3';
  const outcomes = (project.results ?? []).filter((r) => r.value).slice(0, 2);
  const metrics = (project.metrics ?? []).filter((m) => m.value);
  // No results yet: the specs (up to four, as on ProjectCard) take the outcomes' place.
  const tiles = outcomes.length > 0 ? outcomes : metrics.slice(0, 4);
  const specs = outcomes.length > 0 ? metrics.map((m) => m.value).slice(0, 4) : [];
  const place = [project.location, project.clientName].filter(Boolean).join(' · ');
  const status = project.status ? STATUS_LABEL[project.status] : null;
  const ready = project.caseStudyReady ?? true;

  return (
    <Link href={`/projects/${project.slug.current}`} className="block rounded-2xl">
      <Card variant="light" pattern={1}>
        <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr]">
          {/* Left: photo column — custom layout, not CardImage */}
          <div className="relative overflow-hidden z-10" style={{ minHeight: 260 }}>
            {project.heroImage ? (
              <Image
                src={project.heroImage.asset.url}
                alt=""
                fill
                priority={priority}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 60vw"
                placeholder="blur"
                blurDataURL={project.heroImage.asset.metadata?.lqip ?? DEFAULT_LQIP}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: meta
                    ? `linear-gradient(135deg, ${meta.accent}88 0%, ${meta.accent}33 100%)`
                    : 'linear-gradient(135deg, #39575C 0%, #709DA9 100%)',
                }}
              />
            )}
            {/* Gradient scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(13,31,34,0.82) 0%, rgba(13,31,34,0.15) 55%, transparent 100%)',
              }}
            />
            <div className="absolute top-4 left-4 z-10">
              <span
                className="font-body font-bold text-xs uppercase tracking-[0.08em] px-3 py-1.5 rounded-full text-white bg-pe-primary"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {kicker}
              </span>
            </div>
            {status && (
              <span className="absolute top-4 right-4 z-10 font-body font-semibold text-xs px-2.5 py-1 rounded-full bg-white text-pe-text">
                {status}
              </span>
            )}
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
              <Title className="font-display font-extrabold text-2xl text-white leading-[1.2] mb-1">
                {project.title}
              </Title>
              {/* Full white: over a light photo, 60% white measured 3.1:1 */}
              {place && <p className="font-body text-sm text-white">{place}</p>}
            </div>
          </div>

          {/* Right: outcomes panel, on the card's own white (a tinted panel reads as a card inside the card) */}
          <div className="flex flex-col p-6 justify-between border-t border-pe-border sm:border-t-0 sm:border-l relative z-10">
            <div>
              {outcomes.length > 0 && !isMeasured(project.resultsBasis) && (
                <p className="font-body text-xs text-pe-muted mb-2">Projected results</p>
              )}
              {/* Plain value and label pairs, as on ProjectCard: boxed tiles would be cards inside the card */}
              {tiles.length > 0 && (
                <dl className="flex flex-col gap-4 mb-5">
                  {tiles.map((tile) => (
                    <div key={tile.label} className="flex flex-col-reverse gap-1">
                      <dt className="font-body text-xs text-pe-muted leading-snug">{tile.label}</dt>
                      <dd className="font-display font-extrabold text-2xl text-pe-primary leading-none">{tile.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {specs.length > 0 && (
                <p className="font-body text-xs text-pe-muted leading-relaxed mb-5">{specs.join(' · ')}</p>
              )}
              {project.summary && (
                <p className="font-body text-sm text-pe-muted leading-[1.7] mb-5 line-clamp-3">
                  {project.summary}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end pt-4 border-t border-pe-border">
              <span className="font-body font-bold text-xs text-white rounded-full px-4 py-2 flex items-center gap-1.5 bg-pe-primary">
                {ready ? 'Read case study' : 'View project'} <IconArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
