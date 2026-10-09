import { getFeaturedProjects, getProjectsByVertical } from '@/lib/projectData';
import { ProjectCard } from './ProjectCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionCarousel } from '@/components/ui/SectionCarousel';
import type { ProjectCard as ProjectCardType } from '@/types/sanity';
import type { SolutionVertical } from '@/types/solutions';
import { PROJECTS_CTA } from '@/config/ctas';

interface FeaturedProjectsProps {
  vertical?: SolutionVertical;
  /** Collapse top padding when stacked under a same-background section. */
  flushTop?: boolean;
}

/** Home: the featured projects in their featured order. A solution page: its service's newest six. */
async function getProjects(vertical?: SolutionVertical): Promise<ProjectCardType[]> {
  try {
    return vertical ? await getProjectsByVertical(vertical) : await getFeaturedProjects();
  } catch {
    return [];
  }
}

export async function FeaturedProjects({ vertical, flushTop = false }: FeaturedProjectsProps = {}) {
  const projects = await getProjects(vertical);
  if (projects.length === 0) return null;
  // Three or fewer: a static grid, three a row from 768px, so no card hides behind a swipe.
  const few = projects.length <= 3;

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
      label="Our work"
      title="Projects"
      // /projects holds the published projects, not the whole track record the stats count.
      viewAllHref={PROJECTS_CTA.href}
      viewAllLabel={PROJECTS_CTA.label}
      bg="white"
      flushTop={flushTop}
      grid={few}
    >
      {projects.map((project, i) => (
        <AnimatedSection key={project._id} delay={i * 0.05} as="div" className={few ? undefined : cardClass}>
          <ProjectCard project={project} fluid className="w-full" />
        </AnimatedSection>
      ))}
    </SectionCarousel>
  );
}
