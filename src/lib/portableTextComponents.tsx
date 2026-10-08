// src/lib/portableTextComponents.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { PortableTextComponents } from '@portabletext/react';
import { Callout } from '@/components/blog/Callout';
import { StatStrip } from '@/components/blog/StatStrip';
import { InlineCta } from '@/components/blog/InlineCta';
import { urlFor } from '@/lib/sanity';

// The body headings. The h2 matches the project page's chapter headline (26px);
// the h3 stays at 20px, a clear third level for a long article.
// postTextComponents adds the ids the table of contents links to.
export const POST_H2_CLASS = 'font-display font-extrabold text-[26px] text-pe-text leading-[1.2] mt-12 mb-4 text-balance';
export const POST_H3_CLASS = 'font-display font-bold text-xl text-pe-text leading-[1.3] mt-9 mb-3';

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-lg leading-[1.75] text-pe-text-soft mb-6">{children}</p>
    ),
    h2: ({ children }) => <h2 className={POST_H2_CLASS}>{children}</h2>,
    h3: ({ children }) => <h3 className={POST_H3_CLASS}>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 rounded-r-lg border-l-[3px] border-pe-secondary bg-pe-secondary/6 py-4 pl-5 pr-4">
        <p className="font-display font-bold text-xl text-pe-text italic leading-[1.45]">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-pe-text">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const isExternal = href.startsWith('http');
      return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pe-primary underline underline-offset-2 hover:text-pe-primary-hover"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-pe-primary underline underline-offset-2 hover:text-pe-primary-hover">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 font-body text-lg text-pe-text-soft leading-[1.75] mb-6 space-y-2 marker:text-pe-muted">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 font-body text-lg text-pe-text-soft leading-[1.75] mb-6 space-y-2 marker:text-pe-muted">
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
      const blurSrc: string | undefined = value?.asset?.metadata?.lqip;
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={src}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
              {...(blurSrc ? { placeholder: 'blur', blurDataURL: blurSrc } : {})}
            />
          </div>
          {value.caption && (
            <figcaption className="font-body text-sm text-pe-muted text-center mt-3">
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
