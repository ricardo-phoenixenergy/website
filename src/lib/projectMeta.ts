// src/lib/projectMeta.ts
// The line under a project's headline: who or what the site is, where it is,
// then its status and date ("Logistics warehouse · Cape Town · Completed June
// 2026"). The facts panel's Status row uses the same status wording, and the
// project cards' place line uses cardPlace(). The client's name is in the data
// only with the client's recorded consent (src/lib/queries.ts), so wherever
// the name is present it may show.
import type { ProjectStatus } from '@/types/sanity';
import { formatMonthYear } from '@/lib/projectResults';

export interface StatusSource {
  status?: ProjectStatus | null;
  /** Free text: the target of a planned or in-progress project, or a completed one's date. */
  completionDate?: string | null;
  /** YYYY-MM-DD: a completed project's commissioning date. */
  commissionedOn?: string | null;
}

/**
 * "Completed June 2026" from the commissioning date, else "Completed Q2 2026"
 * from the free text, else "Completed"; "In progress, due Q3 2027" or "Planned
 * for Q3 2027" from the target; the status alone without a date; null without a
 * known status.
 */
export function statusLine(project: StatusSource): string | null {
  const target = project.completionDate?.trim();
  switch (project.status) {
    case 'completed': {
      const when = formatMonthYear(project.commissionedOn) ?? target;
      return when ? `Completed ${when}` : 'Completed';
    }
    case 'in-progress':
      return target ? `In progress, due ${target}` : 'In progress';
    case 'planned':
      return target ? `Planned for ${target}` : 'Planned';
    default:
      return null;
  }
}

export interface MetaLine {
  /** Who or what and where: the client's name or the site type, then the city. */
  place: string[];
  /** The status and date, or null. */
  when: string | null;
}

export function metaLine(
  project: StatusSource & { clientName?: string | null; siteType?: string | null; location?: string | null },
): MetaLine {
  const who = project.clientName?.trim() || project.siteType?.trim();
  const city = project.location?.trim();
  return { place: [who, city].filter((part): part is string => Boolean(part)), when: statusLine(project) };
}

/** A project card's place line: the city, then the client's name ("Cape Town · Example Client"); null with neither. */
export function cardPlace(project: { location?: string | null; clientName?: string | null }): string | null {
  const parts = [project.location?.trim(), project.clientName?.trim()].filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(' · ') : null;
}
