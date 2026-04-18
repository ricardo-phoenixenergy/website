import Link from 'next/link';
import Image from 'next/image';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';

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
      {/* Photo — fixed height, never grows */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 148 }}>
        {meta && (
          <div
            className="absolute top-0 inset-x-0 z-10"
            style={{ height: 3, background: meta.accent }}
          />
        )}
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
            style={{ background: meta ? `${meta.accent}33` : '#E5E7EB' }}
          />
        )}
      </div>

      {/* Body — flex-col so footer is always pinned to bottom */}
      <div className="p-3.5 flex flex-col flex-1">
        {meta && project.vertical && (
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: meta.accent }}
            />
            <span
              className="font-body font-semibold text-xs uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
              style={{ background: `${meta.accent}1a`, color: meta.accentText }}
            >
              {meta.label}
            </span>
          </div>
        )}

        {/* Title clamped to 2 lines — prevents card height variation */}
        <p className="font-display font-bold text-base text-[#1A1A1A] leading-[1.35] mb-2.5 line-clamp-2">
          {project.title}
        </p>

        <div className="h-px bg-[#E5E7EB] mb-2.5" />

        {project.metrics && project.metrics.length >= 2 && (
          <div className="flex gap-4 mb-2.5">
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

        {/* Footer always at the bottom */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-body text-xs text-[#6B7280] truncate pr-2">
            {project.location ?? ''}
          </span>
          <div className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center text-xs text-[#6B7280] flex-shrink-0 transition-all duration-200 group-hover:bg-[#39575C] group-hover:border-[#39575C] group-hover:text-white">
            →
          </div>
        </div>
      </div>
    </>
  );

  // flex flex-col + h-full: card fills its grid cell; photo is fixed, body grows to fill rest
  const sharedClass = `group flex flex-col h-full overflow-hidden rounded-2xl bg-white transition-all duration-200 hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(57,87,92,0.12)] hover:border-[#cccccc] ${className ?? ''}`;
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
