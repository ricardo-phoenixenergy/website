import Link from 'next/link';
import Image from 'next/image';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import { IconArrowRight } from '../ui/Icons';

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

  const inner = (
    <>
      {/* Photo zone — category badge floats over a gradient overlay */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 168 }}>
        {project.heroImage ? (
          <Image
            src={project.heroImage.asset.url}
            alt={project.heroImage.alt ?? project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            placeholder="blur"
            blurDataURL={project.heroImage.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
            sizes={fluid ? '(max-width:640px) 100vw, (max-width:768px) 50vw, 33vw' : '260px'}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: meta ? `linear-gradient(135deg, ${meta.accent}55 0%, ${meta.accent}22 100%)` : '#E5E7EB' }}
          />
        )}

        {/* Gradient scrim — helps badge read over any photo */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,31,34,0.65) 0%, rgba(13,31,34,0.1) 55%, transparent 100%)' }}
        />

        {/* Flagship badge — top-right */}
        {project.featured && (
          <span
            className="absolute top-3 right-3 z-10 font-body font-bold text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full text-white"
            style={{ background: '#39575C' }}
          >
            ★ Featured
          </span>
        )}

        {/* Category badge — bottom-left over scrim */}
        {meta && project.vertical && (
          <span
            className="absolute bottom-3 left-3 z-10 font-body font-bold text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
            style={{ background: meta.accent, color: meta.accentText }}
          >
            {meta.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title clamped to 2 lines */}
        <p className="font-display font-bold text-base text-[#1A1A1A] leading-[1.35] mb-3 line-clamp-2 flex-1">
          {project.title}
        </p>

        {/* Metrics */}
        {project.metrics && project.metrics.length >= 2 && (
          <div className="flex gap-5 mb-3">
            {project.metrics.slice(0, 2).map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display font-bold text-base text-[#39575C] leading-none">
                  {stat.value}
                </span>
                <span className="font-body text-xs text-[#6B7280] mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
          <span className="font-body text-xs text-[#6B7280] truncate pr-2">
            {project.location ?? ''}
          </span>
          <div className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center text-xs text-[#6B7280] flex-shrink-0 transition-all duration-200 group-hover:bg-[#39575C] group-hover:border-[#39575C] group-hover:text-white">
            <IconArrowRight/>
          </div>
        </div>
      </div>
    </>
  );

  // flex flex-col + h-full: card fills its grid cell; photo is fixed, body grows to fill rest
  const sharedClass = `group flex flex-col h-full overflow-hidden rounded-2xl bg-white transition-all duration-200 hover:-translate-y-[5px] hover:shadow hover:border-[#cccccc] ${className ?? ''}`;
  const sharedStyle = {
    border: '1px solid #E5E7EB',
    ...(!fluid ? { width: 260, flexShrink: 0 } : {}),
  };

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
        className={`cursor-pointer ${sharedClass}`}
        style={sharedStyle}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className={sharedClass}
      style={sharedStyle}
    >
      {inner}
    </Link>
  );
}
