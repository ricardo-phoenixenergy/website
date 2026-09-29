// src/lib/projectMeta.ts
// The line under a project's headline: where it is, then its status and date
// ("Cape Town · Completed Q2 2026"). The facts panel's Status row uses the same
// wording. Step 2 adds the site type or, with the client's consent, their name.
import type { ProjectStatus } from '@/types/sanity';

/** "Completed Q2 2026", "In progress, due Q3 2027" or "Planned for Q3 2027"; the status alone without a date; null without a known status. */
export function statusLine(status: ProjectStatus | null | undefined, date: string | null | undefined): string | null {
  const when = date?.trim();
  switch (status) {
    case 'completed':
      return when ? `Completed ${when}` : 'Completed';
    case 'in-progress':
      return when ? `In progress, due ${when}` : 'In progress';
    case 'planned':
      return when ? `Planned for ${when}` : 'Planned';
    default:
      return null;
  }
}

export interface MetaLine {
  /** Where the project is: the city, for now. */
  place: string[];
  /** The status and date, or null. */
  when: string | null;
}

export function metaLine(project: {
  location?: string | null;
  status?: ProjectStatus | null;
  completionDate?: string | null;
}): MetaLine {
  const city = project.location?.trim();
  return { place: city ? [city] : [], when: statusLine(project.status, project.completionDate) };
}
