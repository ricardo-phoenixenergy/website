'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';

interface ProjectDrawerProps {
  project: ProjectPreview | null;
  onClose: () => void;
}

export function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const router = useRouter();

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (project) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  const meta = project?.vertical ? SOLUTION_META[project.vertical] : null;

  return (
    <AnimatePresence>
      {project && meta && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(13,31,34,0.5)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
            exit={{ x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
            className="fixed top-0 right-0 bottom-0 z-[70] bg-white overflow-y-auto flex flex-col"
            style={{ width: 'min(480px, 100vw)' }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            {/* Photo */}
            <div className="relative flex-shrink-0" style={{ height: 180 }}>
              {project.heroImage ? (
                <Image
                  src={project.heroImage.asset.url}
                  alt={project.heroImage.alt ?? project.title}
                  fill
                  className="object-cover"
                  sizes="480px"
                  placeholder="blur"
                  blurDataURL={project.heroImage.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${meta.accent}55, #0d1f22)` }}
                />
              )}
              {/* Gradient veil */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(13,31,34,0.6) 100%)' }}
              />
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-body text-base transition-colors duration-150"
                style={{ background: 'rgba(13,31,34,0.5)', backdropFilter: 'blur(8px)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-5 flex flex-col gap-4">
              {/* Vertical badge */}
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: meta.accent }}
                />
                <span
                  className="font-body font-bold text-xs uppercase tracking-[0.12em]"
                  style={{ color: meta.accentText }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display font-extrabold text-lg text-[#1A1A1A] leading-[1.25]">
                {project.title}
              </h2>

              {/* Meta list */}
              <div
                className="flex flex-col gap-1.5 py-3"
                style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}
              >
                {[
                  { label: 'Client', value: project.clientName },
                  { label: 'Location', value: project.location },
                  { label: 'Completed', value: project.completionDate },
                  { label: 'Value', value: project.projectValue },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label} className="flex gap-2">
                    <span className="font-body font-semibold text-xs text-[#6B7280] min-w-[64px]">
                      {row.label}
                    </span>
                    <span className="font-body text-xs text-[#1A1A1A]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Metrics 2×2 grid */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {project.metrics.slice(0, 4).map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3"
                      style={{ background: '#F5F5F5', border: '1px solid #E5E7EB' }}
                    >
                      <p className="font-display font-bold text-base text-[#39575C] leading-none mb-0.5">
                        {m.value}
                      </p>
                      <p className="font-body text-xs text-[#6B7280] uppercase tracking-[0.06em]">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Challenge summary */}
              {project.summary && (
                <div>
                  <p className="font-body font-semibold text-sm text-[#1A1A1A] mb-1.5">
                    The challenge
                  </p>
                  <p className="font-body text-sm text-[#6B7280] leading-[1.7] line-clamp-3">
                    {project.summary}
                  </p>
                </div>
              )}

              {/* CTA row */}
              <div className="flex gap-2.5 mt-auto pt-2">
                <button
                  onClick={() => router.push(`/projects/${project.slug.current}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full py-2.5 font-body font-semibold text-sm text-white transition-colors duration-200 hover:bg-[#2a4045]"
                  style={{ background: '#39575C' }}
                >
                  View full case study →
                </button>
                <Link
                  href={`/contact?service=${project.vertical}`}
                  className="flex-shrink-0 flex items-center justify-center px-4 rounded-full py-2.5 font-body font-semibold text-sm text-[#39575C] bg-white border border-[#E5E7EB] hover:border-[#39575C] transition-colors duration-200"
                  onClick={onClose}
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
