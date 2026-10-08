// src/lib/postTextComponents.tsx
// Portable Text for a post's body: the shared blog set, with an id on each h2
// and h3 for the table of contents. Ids come from postHeadings() and are found
// by the block's _key, so two headings with the same words keep their own ids
// ("summary", "summary-2"). A heading with no entry renders without an id.
// html's scroll-padding-top (6rem, the navbar's clearance) plus the 1rem margin
// here lands a heading 112px from the top after a jump, under the navbar pill.
import type { PortableTextBlockComponent, PortableTextComponents } from '@portabletext/react';
import { POST_H2_CLASS, POST_H3_CLASS, portableTextComponents } from '@/lib/portableTextComponents';
import type { PostHeading } from '@/lib/blogUtils';

export function postTextComponents(headings: PostHeading[]): PortableTextComponents {
  const ids = new Map(headings.map((h) => [h.key, h.id]));
  const idOf = (key: unknown) => (typeof key === 'string' ? ids.get(key) : undefined);

  const h2: PortableTextBlockComponent = ({ children, value }) => (
    <h2 id={idOf(value._key)} className={`${POST_H2_CLASS} scroll-mt-4`}>
      {children}
    </h2>
  );
  const h3: PortableTextBlockComponent = ({ children, value }) => (
    <h3 id={idOf(value._key)} className={`${POST_H3_CLASS} scroll-mt-4`}>
      {children}
    </h3>
  );

  const shared = portableTextComponents.block;
  return {
    ...portableTextComponents,
    block: { ...(typeof shared === 'object' ? shared : {}), h2, h3 },
  };
}
