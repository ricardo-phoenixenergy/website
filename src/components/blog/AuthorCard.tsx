// src/components/blog/AuthorCard.tsx
// "About the author" in the shared SidePanel frame: the 44px photo (or the
// initials disc), the name as a link to the author's page, the role, and the
// bio only when there is one, so a short card leaves no empty gap. The photo's
// alt text is empty: the name sits beside it.
import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { initials } from '@/lib/blogUtils';
import { SidePanel } from '@/components/ui/SidePanel';

interface AuthorCardProps {
  author: Author;
  className?: string;
  /** The heading id: the page renders two cards (one hidden at each width), each with its own. */
  titleId?: string;
}

export function AuthorCard({ author, className, titleId = 'author-title' }: AuthorCardProps) {
  const photoSrc = author.photo?.asset ? urlFor(author.photo).width(88).height(88).url() : null;
  const lqip = author.photo?.asset?.metadata?.lqip ?? null;
  const bio = author.bio?.trim();

  return (
    <SidePanel title="About the author" titleId={titleId} className={className}>
      <div className="mt-4 flex items-center gap-3">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
            {...(lqip ? { placeholder: 'blur' as const, blurDataURL: lqip } : {})}
          />
        ) : (
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pe-primary font-display text-sm font-bold text-white">
            {initials(author.name)}
          </span>
        )}
        <div className="min-w-0">
          <Link
            href={`/blog/authors/${author.slug.current}`}
            className="hit-area relative font-display text-base font-bold leading-tight text-pe-text transition-colors duration-150 hover:text-pe-primary"
          >
            {author.name}
          </Link>
          {author.role && <p className="mt-0.5 font-body text-sm text-pe-secondary-ink">{author.role}</p>}
        </div>
      </div>
      {bio && <p className="mt-3 font-body text-sm leading-[1.65] text-pe-muted">{bio}</p>}
    </SidePanel>
  );
}
