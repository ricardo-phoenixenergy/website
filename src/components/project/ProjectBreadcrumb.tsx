// src/components/project/ProjectBreadcrumb.tsx
// The row above a project's hero: the breadcrumb (Home / Projects / the project;
// phones drop Home, and a long title ends in an ellipsis) and Copy link.
import Link from 'next/link';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';

interface ProjectBreadcrumbProps {
  title: string;
  /** The page's canonical URL, for Copy link. */
  url: string;
}

const CRUMB_LINK = 'hit-area relative transition-colors duration-150 hover:text-pe-primary';

export function ProjectBreadcrumb({ title, url }: ProjectBreadcrumbProps) {
  return (
    <div className="page-container pt-24">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-1.5 font-body text-sm text-pe-muted">
            <li className="hidden shrink-0 items-center gap-1.5 sm:flex">
              <Link href="/" className={CRUMB_LINK}>
                Home
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li className="flex shrink-0 items-center gap-1.5">
              <Link href="/projects" className={CRUMB_LINK}>
                Projects
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li className="min-w-0">
              <span aria-current="page" className="block truncate font-semibold text-pe-primary">
                {title}
              </span>
            </li>
          </ol>
        </nav>
        <CopyLinkButton url={url} />
      </div>
    </div>
  );
}
