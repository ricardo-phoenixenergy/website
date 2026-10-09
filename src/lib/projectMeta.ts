// src/lib/projectMeta.ts
// The line under a project's headline: who or what the site is, where it is,
// then its status and date ("Logistics warehouse · Cape Town · Completed June
// 2026"). The facts panel's Status row uses the same status wording, and the
// project cards' place line uses cardPlace(). The client's name shows wherever
// it is set: editors fill it in only once the client has agreed in writing.
import type { ProjectStatus } from '@/types/sanity';
import { formatMonthYear } from '@/lib/sanityDate';

export interface StatusSource {
  status?: ProjectStatus | null;
  /** YYYY-MM-DD: the completion date, or the day a planned or in-progress project is due. */
  commissionedOn?: string | null;
}

/**
 * "Completed June 2026", "In progress, due September 2027" or "Planned for
 * September 2027" from the status and the completion date; the status alone
 * without a date it can read; null without a known status.
 */
export function statusLine(project: StatusSource): string | null {
  const when = formatMonthYear(project.commissionedOn);
  switch (project.status) {
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
