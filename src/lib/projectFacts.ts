// src/lib/projectFacts.ts
// The facts panel's groups and rows, in order, each row only when it's set and
// each group only when it has a row:
// - Project: Site, Client (the name is in the data only with consent),
//   Location, Service, Status, Financing and Project value (in the data only
//   while "Show rand amounts" is on);
// - System: the CMS's System rows, in their order;
// - Equipment: one row per component, "[brand] [model], 3 units";
// - Delivery: the weeks on site and the approvals.
// A row holds one line or more: Financing and Approvals put each on its own.
import { SOLUTION_META, type SolutionMeta, type SolutionVertical } from '@/types/solutions';
import type { ProjectEquipment, ProjectMetric, ProjectStatus } from '@/types/sanity';
import { equipmentLabel, financingLabel, type FinancingMethod } from '@/lib/projectOptions';
import { statusLine } from '@/lib/projectMeta';

export interface FactLine {
  text: string;
  /** Set on lines that link somewhere, such as Service and each Financing option. */
  href?: string;
}

export interface FactRow {
  key: string;
  label: string;
  lines: FactLine[];
}

export type FactGroupKey = 'project' | 'system' | 'equipment' | 'delivery';

export interface FactGroup {
  key: FactGroupKey;
  title: string;
  rows: FactRow[];
}

export interface FactsSource {
  vertical: SolutionVertical;
  siteType?: string | null;
  clientName?: string | null;
  location?: string | null;
  status?: ProjectStatus | null;
  completionDate?: string | null;
  commissionedOn?: string | null;
  financing?: FinancingMethod[] | null;
  projectValue?: string | null;
  metrics?: ProjectMetric[] | null;
  equipment?: ProjectEquipment[] | null;
  installationWeeks?: number | null;
  approvals?: string[] | null;
}

/** The services whose page has a financing section (FinancingBand, id="financing"). */
const FINANCING_SECTIONS: ReadonlySet<SolutionVertical> = new Set(['ci-solar-storage', 'energy-optimisation', 'ev-fleets']);

/** Where a Financing line links: the service page's financing section, or the service page when it has none. */
export function financingHref(vertical: SolutionVertical): string | undefined {
  const meta: SolutionMeta | undefined = SOLUTION_META[vertical];
  if (!meta) return undefined;
  return FINANCING_SECTIONS.has(vertical) ? `${meta.slug}#financing` : meta.slug;
}

/** A count in words, so it reads well aloud: "1 unit", "3 units", "1 week", "6 weeks". */
export function countWords(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

const isWhole = (n: unknown, min: number, max = Number.MAX_SAFE_INTEGER): n is number =>
  typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max;

// The query returns what the document holds, and an API write or an import can
// store any type: a string where a list belongs, or a number for a brand. Such
// a field reads as unset, so the row falls away rather than failing the page.
function listOf<T>(value: readonly T[] | null | undefined): readonly T[] {
  return Array.isArray(value) ? value : [];
}

/** A string field trimmed, or undefined when it's blank or not a string. */
function textOf(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() || undefined : undefined;
}

function row(key: string, label: string, text: string | null | undefined, href?: string): FactRow[] {
  const value = text?.trim();
  if (!value) return [];
  return [{ key, label, lines: [href ? { text: value, href } : { text: value }] }];
}

function equipmentRows(equipment: readonly ProjectEquipment[] | null | undefined): FactRow[] {
  return listOf(equipment).flatMap((item, i) => {
    const label = equipmentLabel(item?.component);
    const brand = textOf(item?.brand);
    if (!label || !brand) return [];
    const name = [brand, textOf(item.model)].filter(Boolean).join(' ');
    const text = isWhole(item.quantity, 1) ? `${name}, ${countWords(item.quantity, 'unit', 'units')}` : name;
    return [{ key: `equipment-${i}`, label, lines: [{ text }] }];
  });
}

export function projectFacts(project: FactsSource): FactGroup[] {
  const meta: SolutionMeta | undefined = SOLUTION_META[project.vertical];

  const financing = [...new Set(listOf(project.financing))].flatMap((method) => {
    const text = financingLabel(method);
    const href = financingHref(project.vertical);
    return text ? [href ? { text, href } : { text }] : [];
  });

  const projectRows: FactRow[] = [
    ...row('site', 'Site', project.siteType),
    ...row('client', 'Client', project.clientName),
    ...row('location', 'Location', project.location),
    ...(meta ? row('service', 'Service', meta.label, meta.slug) : []),
    ...row('status', 'Status', statusLine(project)),
    ...(financing.length > 0 ? [{ key: 'financing', label: 'Financing', lines: financing }] : []),
    ...row('project-value', 'Project value', project.projectValue),
  ];

  const systemRows: FactRow[] = (project.metrics ?? []).flatMap((metric, i) => {
    const label = metric?.label?.trim();
    return label ? row(`system-${i}`, label, metric.value) : [];
  });

  const approvals = listOf(project.approvals).flatMap((approval) => {
    const text = textOf(approval);
    return text ? [{ text }] : [];
  });
  const deliveryRows: FactRow[] = [
    ...(isWhole(project.installationWeeks, 1, 104) ? row('on-site', 'On site', countWords(project.installationWeeks, 'week', 'weeks')) : []),
    ...(approvals.length > 0 ? [{ key: 'approvals', label: 'Approvals', lines: approvals }] : []),
  ];

  const groups: FactGroup[] = [
    { key: 'project', title: 'Project', rows: projectRows },
    { key: 'system', title: 'System', rows: systemRows },
    { key: 'equipment', title: 'Equipment', rows: equipmentRows(project.equipment) },
    { key: 'delivery', title: 'Delivery', rows: deliveryRows },
  ];
  return groups.filter((group) => group.rows.length > 0);
}

/**
 * The compact panel below 1024px. These rows show open, in this order: Client
 * when the client is named, else Site; Location; the first two System rows;
 * Financing. Every other row stays in its group under "All project facts".
 */
export function splitMainRows(groups: readonly FactGroup[]): { main: FactRow[]; rest: FactGroup[] } {
  const projectRows = groups.find((group) => group.key === 'project')?.rows ?? [];
  const systemRows = groups.find((group) => group.key === 'system')?.rows ?? [];
  const byKey = (key: string) => projectRows.find((r) => r.key === key);
  const main = [byKey('client') ?? byKey('site'), byKey('location'), ...systemRows.slice(0, 2), byKey('financing')].filter(
    (r): r is FactRow => Boolean(r),
  );
  const open = new Set(main);
  const rest = groups.flatMap((group) => {
    const rows = group.rows.filter((r) => !open.has(r));
    return rows.length > 0 ? [{ ...group, rows }] : [];
  });
  return { main, rest };
}

/**
 * The full-width facts' grid from 1024px, for the number of groups: a column
 * each, so one or two groups don't stretch across the page. Four 240px columns
 * first fit beside each other at 1280px, so four sit two by two until then.
 */
export function factColumnsClass(groupCount: number): string {
  if (groupCount >= 4) return 'grid-cols-2 xl:grid-cols-4';
  if (groupCount === 3) return 'grid-cols-3';
  if (groupCount === 2) return 'grid-cols-2';
  return 'grid-cols-1 max-w-md';
}
