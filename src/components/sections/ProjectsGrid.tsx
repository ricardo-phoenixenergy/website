'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { ProjectCard } from './ProjectCard';
import { FilterPills } from '@/components/ui/FilterPills';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { IconArrowRight } from '../ui/Icons';
import { dlPush } from '@/lib/analytics';
import { DISCOVERY_CTA } from '@/config/ctas';

/** Below this many projects there is nothing to filter: show equal cards instead. */
const FILTER_THRESHOLD = 4;
const PAGE_SIZE = 6;

type Filter = SolutionVertical | 'all';

/** Complete case studies first, then the editor's featured order. */
function byReadiness(a: ProjectPreview, b: ProjectPreview) {
  const ready = Number(b.caseStudyReady ?? false) - Number(a.caseStudyReady ?? false);
  if (ready !== 0) return ready;
  return (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99);
}

/* ── Empty state (no projects published at all) ─────────────────────────────── */

function EmptyState() {
  return (
    <div className="rounded-2xl p-10 text-center bg-white" style={{ border: '1px dashed var(--color-pe-border)' }}>
      <h2 className="font-display font-bold text-base text-pe-text mb-1.5">No projects published yet</h2>
      <p className="font-body text-sm text-pe-muted leading-[1.7] mx-auto mb-5" style={{ maxWidth: 380 }}>
        In the meantime, tell us about your site.
      </p>
      <Button href={DISCOVERY_CTA.href}>
        {DISCOVERY_CTA.label} <IconArrowRight />
      </Button>
    </div>
  );
}

/* ── Services with no published project yet ─────────────────────────────────── */

function OtherServices({ verticals }: { verticals: SolutionVertical[] }) {
  if (verticals.length === 0) return null;
  return (
    <section aria-labelledby="other-services" className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-pe-border)' }}>
      <h2 id="other-services" className="font-display font-bold text-lg text-pe-text mb-1">
        Our other services
      </h2>
      <p className="font-body text-sm text-pe-muted mb-4">
        No case study is published for these yet. See how each one works.
      </p>
      {/* 10px between wrapped rows, so each chip's 44px touch target stays clear of the next row's */}
      <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
        {verticals.map((v) => {
          const meta = SOLUTION_META[v];
          return (
            <li key={v}>
              <Chip href={meta.slug} dot={meta.accent}>
                {meta.label}
              </Chip>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

interface ProjectsGridProps {
  projects: ProjectPreview[];
  /** Page header (breadcrumb, H1, intro), rendered above the projects. */
  header: React.ReactNode;
}

export function ProjectsGrid({ projects, header }: ProjectsGridProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // Cards render visible on the server; only a filter change animates them in.
  const [hasFiltered, setHasFiltered] = useState(false);

  const verticalsWithProjects = useMemo(
    () => SOLUTION_VERTICALS.filter((v) => projects.some((p) => p.vertical === v)),
    [projects],
  );
  const otherVerticals = SOLUTION_VERTICALS.filter((v) => !verticalsWithProjects.includes(v));
  const filtersShown = projects.length >= FILTER_THRESHOLD && verticalsWithProjects.length > 1;

  const handleFilterChange = useCallback((filter: Filter) => {
    if (filter === activeFilter) return;
    setHasFiltered(true);
    setActiveFilter(filter);
    setVisibleCount(PAGE_SIZE);
    dlPush({ event: 'filter_change', filter_value: filter });
  }, [activeFilter]);

  // Filters come from the data, with counts, so no pill leads to an empty grid.
  const pills = useMemo(() => [
    { key: 'all', label: `All projects (${projects.length})`, accent: 'var(--color-pe-primary)', accentText: '#ffffff' },
    ...verticalsWithProjects.map((v) => ({
      key: v,
      label: `${SOLUTION_META[v].label} (${projects.filter((p) => p.vertical === v).length})`,
      accent: SOLUTION_META[v].accent,
      accentText: SOLUTION_META[v].accentText,
    })),
  ], [projects, verticalsWithProjects]);

  const sorted = useMemo(() => [...projects].sort(byReadiness), [projects]);

  if (projects.length === 0) {
    return (
      <div className="bg-pe-bg">
        <div className="page-container pt-24 pb-16">
          {header}
          <EmptyState />
        </div>
      </div>
    );
  }

  // ── A few projects: equal cards, complete case studies first ────────────────
  if (!filtersShown) {
    return (
      <div className="bg-pe-bg">
        <div className="page-container pt-24 pb-16">
          {header}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sorted.map((project) => (
              <li key={project._id}>
                <ProjectCard project={project} fluid size="large" headingLevel={2} />
              </li>
            ))}
          </ul>
          <OtherServices verticals={otherVerticals} />
        </div>
      </div>
    );
  }

  // ── Four or more: filters, one complete case study featured, then a grid ────
  const filtered = activeFilter === 'all' ? sorted : sorted.filter((p) => p.vertical === activeFilter);
  const featuredProject = filtered.find((p) => p.featured && p.caseStudyReady) ?? null;
  const gridProjects = filtered.filter((p) => p._id !== featuredProject?._id);
  const visibleProjects = gridProjects.slice(0, visibleCount);
  const shown = visibleProjects.length + (featuredProject ? 1 : 0);

  return (
    <div className="bg-pe-bg">
      <div className="page-container pt-24 pb-16">
        {header}

        <div className="mb-6">
          <FilterPills pills={pills} activeKey={activeFilter} onSelect={(key) => handleFilterChange(key as Filter)} />
        </div>

        <p role="status" className="font-body text-sm text-pe-muted mb-4">
          Showing <span className="font-semibold text-pe-text">{shown}</span> of{' '}
          <span className="font-semibold text-pe-text">{filtered.length}</span>{' '}
          project{filtered.length !== 1 ? 's' : ''}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {featuredProject && (
            <motion.div
              key={featuredProject._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-4"
            >
              <FeaturedProjectCard project={featuredProject} priority />
            </motion.div>
          )}
        </AnimatePresence>

        <ul key={activeFilter} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {visibleProjects.map((project, idx) => (
            <motion.li
              key={project._id}
              className="h-full"
              initial={hasFiltered ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: idx * 0.04, ease: 'easeOut' }}
            >
              <ProjectCard project={project} fluid headingLevel={2} />
            </motion.li>
          ))}
        </ul>

        {visibleCount < gridProjects.length && (
          <div className="flex justify-center mt-2">
            <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}>
              Load more projects
            </Button>
          </div>
        )}

        <OtherServices verticals={otherVerticals} />
      </div>
    </div>
  );
}
