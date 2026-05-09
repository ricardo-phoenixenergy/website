// src/components/sections/ProjectCard.tsx
import Link from 'next/link';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import { Card, CardImage, CardBody, CardFooter, CardArrow } from '@/components/ui/Card';

type ProjectCardWithMetrics = ProjectCardType & {
  metrics?: { label: string; value: string }[];
};

interface ProjectCardProps {
  project: ProjectCardWithMetrics;
  className?: string;
  onClick?: () => void;
  fluid?: boolean;
}

export function ProjectCard({ project, className, onClick, fluid }: ProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;
  const cardStyle = !fluid ? { width: 260, flexShrink: 0 } : undefined;

  const inner = (
    <Card variant="light" pattern={1} className={`h-full ${className ?? ''}`}>
      <CardImage
        src={project.heroImage?.asset.url}
        alt={project.heroImage?.alt ?? project.title}
        height={168}
        blurDataURL={project.heroImage?.asset.metadata?.lqip}
        sizes={
          fluid
            ? '(max-width:640px) 100vw, (max-width:768px) 50vw, 33vw'
            : '260px'
        }
        placeholderStyle={
          meta
            ? { background: `linear-gradient(135deg, ${meta.accent}55 0%, ${meta.accent}22 100%)` }
            : { background: '#E5E7EB' }
        }
      >
        {/* Featured badge — top-right */}
        {project.featured && (
          <span
            className="absolute top-3 right-3 font-body font-bold text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full text-white"
            style={{ background: '#39575C' }}
          >
            ★ Featured
          </span>
        )}
        {/* Category badge — bottom-left */}
        {meta && project.vertical && (
          <span
            className="absolute bottom-3 left-3 font-body font-bold text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
            style={{ background: meta.accent, color: meta.accentText }}
          >
            {meta.label}
          </span>
        )}
      </CardImage>

      <CardBody padding="sm">
        <p className="font-display font-bold text-base text-[#1A1A1A] leading-[1.35] mb-3 line-clamp-2 flex-1">
          {project.title}
        </p>
        {project.metrics && project.metrics.length >= 2 && (
          <div className="flex gap-5 mb-3">
            {project.metrics.slice(0, 2).map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display font-bold text-base text-[#39575C] leading-none">
                  {stat.value}
                </span>
                <span className="font-body text-xs text-[#6B7280] mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <CardFooter variant="light">
        <span className="font-body text-xs text-[#6B7280] truncate pr-2">
          {project.location ?? ''}
        </span>
        <CardArrow variant="light" />
      </CardFooter>
    </Card>
  );

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        }}
        style={cardStyle}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/projects/${project.slug.current}`} className="block" style={cardStyle}>
      {inner}
    </Link>
  );
}
