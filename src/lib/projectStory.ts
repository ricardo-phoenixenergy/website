// src/lib/projectStory.ts
// A project's story chapters, in order, each only when it has text to show.
// Images inside the text aren't shown on the page, so a chapter holding only an
// image, or only empty blocks, counts as unwritten.
import type { PortableTextBlock } from '@/types/sanity';

export type ChapterKey = 'challenge' | 'solution' | 'outcome';

export interface ProjectChapter {
  key: ChapterKey;
  /** The label above the chapter, which is also its h2 until chapters get headlines (step 2). */
  label: string;
  content: PortableTextBlock[];
}

const CHAPTERS: ReadonlyArray<{ key: ChapterKey; label: string }> = [
  { key: 'challenge', label: 'The challenge' },
  { key: 'solution', label: 'Our solution' },
  { key: 'outcome', label: 'The outcome' },
];

function blockText(block: PortableTextBlock): string {
  if (block._type !== 'block' || !Array.isArray(block.children)) return '';
  return block.children
    .map((child: unknown) => {
      const text = (child as { text?: unknown } | null)?.text;
      return typeof text === 'string' ? text : '';
    })
    .join('');
}

/** True when some text block has words in it. */
export function hasText(blocks: readonly PortableTextBlock[] | null | undefined): boolean {
  return (blocks ?? []).some((block) => blockText(block).trim() !== '');
}

export function projectChapters(project: Partial<Record<ChapterKey, PortableTextBlock[] | null>>): ProjectChapter[] {
  return CHAPTERS.flatMap(({ key, label }) => {
    const content = project[key];
    return content && hasText(content) ? [{ key, label, content }] : [];
  });
}
