// src/lib/relatedProjects.ts
// Which other projects a case study shows at its foot, and how, so one project
// never sits alone in a three-column grid (docs/plans/2026-09-24-case-study-and-
// proof-strip-brief.md, 6A.3). The query orders both lists: complete case
// studies first, then the newest.

export type RelatedLayout = 'three' | 'two' | 'wide';

export interface RelatedSelection<T> {
  heading: 'Similar projects' | 'Next project' | 'More projects';
  /** `three`: cards in a row of three. `two`: two large cards. `wide`: one wide card. */
  layout: RelatedLayout;
  projects: T[];
}

/**
 * Projects from the same service come first: three or more as cards, two as
 * large cards, one as a wide "Next project" card. Only when the service has no
 * other project do other services fill in, up to two. With none anywhere, the
 * section is left out (null).
 */
export function selectRelated<T>(sameService: readonly T[], otherServices: readonly T[] = []): RelatedSelection<T> | null {
  if (sameService.length >= 3) return { heading: 'Similar projects', layout: 'three', projects: sameService.slice(0, 3) };
  if (sameService.length === 2) return { heading: 'Similar projects', layout: 'two', projects: [...sameService] };
  if (sameService.length === 1) return { heading: 'Next project', layout: 'wide', projects: [...sameService] };
  if (otherServices.length >= 2) return { heading: 'More projects', layout: 'two', projects: otherServices.slice(0, 2) };
  if (otherServices.length === 1) return { heading: 'More projects', layout: 'wide', projects: [...otherServices] };
  return null;
}
