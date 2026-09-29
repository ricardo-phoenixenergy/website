// src/components/project/ProjectStory.tsx
// The story and the facts.
// - With at least one chapter, from 1024px: two columns. The lead paragraph and
//   the chapters (up to 38rem wide) sit beside the 340px facts panel, which
//   stays in view while it fits in the window.
// - With chapters, below 1024px: one column, with the compact facts after the
//   lead paragraph.
// - With no chapter: the lead paragraph, then the facts full width, in columns
//   from 1024px.
// Both facts versions are rendered and each is hidden at the other widths, so
// only one is ever in the accessibility tree.
import { PortableText } from '@portabletext/react';
import type { Cta } from '@/config/ctas';
import type { FactGroup } from '@/lib/projectFacts';
import type { ProjectChapter } from '@/lib/projectStory';
import { projectTextComponents } from '@/lib/projectTextComponents';
import { ProjectFacts } from './ProjectFacts';
import { StickyWhenFits } from './StickyWhenFits';

interface ProjectStoryProps {
  summary?: string | null;
  chapters: ProjectChapter[];
  facts: FactGroup[];
  cta: Cta;
  /** cta_click's cta_location for the facts' booking button. */
  ctaLocation: string;
}

function Lead({ summary }: { summary: string }) {
  return <p className="max-w-[34em] font-body text-lg leading-[1.6] text-pe-text md:text-xl">{summary}</p>;
}

function Chapters({ chapters }: { chapters: ProjectChapter[] }) {
  return (
    <div className="flex flex-col gap-10">
      {chapters.map((chapter) => (
        <section key={chapter.key} aria-labelledby={`chapter-${chapter.key}`} className="max-w-[38rem]">
          <h2 id={`chapter-${chapter.key}`} className="font-body text-xs font-bold uppercase tracking-[0.1em] text-pe-muted">
            {chapter.label}
          </h2>
          <div className="mt-3">
            <PortableText value={chapter.content} components={projectTextComponents} />
          </div>
        </section>
      ))}
    </div>
  );
}

export function ProjectStory({ summary, chapters, facts, cta, ctaLocation }: ProjectStoryProps) {
  const lead = summary?.trim();

  if (chapters.length === 0) {
    return (
      <div className="page-container mt-10 md:mt-12 lg:mt-16">
        {lead && (
          <div className="mb-8">
            <Lead summary={lead} />
          </div>
        )}
        <ProjectFacts groups={facts} cta={cta} ctaLocation={ctaLocation} variant="compact" className="lg:hidden" />
        <ProjectFacts groups={facts} cta={cta} ctaLocation={ctaLocation} variant="columns" className="hidden lg:block" />
      </div>
    );
  }

  return (
    <div className="page-container mt-10 md:mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-14">
      <div className="min-w-0">
        {lead && <Lead summary={lead} />}
        <ProjectFacts groups={facts} cta={cta} ctaLocation={ctaLocation} variant="compact" className={lead ? 'mt-8 lg:hidden' : 'lg:hidden'} />
        <div className={lead ? 'mt-10' : 'mt-10 lg:mt-0'}>
          <Chapters chapters={chapters} />
        </div>
      </div>
      <div className="hidden lg:block">
        <StickyWhenFits>
          <ProjectFacts groups={facts} cta={cta} ctaLocation={ctaLocation} variant="panel" />
        </StickyWhenFits>
      </div>
    </div>
  );
}
