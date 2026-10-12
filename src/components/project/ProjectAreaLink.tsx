// src/components/project/ProjectAreaLink.tsx
// On a project page, a link to the commercial solar page for the project's area.
import { ArrowLink } from '@/components/ui/ArrowLink';
import { LOCATION_AREA_LABEL, isLocationArea, locationPath } from '@/lib/locationAreas';

export function ProjectAreaLink({ serviceArea, vertical }: { serviceArea?: string | null; vertical: string }) {
  if (!serviceArea || vertical !== 'ci-solar-storage' || !isLocationArea(serviceArea)) return null;
  return (
    <div className="page-container py-8">
      <ArrowLink href={locationPath(serviceArea)} size="lg">
        More commercial solar in {LOCATION_AREA_LABEL[serviceArea]}
      </ArrowLink>
    </div>
  );
}
