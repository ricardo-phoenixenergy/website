// src/components/project/ProjectNext.tsx
// The next project section, following selectRelated() (src/lib/relatedProjects.ts):
// - three cards, or two large ones, under "Similar projects";
// - one wide card under "Next project" or "More projects".
// The heading names the section, so the wide card's pill names the project's
// service. The section keeps the id `similar-projects` whatever its heading says.
import { SOLUTION_META, type SolutionMeta } from '@/types/solutions';
import type { ProjectCard as ProjectCardData } from '@/types/sanity';
import type { RelatedSelection } from '@/lib/relatedProjects';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { FeaturedProjectCard } from '@/components/sections/FeaturedProjectCard';

export function ProjectNext({ related }: { related: RelatedSelection<ProjectCardData> }) {
  const first = related.projects[0];
  const firstMeta: SolutionMeta | undefined = first ? SOLUTION_META[first.vertical] : undefined;

  return (
    <section aria-labelledby="similar-projects" className="mt-10 bg-white py-8 md:mt-12 lg:mt-16">
      <div className="page-container">
        <h2 id="similar-projects" className="mb-5 font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted">
          {related.heading}
        </h2>
        {related.layout === 'wide' && first ? (
          <FeaturedProjectCard project={first} headingLevel={3} kicker={firstMeta?.label ?? 'Project'} />
        ) : (
          // One card per row on phones: an outcomes-first card needs the full width there.
          <div className={related.layout === 'three' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3' : 'grid grid-cols-1 gap-6 md:grid-cols-2'}>
            {related.projects.map((project) => (
              <ProjectCard key={project._id} project={project} fluid size={related.layout === 'two' ? 'large' : 'default'} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
