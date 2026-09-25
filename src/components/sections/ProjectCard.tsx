// src/components/sections/ProjectCard.tsx
import Link from 'next/link';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import { Card, CardImage, CardBody, CardFooter, CardArrow } from '@/components/ui/Card';
import { isMeasured } from '@/lib/projectResults';

interface ProjectCardProps {
  project: ProjectCardType;
  className?: string;
  /** Fill the parent's width (grids) instead of the 260px carousel width. */
  fluid?: boolean;
  /** Roomier padding and type for layouts with only a few projects. */
  size?: 'default' | 'large';
  /** 2 where the cards sit straight under the page's H1 (/projects); 3 under a section h2. */
  headingLevel?: 2 | 3;
}

const STATUS_LABEL: Record<NonNullable<ProjectCardType['status']>, string | null> = {
  completed: null,
  'in-progress': 'In progress',
  planned: 'Planned',
};

/**
 * A project as a link to its case study, outcomes first: the first two results
 * (captioned as projected unless an editor marks them measured), then what was
 * installed (one spec line).
 */
export function ProjectCard({ project, className, fluid, size = 'default', headingLevel = 3 }: ProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;
  const large = size === 'large';
  const Title = headingLevel === 2 ? 'h2' : 'h3';
  const outcomes = (project.results ?? []).filter((r) => r.value).slice(0, 2);
  const specs = (project.metrics ?? []).map((m) => m.value).filter(Boolean).slice(0, 4);
  const place = [project.location, project.clientName].filter(Boolean).join(' · ');
  const status = project.status ? STATUS_LABEL[project.status] : null;
  const ready = project.caseStudyReady ?? true;

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="block h-full rounded-2xl"
      style={fluid ? undefined : { width: 260, flexShrink: 0 }}
    >
      <Card variant="light" pattern={1} className={`h-full ${className ?? ''}`}>
        <CardImage
          src={project.heroImage?.asset.url}
          alt=""
          aspectRatio="16 / 10"
          blurDataURL={project.heroImage?.asset.metadata?.lqip}
          sizes={fluid ? (large ? '(max-width:768px) 100vw, 50vw' : '(max-width:640px) 100vw, (max-width:768px) 50vw, 33vw') : '260px'}
          placeholderStyle={
            meta
              ? { background: `linear-gradient(135deg, ${meta.accent}55 0%, ${meta.accent}22 100%)` }
              : { background: 'var(--color-pe-border)' }
          }
        >
          {meta && (
            <span
              className="absolute bottom-3 left-3 font-body font-bold text-xs uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
              style={{ background: meta.accent, color: meta.accentText }}
            >
              {meta.label}
            </span>
          )}
          {status && (
            <span className="absolute top-3 right-3 font-body font-semibold text-xs px-2.5 py-1 rounded-full bg-white text-pe-text">
              {status}
            </span>
          )}
        </CardImage>

        <CardBody padding={large ? 'lg' : 'sm'}>
          <Title className={`font-display font-bold text-pe-text leading-[1.3] ${large ? 'text-xl' : 'text-lg'}`}>
            {project.title}
          </Title>
          {place && <p className="font-body text-sm text-pe-muted mt-1">{place}</p>}

          {outcomes.length > 0 && (
            <div className="mt-4">
              {!isMeasured(project.resultsBasis) && (
                <p className="font-body text-xs text-pe-muted mb-2">Projected results</p>
              )}
              {/* Two columns while each outcome has 8rem; a narrower card stacks them
                  instead of letting a long value run into its neighbour. Values sit
                  at the top, so a label that wraps never pushes its neighbour down. */}
              <dl className="flex flex-wrap gap-4">
                {outcomes.map((r) => (
                  <div key={r.label} className="flex flex-col-reverse justify-end gap-1 grow basis-32">
                    <dt className="font-body text-xs text-pe-muted leading-snug">{r.label}</dt>
                    <dd className={`font-display font-extrabold text-pe-primary leading-none ${large ? 'text-2xl' : 'text-xl'}`}>
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {specs.length > 0 && (
            <p className="font-body text-xs text-pe-muted leading-relaxed mt-4">{specs.join(' · ')}</p>
          )}
        </CardBody>

        <CardFooter variant="light">
          <span className="font-body text-sm font-semibold text-pe-primary">
            {ready ? 'Read case study' : 'View project'}
          </span>
          <CardArrow variant="light" />
        </CardFooter>
      </Card>
    </Link>
  );
}
