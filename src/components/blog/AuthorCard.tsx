import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const photoSrc = author.photo?.asset
    ? urlFor(author.photo).width(88).height(88).url()
    : null;
  const lqip = author.photo?.asset?.metadata?.lqip ?? null;

  return (
    <div className="bg-white rounded-[14px] p-[18px]" style={{ border: '1px solid #E5E7EB' }}>
      <Link
        href={`/blog/authors/${author.slug.current}`}
        className="flex items-start gap-3 mb-3 group"
      >
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={author.name}
            width={44}
            height={44}
            className="rounded-full object-cover flex-shrink-0"
            {...(lqip ? { placeholder: 'blur' as const, blurDataURL: lqip } : {})}
          />
        ) : (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#39575C' }}
          >
            <span className="font-display font-bold text-sm text-white">{initials(author.name)}</span>
          </div>
        )}
        <div>
          <p className="font-display font-bold text-[13px] text-[#1A1A1A] leading-tight group-hover:text-[#39575C] transition-colors">
            {author.name}
          </p>
          {author.role && (
            <p className="font-body font-medium text-[10px] mt-0.5" style={{ color: '#709DA9' }}>
              {author.role}
            </p>
          )}
        </div>
      </Link>
      {author.bio && (
        <p className="font-body text-[11px] text-[#6B7280] leading-[1.65]">{author.bio}</p>
      )}
    </div>
  );
}
