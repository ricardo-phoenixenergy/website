import Link from 'next/link';
import Image from 'next/image';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { IconArrowRight } from '@/components/ui/Icons';

interface FeaturedProjectCardProps {
  project: ProjectPreview;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const meta = project.vertical ? SOLUTION_META[project.vertical] : null;

  return (
    <Link href={`/projects/${project.slug.current}`} className="group block">
      <article
        className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] overflow-hidden rounded-2xl bg-white transition-all duration-200 group-hover:-translate-y-[5px] group-hover:shadow group-hover:border-[#cccccc]"
        style={{ border: '1px solid #E5E7EB' }}
      >
        {/* Left: photo column */}
        <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
          {project.heroImage ? (
            <Image
              src={project.heroImage.asset.url}
              alt={project.heroImage.alt ?? project.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, 60vw"
              placeholder="blur"
              blurDataURL={project.heroImage.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
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
            style={{ background: 'linear-gradient(to top, rgba(13,31,34,0.82) 0%, rgba(13,31,34,0.15) 55%, transparent 100%)' }}
          />

          {/* Featured badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="font-body font-bold text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-full text-white"
              style={{ background: '#39575C', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              ★ Featured
            </span>
          </div>

          {/* Bottom: title + location overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
            <h2 className="font-display font-extrabold text-2xl text-white leading-[1.2] mb-1">
              {project.title}
            </h2>
            {project.location && (
              <p className="font-body text-sm text-white/60">{project.location}</p>
            )}
          </div>
        </div>

        {/* Right: stats panel */}
        <div
          className="flex flex-col p-6 justify-between border-t border-[#E5E7EB] sm:border-t-0 sm:border-l"
          style={{ background: '#fafafa' }}
        >
          <div>
            {project.summary && (
              <p className="font-body text-sm text-[#6B7280] leading-[1.7] mb-5 line-clamp-4">
                {project.summary}
              </p>
            )}

            {/* Metric tiles — up to 2; hidden if fewer than 2 */}
            {project.metrics && project.metrics.length >= 2 && (
              <div className="flex flex-col gap-3 mb-5">
                {project.metrics.slice(0, 2).map((metric, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3.5"
                    style={{ background: '#fff', border: '1px solid #E5E7EB' }}
                  >
                    <p className="font-display font-extrabold text-xl text-[#39575C] leading-none mb-1">
                      {metric.value}
                    </p>
                    <p className="font-body text-xs text-[#6B7280]">{metric.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-[#E5E7EB]">
            <span
              className="font-body font-bold text-xs text-white rounded-full px-4 py-2 flex items-center gap-1.5"
              style={{ background: '#39575C' }}
            >
              View case study <IconArrowRight />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
