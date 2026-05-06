'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SOLUTION_META } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { IconArrowRight } from './Icons';
import { ProjectStatsTiles } from './ProjectStatsTiles';
import { dlPush } from '@/lib/analytics';

interface ProjectDrawerProps {
  project: ProjectPreview | null;
  onClose: () => void;
}

export function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const router = useRouter();
  const reduced = useReducedMotion();

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

  useEffect(() => {
    if (!project) return;
    dlPush({
      event: 'drawer_open',
      project_slug: project.slug.current,
      project_vertical: project.vertical ?? '',
    });
  }, [project]);

  const meta = project?.vertical ? SOLUTION_META[project.vertical] : null;

  return (
    <AnimatePresence>
      {project && meta && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduced ? 0 : 0.3 } }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.25 } }}
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(13,31,34,0.5)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={reduced ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0, transition: { duration: reduced ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] } }}
            exit={{ x: '100%', transition: { duration: reduced ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] } }}
            className="fixed top-0 right-0 bottom-0 z-[70] overflow-y-auto flex flex-col"
            style={{ width: 'min(480px, 100vw)', background: '#0d1f22' }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            {/* Photo — taller, badge overlaid on scrim */}
            <div className="relative flex-shrink-0" style={{ height: 220 }}>
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
                  style={{ background: `linear-gradient(135deg, ${meta.accent}55 0%, #0d1f22 100%)` }}
                />
              )}

              {/* Gradient scrim */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(13,31,34,0.75) 0%, rgba(13,31,34,0.1) 55%, transparent 100%)' }}
              />

              {/* Category badge — bottom-left over scrim */}
              <span
                className="absolute bottom-4 left-4 z-10 font-body font-bold text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full"
                style={{ background: meta.accent, color: meta.accentText }}
              >
                {meta.label}
              </span>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute cursor-pointer top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-body text-base transition-colors duration-150"
                style={{ background: 'rgba(13,31,34,0.5)', backdropFilter: 'blur(8px)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-5 flex flex-col gap-4">

              {/* Title */}
              <h2 className="font-display font-extrabold text-xl text-white leading-[1.25]">
                {project.title}
              </h2>

              {/* Meta rows — bare, consistent with dark panel on single project page */}
              <div className="flex flex-col" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { label: 'Client',    value: project.clientName },
                  { label: 'Location',  value: project.location },
                  { label: 'Completed', value: project.completionDate },
                  { label: 'Value',     value: project.projectValue },
                ].filter((r) => r.value).map((row) => (
                  <div
                    key={row.label}
                    className="grid items-baseline py-2"
                    style={{
                      gridTemplateColumns: '80px 1fr',
                      columnGap: '10px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span className="font-body font-bold text-[10px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {row.label}
                    </span>
                    <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Metrics — same ProjectStatsTiles as single project page */}
              {project.metrics && project.metrics.length > 0 && (
                <ProjectStatsTiles stats={project.metrics.slice(0, 4)} />
              )}

              {/* Challenge summary */}
              {project.summary && (
                <div>
                  <p className="font-body font-bold text-xs uppercase tracking-[0.1em] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    The challenge
                  </p>
                  <p className="font-body text-sm leading-[1.7] line-clamp-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {project.summary}
                  </p>
                </div>
              )}

              {/* CTA row */}
              <div className="flex gap-2.5 mt-auto pt-2">
                <button
                  onClick={() => router.push(`/projects/${project.slug.current}`)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 rounded-full py-2.5 font-body font-semibold text-sm text-white transition-colors duration-200 hover:bg-[#2a4045]"
                  style={{ background: '#39575C' }}
                >
                  View full case study <IconArrowRight />
                </button>
                <Link
                  href={`/contact?service=${project.vertical}`}
                  className="flex-shrink-0 flex items-center justify-center px-4 rounded-full py-2.5 font-body font-semibold text-sm text-white transition-all duration-200 hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}
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
