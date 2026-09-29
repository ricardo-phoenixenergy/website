// src/lib/projectStory.ts
// A project's story chapters, in order, each only when it has text to show.
// Images inside the text aren't shown on the page, so a chapter holding only an
// image, or only empty blocks, counts as unwritten.
import type { PortableTextBlock } from '@/types/sanity';

export type ChapterKey = 'challenge' | 'solution' | 'outcome';

export interface ProjectChapter {
  key: ChapterKey;
  /** The label above the chapter: "The challenge", "Our solution" or "The outcome". */
  label: string;
  /** The editor's one-line headline, the chapter's h2; null without one, when the label is the h2. */
  headline: string | null;
  content: PortableTextBlock[];
}

/** A project's story fields: each chapter's text and its headline. */
export type ChapterSource = Partial<Record<ChapterKey, PortableTextBlock[] | null>> &
  Partial<Record<`${ChapterKey}Headline`, string | null>>;

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

/** The chapters with text, in order. A headline without text shows no chapter. */
export function projectChapters(project: ChapterSource): ProjectChapter[] {
  return CHAPTERS.flatMap(({ key, label }) => {
    const content = project[key];
    if (!content || !hasText(content)) return [];
    const headline = project[`${key}Headline`]?.trim() || null;
    return [{ key, label, headline, content }];
  });
}
