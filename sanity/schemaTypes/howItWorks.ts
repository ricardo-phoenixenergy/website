import { defineType, defineField } from 'sanity';

/**
 * The "How It Works" section content for a single page. Managed as 7 fixed-ID
 * singletons (home + 6 solution verticals) via the structure tool in
 * sanity.config.ts. When a document has no title or no steps, the page hides
 * the section entirely (see src/lib/getHowItWorks.ts).
 */
export const howItWorks = defineType({
  name: 'howItWorks',
  title: 'How It Works',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above the title.',
      initialValue: 'How it works',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Wrap the accent word(s) in <em></em>, e.g. From assessment to <em>savings in weeks</em>.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short sentence beneath the title.',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (r) => r.min(2).error('Add at least 2 steps.'),
      of: [
        defineField({
          name: 'step',
          title: 'Step',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, validation: (r) => r.required() }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', description: 'Optional pill, e.g. "Free", "5-7 days".' }),
          ],
          preview: { select: { title: 'label', subtitle: 'tag' } },
        }),
      ],
    }),
    defineField({
      name: 'showCta',
      title: 'Show CTA button',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      hidden: ({ parent }) => !parent?.showCta,
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA link',
      type: 'string',
      description: 'e.g. /contact',
      hidden: ({ parent }) => !parent?.showCta,
    }),
  ],
  preview: {
    select: { title: 'title', steps: 'steps' },
    prepare: ({ title, steps }) => ({
      title: title || 'Untitled',
      subtitle: `${Array.isArray(steps) ? steps.length : 0} step(s)`,
    }),
  },
});
