import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { FEATURED_PROJECTS_QUERY } from '@/lib/queries';
import { ProjectCard } from './ProjectCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';

async function getFeaturedProjects(): Promise<ProjectCardType[]> {
  try {
    return await sanityClient.fetch<ProjectCardType[]>(FEATURED_PROJECTS_QUERY);
  } catch {
    return [];
  }
}

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  if (projects.length === 0) return null;

  return (
    <section className="bg-white px-5 py-12 md:py-[48px]">
      {/* Header row */}
      <AnimatedSection>
        <div className="flex items-end justify-between max-w-[960px] mx-auto mb-6">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
              Featured projects
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
              Work that speaks{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>for itself</em>
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0 ml-4"
          >
            View all projects →
          </Link>
        </div>
      </AnimatedSection>

      {/* Horizontal scroll container */}
      <div
        className="flex gap-3.5 overflow-x-auto scrollbar-none pb-2"
        style={{ margin: '0 -20px', paddingLeft: 20, paddingRight: 20 }}
      >
        {projects.map((project, i) => (
          <AnimatedSection key={project._id} delay={i * 0.05} as="div" className="flex-shrink-0">
            <ProjectCard
              project={project}
            />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
