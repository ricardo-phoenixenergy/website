import { sanityClient } from '@/lib/sanity';
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

  // On solution pages (vertical set): cards fill exactly 1/3 of the container so
  // 3 are visible and the rest overflow into the scroll. On the homepage the
  // cards use the standard fixed 260 px width.
  //
  // calc breakdown: min(100vw, 80rem) = visible container width (capped at 1280 px)
  //                 4rem              = page-container padding (2 rem each side at lg)
  //                 28px              = 2 × 14 px gap between 3 cards
  const verticalCardClass = vertical
    ? 'flex-shrink-0 w-[82vw] md:w-[calc((min(100vw,80rem)-4rem-28px)/3)]'
    : 'flex-shrink-0';

  return (
    <SectionCarousel
      label="Featured projects"
      title={<>Work that speaks <em style={{ color: '#709DA9', fontStyle: 'normal' }}>for itself</em></>}
      viewAllHref="/projects"
      viewAllLabel="View all projects"
      bg="white"
    >
      {projects.map((project, i) => (
        <AnimatedSection key={project._id} delay={i * 0.05} as="div" className={verticalCardClass}>
          <ProjectCard project={project} fluid={!!vertical} className={vertical ? 'w-full' : ''} />
        </AnimatedSection>
      ))}
    </SectionCarousel>
  );
}
