// src/components/sections/AreaProjects.tsx
// A location page's projects, straight after the hero: proof before process.
// One project is one wide card; two or three share a row; four or more lead
// with a wide card. Never a lone card in a three-column row.
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { inkFor } from '@/types/solutions';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { ProjectCard } from './ProjectCard';
import type { ProjectCard as ProjectCardData } from '@/types/sanity';

export interface AreaProjectsProps {
  eyebrow: string;
  heading: string;
  projects: ProjectCardData[];
  accent: string;
}

export function AreaProjects({ eyebrow, heading, projects, accent }: AreaProjectsProps) {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;
  const row = projects.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="page-container">
        <AnimatedSection className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: inkFor(accent) }}>{eyebrow}</p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-pe-text leading-[1.2]">{heading}</h2>
          </div>
          <ArrowLink href="/projects">View all projects</ArrowLink>
        </AnimatedSection>

        {projects.length === 1 && (
          <AnimatedSection as="div">
            <FeaturedProjectCard project={lead} headingLevel={3} kicker="Our work" />
          </AnimatedSection>
        )}

        {(projects.length === 2 || projects.length === 3) && (
          <div className={`grid gap-4 ${row}`}>
            {projects.map((p, i) => (
              <AnimatedSection key={p._id} as="div" delay={i * 0.05}>
                <ProjectCard project={p} fluid className="w-full h-full" />
              </AnimatedSection>
            ))}
          </div>
        )}

        {projects.length >= 4 && (
          <div className="flex flex-col gap-4">
            <AnimatedSection as="div">
              <FeaturedProjectCard project={lead} headingLevel={3} kicker="Our work" />
            </AnimatedSection>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <AnimatedSection key={p._id} as="div" delay={i * 0.05}>
                  <ProjectCard project={p} fluid className="w-full h-full" />
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
