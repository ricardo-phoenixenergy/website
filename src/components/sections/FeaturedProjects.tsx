import { sanityServerClient } from '@/lib/sanity.server';
import { FEATURED_PROJECTS_QUERY, PROJECTS_BY_VERTICAL_QUERY } from '@/lib/queries';
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

export async function FeaturedProjects({ vertical, flushTop = false }: FeaturedProjectsProps = {}) {
  // Complete case studies lead; an unwritten one never takes the first slot.
  const projects = (await getProjects(vertical)).sort(
    (a, b) => Number(b.caseStudyReady ?? false) - Number(a.caseStudyReady ?? false),
  );
  if (projects.length === 0) return null;
  // Three or fewer: a static grid, so no empty column or hidden card behind a swipe.
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
      gridColumns={few ? (projects.length === 3 ? 3 : 2) : undefined}
    >
      {projects.map((project, i) => (
        <AnimatedSection key={project._id} delay={i * 0.05} as="div" className={few ? undefined : cardClass}>
          <ProjectCard project={project} fluid className="w-full" size={few && projects.length < 3 ? 'large' : 'default'} />
        </AnimatedSection>
      ))}
    </SectionCarousel>
  );
}
