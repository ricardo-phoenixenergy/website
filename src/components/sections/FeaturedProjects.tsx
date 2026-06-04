import { sanityServerClient } from '@/lib/sanity.server';
import { FEATURED_PROJECTS_QUERY, PROJECTS_BY_VERTICAL_QUERY } from '@/lib/queries';
import { ProjectCard } from './ProjectCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionCarousel } from '@/components/ui/SectionCarousel';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';

interface FeaturedProjectsProps {
  vertical?: SolutionVertical;
}

async function getProjects(vertical?: SolutionVertical): Promise<ProjectCardType[]> {
  try {
    if (vertical) {
      return await sanityServerClient.fetch<ProjectCardType[]>(PROJECTS_BY_VERTICAL_QUERY, { vertical });
    }
    return await sanityServerClient.fetch<ProjectCardType[]>(FEATURED_PROJECTS_QUERY);
  } catch {
    return [];
  }
}

export async function FeaturedProjects({ vertical }: FeaturedProjectsProps = {}) {
  const projects = await getProjects(vertical);
  if (projects.length === 0) return null;

  // Cards fill exactly 1/3 of the container on md+ so 3 are visible and the rest
  // overflow into the horizontal scroll. On mobile each card is 82vw (one card
  // visible, the next peeking). Used identically on the homepage and solution pages.
  //
  // calc breakdown: min(100vw, 80rem) = visible container width (capped at 1280 px)
  //                 4rem              = page-container padding (2 rem each side at lg)
  //                 28px              = 2 × 14 px gap between 3 cards
  const cardClass = 'flex-shrink-0 w-[82vw] md:w-[calc((min(100vw,80rem)-4rem-28px)/3)]';

  return (
    <SectionCarousel
      label="Featured projects"
      title={<>Work that speaks <em style={{ color: '#709DA9', fontStyle: 'normal' }}>for itself</em></>}
      viewAllHref="/projects"
      viewAllLabel="View all projects"
      bg="white"
    >
      {projects.map((project, i) => (
        <AnimatedSection key={project._id} delay={i * 0.05} as="div" className={cardClass}>
          <ProjectCard project={project} fluid className="w-full" />
        </AnimatedSection>
      ))}
    </SectionCarousel>
  );
}
