// The blog post schema as the Studio gets it: the body's block styles and the
// warnings on the search fields.
import { describe, expect, it, vi } from 'vitest';

// defineType, defineField and defineArrayMember hand back the definition they
// are given. The real package loads the whole Studio, which this test doesn't need.
vi.mock('sanity', () => ({
  defineType: <T,>(definition: T) => definition,
  defineField: <T,>(definition: T) => definition,
  defineArrayMember: <T,>(definition: T) => definition,
}));

import { blogPost } from './blogPost';

interface Definition {
  name?: string;
  type: string;
  of?: Definition[];
  styles?: Array<{ value: string }>;
  validation?: unknown;
}

const fields = blogPost.fields as unknown as Definition[];
const field = (name: string): Definition => {
  const found = fields.find((f) => f.name === name);
  if (!found) throw new Error(`No field "${name}"`);
  return found;
};

/** Runs a field's validation against a stand-in rule, recording each call. */
function calls(definition: Definition): string[] {
  const seen: string[] = [];
  const rule: Record<string, unknown> = new Proxy(
    {},
    {
      get: (_target, method: string) => (...args: unknown[]) => {
        seen.push(args.length > 0 ? `${method}(${args.map(String).join(',')})` : method);
        return rule;
      },
    },
  );
  if (typeof definition.validation === 'function') definition.validation(rule);
  return seen;
}

describe('the blog post schema', () => {
  it('offers the body Normal, Heading 2, Heading 3 and Quote, so the title stays the only H1', () => {
    const block = field('body').of?.find((member) => member.type === 'block');
    expect(block?.styles?.map((style) => style.value)).toEqual(['normal', 'h2', 'h3', 'blockquote']);
  });

  it.each([
    ['seoTitle', 60],
    ['seoDescription', 155],
    ['excerpt', 155],
  ] as const)('warns, without blocking, when %s runs past %i characters', (name, max) => {
    const seen = calls(field(name));
    expect(seen[0]).toBe(`max(${max})`);
    expect(seen[1]).toMatch(/^warning\(/);
  });

  it('warns, without blocking, when a post has no hero image', () => {
    const seen = calls(field('heroImage'));
    expect(seen[0]).toBe('required');
    expect(seen[1]).toMatch(/^warning\(/);
  });
});
