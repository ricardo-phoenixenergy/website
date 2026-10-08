// src/components/project/ProjectBand.tsx
// The closing band at the foot of a project page, on the shared ClosingBand. It
// holds the service's booking button, which names the project in its message
// and sends cta_click, and the link to every published project.
import { ClosingBand } from '@/components/ui/ClosingBand';
import { PROJECTS_CTA, type Cta } from '@/config/ctas';
import { REPLY_PROMISE } from '@/config/contact';

interface ProjectBandProps {
  cta: Cta;
  /** cta_click's cta_location, for example "project_band:31-sacks-circle". */
  ctaLocation: string;
  /** No next project sits above it, so it keeps the gap between parts itself. */
  afterStory?: boolean;
}

export function ProjectBand({ cta, ctaLocation, afterStory = false }: ProjectBandProps) {
  return (
    <ClosingBand
      eyebrow="Start your project"
      heading="Ready for a similar project?"
      body={`Tell us about your site. ${REPLY_PROMISE.sentence}`}
      primary={cta}
      primaryLocation={ctaLocation}
      secondary={PROJECTS_CTA}
      afterContent={afterStory}
    />
  );
}
