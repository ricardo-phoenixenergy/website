'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { ProjectCard } from './ProjectCard';
import { ProjectDrawer } from '@/components/ui/ProjectDrawer';
import { FilterPills } from '@/components/ui/FilterPills';
import { IconArrowRight } from '../ui/Icons';

/* ── Filter pills ────────────────────────────────────────────────────────────── */

const FILTER_PILLS: { key: SolutionVertical | 'all'; label: string }[] = [
  { key: 'all', label: 'All projects' },
  { key: 'ci-solar-storage', label: 'C&I Solar & Storage' },
  { key: 'wheeling', label: 'Wheeling' },
  { key: 'carbon-credits', label: 'Carbon Credits' },
  { key: 'energy-optimisation', label: 'Energy Optimisation' },
  { key: 'ev-fleets', label: 'EV Fleets' },
  { key: 'webuysolar', label: 'WeBuySolar' },
];

/* ── Empty state ─────────────────────────────────────────────────────────────── */

function EmptyState({ vertical }: { vertical: SolutionVertical | 'all' }) {
  const meta = vertical !== 'all' ? SOLUTION_META[vertical] : null;
  return (
    <div className="col-span-full">
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: '#fff', border: '1px dashed #E5E7EB' }}
      >
        {meta && (
          <div className="flex justify-center mb-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `${meta.accent}22` }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: meta.accent }} />
            </span>
          </div>
        )}
        <p className="font-display font-bold text-base text-[#1A1A1A] mb-1.5">
          {vertical === 'all'
            ? 'Projects coming soon'
            : `We're working on our first ${meta?.label} project`}
        </p>
        <p
          className="font-body text-sm text-[#6B7280] leading-[1.7]"
          style={{ maxWidth: 380, margin: '0 auto 20px' }}
        >
          {vertical === 'all'
            ? 'Our portfolio is being built out. Check back soon to see our latest installations across Southern Africa.'
            : `We have exciting work underway in the ${meta?.label} space. Check back soon, or get in touch to discuss your requirements.`}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 font-body font-semibold text-sm text-white rounded-full px-5 py-2.5 transition-colors hover:bg-[#2a4045]"
          style={{ background: '#39575C' }}
        >
          Discuss your project <IconArrowRight />
        </Link>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

interface ProjectsGridProps {
  projects: ProjectPreview[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeFilter, setActiveFilter] = useState<SolutionVertical | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [drawerProject, setDrawerProject] = useState<ProjectPreview | null>(null);

  const handleFilterChange = useCallback((filter: SolutionVertical | 'all') => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setVisibleCount(6);
  }, [activeFilter]);

  const pills = useMemo(() => FILTER_PILLS.map(pill => {
    const meta = pill.key !== 'all' ? SOLUTION_META[pill.key] : null;
    return {
      key: pill.key,
      label: pill.label,
      accent: pill.key === 'all' ? '#39575C' : (meta?.accent ?? '#39575C'),
      accentText: pill.key === 'all' ? '#ffffff' : (meta?.accentText ?? '#ffffff'),
    };
  }), []);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.vertical === activeFilter);

  const featuredProject = filteredProjects
    .filter(p => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))[0] ?? null;

  const gridProjects = filteredProjects.filter(p => p._id !== featuredProject?._id);

  const visibleProjects = gridProjects.slice(0, visibleCount);

  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="page-container pt-24 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-5 font-body text-sm text-[#6B7280]">
          <Link href="/" className="hover:text-[#39575C] transition-colors duration-150">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C]">Projects</span>
        </div>

        {/* Page header */}
        <div className="mb-6">
          <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-[#709DA9] mb-2">
            OUR WORK
          </p>
          <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-2">
            Projects &amp;{' '}
            <em style={{ color: '#39575C', fontStyle: 'normal' }}>installations</em>
          </h1>
          <p className="font-body text-base text-[#6B7280] leading-[1.7]" style={{ maxWidth: 520 }}>
            A portfolio of renewable energy projects delivered across Southern Africa — from
            rooftop solar to grid wheeling, EV fleets to carbon credits.
          </p>
        </div>

        {/* Filter pills */}
        <div className="mb-6">
          <FilterPills
            pills={pills}
            activeKey={activeFilter}
            onSelect={(key) => handleFilterChange(key as SolutionVertical | 'all')}
          />
        </div>

        {/* Featured card — pinned above the grid, animates in/out per filter */}
        <AnimatePresence mode="wait">
          {featuredProject && (
            <motion.div
              key={featuredProject._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-4"
            >
              <FeaturedProjectCard project={featuredProject} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid toolbar — only when there are grid results */}
        {gridProjects.length > 0 && (
          <div className="mb-4">
            <p className="font-body text-sm text-[#6B7280]">
              Showing{' '}
              <span className="font-semibold text-[#1A1A1A]">
                {Math.min(visibleCount, gridProjects.length)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-[#1A1A1A]">{gridProjects.length}</span>
              {' '}project{gridProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Cards grid — key resets on filter change so enter animations restart */}
        <div
          key={activeFilter}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6"
        >
          {visibleProjects.length > 0 ? (
            visibleProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                className="h-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.04, ease: 'easeOut' }}
              >
                <ProjectCard
                  project={project}
                  fluid
                  onClick={() => setDrawerProject(project)}
                />
              </motion.div>
            ))
          ) : (
            <EmptyState vertical={activeFilter} />
          )}
        </div>

        {/* Load more */}
        {visibleCount < gridProjects.length && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="font-body font-medium text-base text-[#6B7280] rounded-full px-8 py-[11px] bg-white transition-all duration-200 hover:border-[#aaaaaa] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              style={{ border: '1px solid #E5E7EB' }}
            >
              Load more projects
            </button>
          </div>
        )}
      </div>

      <ProjectDrawer
        project={drawerProject}
        onClose={() => setDrawerProject(null)}
      />
    </main>
  );
}
