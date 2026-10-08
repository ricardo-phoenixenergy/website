// src/components/project/ProjectHero.tsx
// A project's hero: one photo and one H1 at every width, laid out by CSS in the
// shared PageHero. It passes the service badge, the headline (else the title)
// and the line under it: who or what and where, then the status and date.
import { PageHero } from '@/components/ui/PageHero';
import { SOLUTION_META, type SolutionMeta } from '@/types/solutions';
import type { Project } from '@/types/sanity';
import { metaLine } from '@/lib/projectMeta';
import { projectTitle } from '@/lib/projectSeo';

type HeroProject = Pick<
  Project,
  'title' | 'headline' | 'vertical' | 'heroImage' | 'siteType' | 'clientName' | 'location' | 'status' | 'completionDate' | 'commissionedOn'
>;

interface ProjectHeroProps {
  project: HeroProject;
  /** The results card overlaps the photo's foot, so the text sits higher. */
  overlapped: boolean;
}

export function ProjectHero({ project, overlapped }: ProjectHeroProps) {
  const meta: SolutionMeta | undefined = SOLUTION_META[project.vertical];
  const line = metaLine(project);

  return (
    <PageHero
      image={project.heroImage}
      alt={project.heroImage?.alt?.trim() || project.title}
      title={projectTitle(project)}
      titleId="project-title"
      badge={meta ? { label: meta.label, href: meta.slug, accent: meta.accent, accentText: meta.accentText } : undefined}
      line={{ first: line.place.join(' · '), second: line.when ?? undefined }}
      fallbackAccent={meta?.accent}
      overlapped={overlapped}
    />
  );
}
