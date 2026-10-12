// src/lib/locationAreas.ts
// The areas with their own commercial solar page under the C&I solution
// (docs/superpowers/specs/2026-10-12-location-pages-design.md). The project
// schema's Service area list, the page route, the sitemap and the webhook all
// read this list, so a page and its project tag can't drift apart. No imports:
// the Studio schema loads this file too.

export const LOCATION_AREAS = ['gauteng', 'pretoria-centurion'] as const;

export type LocationArea = (typeof LOCATION_AREAS)[number];

/** The area's name, as the Studio list and the breadcrumb show it. */
export const LOCATION_AREA_LABEL: Record<LocationArea, string> = {
  gauteng: 'Gauteng',
  'pretoria-centurion': 'Pretoria and Centurion',
};

/** The solution page the area pages sit under. */
export const LOCATION_PARENT_PATH = '/solutions/ci-solar-storage';

/** The area page's path. */
export function locationPath(area: LocationArea): string {
  return `${LOCATION_PARENT_PATH}/${area}`;
}

/** True only for an exact slug; the route 404s anything else. */
export function isLocationArea(value: string): value is LocationArea {
  return (LOCATION_AREAS as readonly string[]).includes(value);
}
