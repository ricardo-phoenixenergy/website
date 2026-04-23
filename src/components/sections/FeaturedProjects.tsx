import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { FEATURED_PROJECTS_QUERY, PROJECTS_BY_VERTICAL_QUERY } from '@/lib/queries';
import { ProjectCard } from './ProjectCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { IconArrowRight } from '@/components/ui/Icons';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';

interface FeaturedProjectsProps {
  vertical?: SolutionVertical;
}

async function getProjects(vertical?: SolutionVertical): Promise<ProjectCardType[]> {
  try {
    if (vertical) {
      return await sanityClient.fetch<ProjectCardType[]>(PROJECTS_BY_VERTICAL_QUERY, { vertical });
    }
    return await sanityClient.fetch<ProjectCardType[]>(FEATURED_PROJECTS_QUERY);
  } catch {
    return [];
  }
}

export async function FeaturedProjects({ vertical }: FeaturedProjectsProps = {}) {
  const projects = await getProjects(vertical);

  if (projects.length === 0) return null;

  return (
    <section className="bg-white py-12 md:py-[48px]">
      {/* Header row */}
      <AnimatedSection>
        <div className="page-container flex items-end justify-between mb-6">
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
            className="group flex items-center gap-1.5 font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0 ml-4"
          >
            View all projects
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              <IconArrowRight size={14} />
            </span>
          </Link>
        </div>
      </AnimatedSection>

      {/* Horizontal scroll container — no overflow-hidden so card shadows aren't clipped */}
      <div className="page-container">
      <div
        className="flex gap-3.5 overflow-x-auto scrollbar-none pt-3 -mt-3 pb-4"
      >
        {projects.map((project, i) => (
          <AnimatedSection key={project._id} delay={i * 0.05} as="div" className="flex-shrink-0">
            <ProjectCard project={project} />
          </AnimatedSection>
        ))}
      </div>
      </div>
    </section>
  );
}
