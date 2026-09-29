// src/lib/projectOrder.ts
// The order of /projects: projects marked featured first, in their featured
// order (a featured project without a number after those with one), then the
// rest as they come, which is newest first from the query.

type Orderable = { featured?: boolean | null; featuredOrder?: number | null };

export function orderForProjectsPage<T extends Orderable>(projects: readonly T[]): T[] {
  const rank = (project: T) =>
    project.featured
      ? typeof project.featuredOrder === 'number'
        ? project.featuredOrder
        : Number.MAX_SAFE_INTEGER - 1
      : Number.MAX_SAFE_INTEGER;
  // Array.prototype.sort is stable, so projects of equal rank keep the query's order.
  return [...projects].sort((a, b) => rank(a) - rank(b));
}
