// src/lib/projectTextComponents.tsx
// Portable Text for a project's story chapters. Paragraphs are 17px (16px on
// phones). Every heading style becomes a subheading (h3), because the chapter
// itself is the h2. Lists and marks follow the shared blog set. Images inside
// the text aren't shown: site photos belong in the gallery.
import type { ReactNode } from 'react';
import type { PortableTextComponents } from '@portabletext/react';
import { portableTextComponents } from '@/lib/portableTextComponents';

const TEXT = 'font-body text-base leading-[1.75] text-pe-text-soft md:text-[17px]';

function Paragraph({ children }: { children?: ReactNode }) {
  return <p className={`${TEXT} mb-4 last:mb-0`}>{children}</p>;
}

function Subheading({ children }: { children?: ReactNode }) {
  return <h3 className="mb-2 mt-6 font-display text-lg font-bold leading-[1.3] text-pe-text">{children}</h3>;
}

const LIST = `${TEXT} mb-4 list-outside space-y-1.5 pl-6 marker:text-pe-muted`;

export const projectTextComponents: PortableTextComponents = {
  block: {
    normal: Paragraph,
    blockquote: Paragraph,
    h1: Subheading,
    h2: Subheading,
    h3: Subheading,
    h4: Subheading,
    h5: Subheading,
    h6: Subheading,
  },
  marks: portableTextComponents.marks,
  list: {
    bullet: ({ children }) => <ul className={`list-disc ${LIST}`}>{children}</ul>,
    number: ({ children }) => <ol className={`list-decimal ${LIST}`}>{children}</ol>,
  },
  listItem: portableTextComponents.listItem,
  types: {
    image: () => null,
  },
};
