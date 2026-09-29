import { describe, expect, it } from 'vitest';
import { hasText, projectChapters } from './projectStory';
import type { PortableTextBlock } from '@/types/sanity';

const block = (text: string, key = 'k'): PortableTextBlock => ({ _type: 'block', _key: key, children: [{ _type: 'span', _key: `${key}s`, text }] });
const image: PortableTextBlock = { _type: 'image', _key: 'img', asset: { _ref: 'image-abc-10x10-png' } };

describe('projectChapters', () => {
  it('keeps the chapters that have text, in order, with their labels', () => {
    const chapters = projectChapters({ outcome: [block('Lower costs.')], challenge: [block('Peak tariffs.')] });
    expect(chapters.map((c) => [c.key, c.label])).toEqual([
      ['challenge', 'The challenge'],
      ['outcome', 'The outcome'],
    ]);
  });

  it('treats empty blocks, image-only text and missing text as unwritten', () => {
    expect(projectChapters({ challenge: [block('   ')], solution: [image], outcome: [] })).toEqual([]);
    expect(projectChapters({ challenge: null, solution: undefined })).toEqual([]);
  });
});

describe('hasText', () => {
  it('finds words in any text block, and ignores other block types', () => {
    expect(hasText([image, block('A battery twice a day.')])).toBe(true);
    expect(hasText([image])).toBe(false);
    expect(hasText(null)).toBe(false);
  });
});
