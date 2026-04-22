// src/lib/portableTextComponents.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextComponents } from '@portabletext/react';
import { Callout } from '@/components/blog/Callout';
import { StatStrip } from '@/components/blog/StatStrip';
import { InlineCta } from '@/components/blog/InlineCta';
import { urlFor } from '@/lib/sanity';

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-xs leading-[1.85] text-[#6B7280] mb-3.5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display font-extrabold text-[17px] text-[#1A1A1A] leading-tight mt-6 mb-2.5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-bold text-sm text-[#1A1A1A] leading-tight mt-[18px] mb-2">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-5 rounded-r-lg pl-4 py-3 pr-3"
        style={{
          borderLeft: '3px solid #709DA9',
          background: 'rgba(112,157,169,0.06)',
        }}
      >
        <p className="font-display font-bold text-[13px] text-[#1A1A1A] italic leading-[1.5]">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#1A1A1A]">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const isExternal = href.startsWith('http');
      return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#39575C] underline underline-offset-2 hover:text-[#2a4045]"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-[#39575C] underline underline-offset-2 hover:text-[#2a4045]">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside font-body text-xs text-[#6B7280] leading-[1.85] mb-3.5 space-y-1 pl-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside font-body text-xs text-[#6B7280] leading-[1.85] mb-3.5 space-y-1 pl-1">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(680).auto('format').url();
      return (
        <figure className="my-5">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={src}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </div>
          {value.caption && (
            <figcaption className="font-body text-[10px] text-[#9CA3AF] text-center italic mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => (
      <Callout
        type={value.type ?? 'info'}
        icon={value.icon}
        title={value.title ?? ''}
        text={value.text ?? ''}
      />
    ),
    statStrip: ({ value }) => (
      <StatStrip stats={value.stats ?? []} />
    ),
    inlineCta: ({ value }) => (
      <InlineCta
        title={value.title ?? ''}
        subtitle={value.subtitle}
        btnText={value.btnText ?? 'Learn more'}
        btnHref={value.btnHref ?? '/contact'}
      />
    ),
  },
};
