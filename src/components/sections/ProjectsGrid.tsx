'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import type { ProjectPreview } from '@/types/sanity';
import { ProjectCard } from './ProjectCard';
import { ProjectDrawer } from '@/components/ui/ProjectDrawer';

/* ── Featured cinematic card data (one per filter) ─────────────────────────── */

interface FeaturedCardData {
  vertical: SolutionVertical;
  slug: string;
  title: string;
  location: string;
  date: string;
  value: string;
  bgTint: string;
  stats: { value: string; label: string }[];
}

const FEATURED_CARDS: Record<SolutionVertical | 'all', FeaturedCardData> = {
  all: {
    vertical: 'ci-solar-storage',
    slug: 'shoprite-dc-solar',
    title: 'Shoprite DC — 4.8 MW Solar + 2 MWh BESS',
    location: 'Centurion, GP',
    date: 'Completed Q3 2024',
    value: 'R42M',
    bgTint: '#2a3d28',
    stats: [
      { value: '4.8 MW', label: 'System size' },
      { value: 'R4.2M', label: 'Annual saving' },
      { value: '8,400 t', label: 'CO₂/yr' },
    ],
  },
  'ci-solar-storage': {
    vertical: 'ci-solar-storage',
    slug: 'shoprite-dc-solar',
    title: 'Shoprite DC — 4.8 MW Solar + 2 MWh BESS',
    location: 'Centurion, GP',
    date: 'Completed Q3 2024',
    value: 'R42M',
    bgTint: '#2a3d28',
    stats: [
      { value: '4.8 MW', label: 'System size' },
      { value: 'R4.2M', label: 'Annual saving' },
      { value: '8,400 t', label: 'CO₂/yr' },
    ],
  },
  wheeling: {
    vertical: 'wheeling',
    slug: 'cape-town-industrial-wheeling',
    title: 'Cape Town Industrial — 5 MW Wheeling PPA',
    location: 'Cape Town, WC',
    date: 'Completed Q1 2023',
    value: 'R28M',
    bgTint: '#3d2a28',
    stats: [
      { value: '5 MW', label: 'Wheeled' },
      { value: '32%', label: 'Tariff saving' },
      { value: 'R28M', label: 'Deal value' },
    ],
  },
  'carbon-credits': {
    vertical: 'carbon-credits',
    slug: 'mpumalanga-carbon-offset',
    title: 'Mpumalanga Solar Carbon Offset — 1,200 tCO₂e/yr',
    location: 'Mpumalanga',
    date: 'Active 2024',
    value: 'R8M/yr',
    bgTint: '#28352a',
    stats: [
      { value: '1,200 t', label: 'CO₂e yr' },
      { value: 'Gold Std.', label: 'Certified' },
      { value: 'R8M', label: 'Revenue/yr' },
    ],
  },
  'energy-optimisation': {
    vertical: 'energy-optimisation',
    slug: 'tiger-brands-smart-energy',
    title: 'Tiger Brands Smart Energy — 18% Cost Reduction',
    location: 'Johannesburg, GP',
    date: 'Completed Q2 2024',
    value: 'R3.2M/yr',
    bgTint: '#1e2e38',
    stats: [
      { value: '18%', label: 'Cost reduction' },
      { value: '6 sites', label: 'Monitored' },
      { value: 'R3.2M', label: 'Saving/yr' },
    ],
  },
  'ev-fleets': {
    vertical: 'ev-fleets',
    slug: 'transnet-fleet-phase-1',
    title: 'Transnet Fleet Phase 1 — 40 Electric Trucks',
    location: 'Durban, KZN',
    date: 'In progress 2025',
    value: 'R65M',
    bgTint: '#1e3230',
    stats: [
      { value: '40', label: 'Trucks deployed' },
      { value: '680 t', label: 'CO₂/yr' },
      { value: 'R65M', label: 'Value' },
    ],
  },
  webuysolar: {
    vertical: 'webuysolar',
    slug: 'pretoria-estate-buyback',
    title: 'Pretoria Estate Buyback — 42 Systems',
    location: 'Pretoria, GP',
    date: 'Completed Q4 2024',
    value: 'R9.4M',
    bgTint: '#2e1e10',
    stats: [
      { value: '42', label: 'Systems' },
      { value: '284 kW', label: 'Capacity' },
      { value: 'R9.4M', label: 'Paid out' },
    ],
  },
};

/* ── Mock project cards (shown when Sanity has no data) ────────────────────── */
// energy-optimisation is deliberately absent → triggers EmptyState for that filter

const MOCK_PROJECTS: ProjectPreview[] = [
  // C&I Solar & Storage
  {
    _id: 'mock-solar-1',
    title: 'Shoprite DC — 4.8 MW Solar + 2 MWh BESS',
    slug: { current: 'shoprite-dc-solar' },
    vertical: 'ci-solar-storage',
    location: 'Centurion, GP',
    featured: true,
    clientName: 'Shoprite Holdings',
    completionDate: 'Q3 2024',
    projectValue: 'R42M',
    status: 'completed',
    metrics: [
      { label: 'System size', value: '4.8 MW' },
      { label: 'Annual saving', value: 'R4.2M' },
    ],
    summary: 'A flagship rooftop solar and battery storage installation for Shoprite\'s Centurion distribution centre.',
  },
  {
    _id: 'mock-solar-2',
    title: 'Growthpoint Properties — 2.1 MW Rooftop Solar',
    slug: { current: 'growthpoint-rooftop-solar' },
    vertical: 'ci-solar-storage',
    location: 'Sandton, GP',
    featured: false,
    clientName: 'Growthpoint Properties',
    completionDate: 'Q1 2024',
    projectValue: 'R18M',
    status: 'completed',
    metrics: [
      { label: 'System size', value: '2.1 MW' },
      { label: 'CO₂/yr', value: '3,200 t' },
    ],
    summary: 'Rooftop solar across three Growthpoint commercial properties in Sandton.',
  },
  {
    _id: 'mock-solar-3',
    title: 'Pick n Pay RDC — 1.6 MW + 800 kWh Storage',
    slug: { current: 'pick-n-pay-rdc-solar' },
    vertical: 'ci-solar-storage',
    location: 'Cape Town, WC',
    featured: false,
    clientName: 'Pick n Pay Stores',
    completionDate: 'Q4 2023',
    projectValue: 'R14M',
    status: 'completed',
    metrics: [
      { label: 'System size', value: '1.6 MW' },
      { label: 'Battery', value: '800 kWh' },
    ],
    summary: 'Solar-plus-storage for a regional distribution centre, reducing peak demand charges.',
  },
  // Wheeling
  {
    _id: 'mock-wheel-1',
    title: 'Cape Town Industrial — 5 MW Wheeling PPA',
    slug: { current: 'cape-town-industrial-wheeling' },
    vertical: 'wheeling',
    location: 'Cape Town, WC',
    featured: true,
    clientName: 'Atlantic Industrial Park',
    completionDate: 'Q1 2023',
    projectValue: 'R28M',
    status: 'completed',
    metrics: [
      { label: 'Wheeled', value: '5 MW' },
      { label: 'Tariff saving', value: '32%' },
    ],
    summary: 'Long-term wheeling agreement giving an industrial park access to renewable energy without on-site infrastructure.',
  },
  {
    _id: 'mock-wheel-2',
    title: 'Durban Harbour — 3.2 MW Grid Wheeling',
    slug: { current: 'durban-harbour-wheeling' },
    vertical: 'wheeling',
    location: 'Durban, KZN',
    featured: false,
    clientName: 'Transnet Port Terminals',
    completionDate: 'Q3 2023',
    projectValue: 'R21M',
    status: 'completed',
    metrics: [
      { label: 'Wheeled', value: '3.2 MW' },
      { label: 'Tariff saving', value: '27%' },
    ],
    summary: 'Wheeling PPA enabling Durban Harbour operations to source clean energy via the national grid.',
  },
  // Carbon Credits
  {
    _id: 'mock-carbon-1',
    title: 'Mpumalanga Solar Carbon Offset — 1,200 tCO₂e/yr',
    slug: { current: 'mpumalanga-carbon-offset' },
    vertical: 'carbon-credits',
    location: 'Mpumalanga',
    featured: true,
    clientName: 'Eskom Holdings',
    completionDate: 'Active 2024',
    projectValue: 'R8M/yr',
    status: 'completed',
    metrics: [
      { label: 'CO₂e yr', value: '1,200 t' },
      { label: 'Certified', value: 'Gold Std.' },
    ],
    summary: 'Gold Standard carbon credit registration for a grid-connected solar portfolio in Mpumalanga.',
  },
  {
    _id: 'mock-carbon-2',
    title: 'Western Cape Wind Farm — 640 tCO₂e/yr',
    slug: { current: 'western-cape-wind-carbon' },
    vertical: 'carbon-credits',
    location: 'Darling, WC',
    featured: false,
    clientName: 'Darling Wind Power',
    completionDate: 'Active 2023',
    projectValue: 'R4.2M/yr',
    status: 'completed',
    metrics: [
      { label: 'CO₂e yr', value: '640 t' },
      { label: 'Standard', value: 'Gold Std.' },
    ],
    summary: 'Carbon credit monetisation for an existing wind farm, adding a new revenue stream to the asset.',
  },
  // EV Fleets & Infrastructure
  {
    _id: 'mock-ev-1',
    title: 'Transnet Fleet Phase 1 — 40 Electric Trucks',
    slug: { current: 'transnet-fleet-phase-1' },
    vertical: 'ev-fleets',
    location: 'Durban, KZN',
    featured: true,
    clientName: 'Transnet SOC',
    completionDate: 'In progress 2025',
    projectValue: 'R65M',
    status: 'in-progress',
    metrics: [
      { label: 'Trucks', value: '40' },
      { label: 'CO₂/yr', value: '680 t' },
    ],
    summary: 'End-to-end electrification of Transnet\'s short-haul port logistics fleet in the Port of Durban.',
  },
  {
    _id: 'mock-ev-2',
    title: 'Checkers Last-Mile — 18 Electric Vans',
    slug: { current: 'checkers-last-mile-ev' },
    vertical: 'ev-fleets',
    location: 'Johannesburg, GP',
    featured: false,
    clientName: 'Shoprite Holdings',
    completionDate: 'Q2 2024',
    projectValue: 'R9.5M',
    status: 'completed',
    metrics: [
      { label: 'Vans', value: '18' },
      { label: 'CO₂/yr', value: '95 t' },
    ],
    summary: 'Electric delivery van fleet with depot charging infrastructure for Checkers\' Joburg distribution hub.',
  },
  // WeBuySolar
  {
    _id: 'mock-wbs-1',
    title: 'Pretoria Estate Buyback — 42 Systems',
    slug: { current: 'pretoria-estate-buyback' },
    vertical: 'webuysolar',
    location: 'Pretoria, GP',
    featured: true,
    clientName: 'Residential Estate',
    completionDate: 'Q4 2024',
    projectValue: 'R9.4M',
    status: 'completed',
    metrics: [
      { label: 'Systems', value: '42' },
      { label: 'Capacity', value: '284 kW' },
    ],
    summary: 'Portfolio buyback of 42 residential solar systems from a Pretoria estate, redeployed to a commercial client.',
  },
  {
    _id: 'mock-wbs-2',
    title: 'Stellenbosch Wine Estate — 28 kW Buyback',
    slug: { current: 'stellenbosch-wine-estate-buyback' },
    vertical: 'webuysolar',
    location: 'Stellenbosch, WC',
    featured: false,
    clientName: 'Private Wine Estate',
    completionDate: 'Q2 2024',
    projectValue: 'R620K',
    status: 'completed',
    metrics: [
      { label: 'Capacity', value: '28 kW' },
      { label: 'Panels', value: '64' },
    ],
    summary: 'Fast-turnaround buyback of an under-utilised rooftop system, providing the estate with immediate capital.',
  },
  // energy-optimisation: intentionally absent — EmptyState will render for this filter
];

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
          Discuss your project →
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [drawerProject, setDrawerProject] = useState<ProjectPreview | null>(null);

  // Fall back to mock data when Sanity has no projects yet
  const displayProjects = projects.length > 0 ? projects : MOCK_PROJECTS;

  const handleFilterChange = useCallback((filter: SolutionVertical | 'all') => {
    if (filter === activeFilter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setVisibleCount(6);
      setIsTransitioning(false);
    }, 180);
  }, [activeFilter]);

  const filteredProjects = activeFilter === 'all'
    ? displayProjects
    : displayProjects.filter((p) => p.vertical === activeFilter);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const featuredCard = FEATURED_CARDS[activeFilter];
  const featuredMeta = SOLUTION_META[featuredCard.vertical];

  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="pt-[96px] px-6 max-w-7xl mx-auto">

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

        {/* Filter pills — always all 7 */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none -mx-6 px-6"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {FILTER_PILLS.map((pill) => {
            const isActive = activeFilter === pill.key;
            const meta = pill.key !== 'all' ? SOLUTION_META[pill.key] : null;
            const activeColor = pill.key === 'all' ? '#39575C' : (meta?.accent ?? '#39575C');
            const activeText = pill.key === 'all' ? '#ffffff' : (meta?.accentText ?? '#ffffff');
            return (
              <button
                key={pill.key}
                onClick={() => handleFilterChange(pill.key)}
                className="flex-shrink-0 font-body font-medium text-sm rounded-full transition-all duration-200"
                style={{
                  padding: '7px 16px',
                  background: isActive ? activeColor : '#ffffff',
                  border: isActive ? 'none' : '1px solid #E5E7EB',
                  color: isActive ? activeText : '#6B7280',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Featured cinematic card — only shown when this filter has projects */}
        {filteredProjects.length > 0 && <div
          className="mb-6 rounded-[18px] overflow-hidden relative group"
          style={{
            height: 320,
            boxShadow: '0 8px 40px rgba(57,87,92,0.15)',
            opacity: isTransitioning ? 0.5 : 1,
            transition: 'opacity 180ms ease',
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-[800ms] group-hover:scale-[1.03]"
            style={{ background: `linear-gradient(135deg, ${featuredCard.bgTint}, #0d1f22)` }}
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: 'linear-gradient(90deg, rgba(13,31,34,0.94) 0%, rgba(13,31,34,0.65) 45%, rgba(13,31,34,0.1) 100%)' }}
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: 'linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.92) 100%)' }}
          />

          <div className="absolute bottom-0 left-0 p-[30px] md:p-[36px]" style={{ maxWidth: 520 }}>
            <p
              className="font-body font-bold text-xs uppercase tracking-[0.14em] mb-3"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              FLAGSHIP PROJECT
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: featuredMeta.accent }} />
              <span
                className="font-body font-bold text-xs uppercase tracking-[0.12em] rounded-full px-2.5 py-1"
                style={{ background: `${featuredMeta.accent}33`, color: featuredMeta.accent }}
              >
                {featuredMeta.label}
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white leading-[1.25] mb-3">
              {featuredCard.title}
            </h2>
            <p className="font-body text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              📍 {featuredCard.location} · 📅 {featuredCard.date} · 💰 {featuredCard.value}
            </p>
            <Link
              href={`/projects/${featuredCard.slug}`}
              className="inline-flex items-center gap-2 font-body font-semibold text-base text-white rounded-full px-4 py-2.5 transition-all duration-200 hover:bg-white/20"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              View case study →
            </Link>
          </div>

          <div className="absolute bottom-0 right-0 p-[30px] md:p-[32px] hidden md:flex flex-col items-end gap-3">
            {featuredCard.stats.map((stat, i) => (
              <div key={i} className="text-right">
                <p className="font-display font-extrabold text-2xl text-white leading-none">{stat.value}</p>
                <p className="font-body text-xs uppercase tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>}

        {/* Grid toolbar — only when there are results */}
        {filteredProjects.length > 0 && (
          <div className="mb-4">
            <p className="font-body text-sm text-[#6B7280]">
              Showing{' '}
              <span className="font-semibold text-[#1A1A1A]">
                {Math.min(visibleCount, filteredProjects.length)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-[#1A1A1A]">{filteredProjects.length}</span>
              {' '}project{filteredProjects.length !== 1 ? 's' : ''}
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
        {visibleCount < filteredProjects.length && (
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
