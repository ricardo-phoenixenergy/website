// src/components/project/ProjectHero.tsx
// A project's hero: one photo and one H1 at every width, laid out by CSS.
// - From 768px the photo runs edge to edge (400px tall, 470px from 1024px)
//   under a Night Teal scrim. The badge, H1 and the line under the headline sit
//   over it: 92px above its foot when the results card overlaps it, 40px when not.
// - Below 768px the photo is 4:3 inside the page margins, with the text under it
//   on the page background.
// - Without a photo, phones show no photo block and wider screens show the
//   service's colour gradient.
import Image from 'next/image';
import Link from 'next/link';
import { SOLUTION_META, type SolutionMeta } from '@/types/solutions';
import type { Project } from '@/types/sanity';
import { metaLine } from '@/lib/projectMeta';
import { objectPositionFor } from '@/lib/projectPhotos';

type HeroProject = Pick<Project, 'title' | 'vertical' | 'heroImage' | 'location' | 'status' | 'completionDate'>;

interface ProjectHeroProps {
  project: HeroProject;
  /** The results card overlaps the photo's foot, so the text sits higher. */
  overlapped: boolean;
}

const FALLBACK_BLUR = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Clear at the top to Night Teal at 92% at the foot. The 66% middle stop keeps the line under
// the headline (on-dark-muted) at 4.5:1 or more over both live projects' photos from 768px.
const SCRIM =
  'linear-gradient(180deg, color-mix(in srgb, var(--color-pe-nav-dark) 5%, transparent) 20%, color-mix(in srgb, var(--color-pe-nav-dark) 66%, transparent) 58%, color-mix(in srgb, var(--color-pe-nav-dark) 92%, transparent) 100%)';

const HERO_SIZES = '(max-width: 639px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 48px), 100vw';

export function ProjectHero({ project, overlapped }: ProjectHeroProps) {
  const meta: SolutionMeta | undefined = SOLUTION_META[project.vertical];
  const line = metaLine(project);
  const photo = project.heroImage?.asset?.url ? project.heroImage : null;

  return (
    <section aria-labelledby="project-title" className="relative mt-3 md:mt-4">
      <div
        className={`relative mx-4 aspect-[4/3] overflow-hidden rounded-card sm:mx-6 md:mx-0 md:aspect-auto md:h-[400px] md:rounded-none lg:h-[470px] ${photo ? '' : 'hidden md:block'}`}
      >
        {photo ? (
          <Image
            src={photo.asset.url}
            alt={photo.alt ?? project.title}
            fill
            preload
            sizes={HERO_SIZES}
            className="object-cover"
            style={{ objectPosition: objectPositionFor(photo) }}
            placeholder="blur"
            blurDataURL={photo.asset.metadata?.lqip ?? FALLBACK_BLUR}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: meta
                ? `linear-gradient(135deg, ${meta.accent}44 0%, var(--color-pe-nav-dark) 100%)`
                : 'var(--color-pe-nav-dark)',
            }}
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 hidden md:block" style={{ background: SCRIM }} />
      </div>

      {/* From 768px the text sits over the photo, where the focus ring turns white, as .focus-on-dark does. */}
      <div
        className={`md:absolute md:inset-x-0 md:bottom-0 md:[--ring-color:#FFFFFF] md:[--ring-halo:var(--color-pe-nav-dark)] ${overlapped ? 'md:pb-[92px]' : 'md:pb-10'}`}
      >
        <div className="page-container pt-4 md:pt-0">
          {meta && (
            <Link
              href={meta.slug}
              className="hit-area relative inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-bold uppercase tracking-[0.08em] transition-[filter] duration-200 hover:brightness-95"
              style={{ background: meta.accent, color: meta.accentText }}
            >
              {meta.label}
            </Link>
          )}
          <h1
            id="project-title"
            className="mt-3 max-w-[25ch] break-words text-balance font-display text-[28px] font-extrabold leading-[1.15] text-pe-text md:mt-3.5 md:text-4xl md:leading-[1.08] md:text-white lg:text-[44px]"
          >
            {project.title}
          </h1>
          {(line.place.length > 0 || line.when) && (
            <p className="mt-2 font-body text-sm text-pe-muted md:mt-3 md:text-base md:text-on-dark-muted">
              {line.place.length > 0 && <span className="block md:inline">{line.place.join(' · ')}</span>}
              {line.when && (
                <span className="block md:inline">
                  {line.place.length > 0 && <span className="hidden md:inline"> · </span>}
                  {line.when}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
