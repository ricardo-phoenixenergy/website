// src/lib/projectFacts.ts
// The facts panel's rows: the Project group (location, service, status), then the
// System group (the CMS's "Stats strip metrics" rows, in their order). A row shows
// only when it's set, and a group only when it has a row. Step 2 adds the site,
// client, financing and project value rows and the Equipment and Delivery groups.
import { SOLUTION_META, type SolutionMeta, type SolutionVertical } from '@/types/solutions';
import type { ProjectMetric, ProjectStatus } from '@/types/sanity';
import { statusLine } from '@/lib/projectMeta';

export interface FactRow {
  key: string;
  label: string;
  value: string;
  /** Set on rows that link somewhere, such as Service. */
  href?: string;
}

export type FactGroupKey = 'project' | 'system';

export interface FactGroup {
  key: FactGroupKey;
  title: string;
  rows: FactRow[];
}

export interface FactsSource {
  vertical: SolutionVertical;
  location?: string | null;
  status?: ProjectStatus | null;
  completionDate?: string | null;
  metrics?: ProjectMetric[] | null;
}

export function projectFacts(project: FactsSource): FactGroup[] {
  const meta: SolutionMeta | undefined = SOLUTION_META[project.vertical];
  const location = project.location?.trim();
  const status = statusLine(project.status, project.completionDate);

  const projectRows: FactRow[] = [];
  if (location) projectRows.push({ key: 'location', label: 'Location', value: location });
  if (meta) projectRows.push({ key: 'service', label: 'Service', value: meta.label, href: meta.slug });
  if (status) projectRows.push({ key: 'status', label: 'Status', value: status });

  const systemRows: FactRow[] = (project.metrics ?? []).flatMap((metric, i) => {
    const label = metric?.label?.trim();
    const value = metric?.value?.trim();
    return label && value ? [{ key: `system-${i}`, label, value }] : [];
  });

  const groups: FactGroup[] = [
    { key: 'project', title: 'Project', rows: projectRows },
    { key: 'system', title: 'System', rows: systemRows },
  ];
  return groups.filter((group) => group.rows.length > 0);
}

/**
 * The compact panel below 1024px: Location and the first two System rows show
 * open, and every other row stays in its group under "All project facts".
 */
export function splitMainRows(groups: readonly FactGroup[]): { main: FactRow[]; rest: FactGroup[] } {
  const main: FactRow[] = [];
  const rest: FactGroup[] = [];
  for (const group of groups) {
    const leftover: FactRow[] = [];
    group.rows.forEach((row, i) => {
      const isMain = (group.key === 'project' && row.key === 'location') || (group.key === 'system' && i < 2);
      (isMain ? main : leftover).push(row);
    });
    if (leftover.length > 0) rest.push({ ...group, rows: leftover });
  }
  return { main, rest };
}
