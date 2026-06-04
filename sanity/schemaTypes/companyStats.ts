import { defineType, defineField } from 'sanity';

/**
 * Singleton document — the four headline stats shown in the home-page CTA
 * footer and the "Phoenix at a glance" About section. Edit once, updates both.
 * Surfaced as a single editable panel via the structure tool in sanity.config.ts.
 */
export const companyStats = defineType({
  name: 'companyStats',
  title: 'Company Stats',
  type: 'document',
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      description: 'Exactly four headline stats. Shown on the home CTA and the About “at a glance” section.',
      validation: (r) => r.length(4).error('Add exactly 4 stats.'),
      of: [
        defineField({
          name: 'stat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The headline figure — e.g. “40”, “10 MWp + 8 MWh”, “R380M”.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Short description beneath the value — e.g. “Projects completed”.',
              validation: (r) => r.required().max(60),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { stat0: 'stats.0.value', stat1: 'stats.1.value' },
    prepare: ({ stat0, stat1 }) => ({
      title: 'Company Stats',
      subtitle: [stat0, stat1].filter(Boolean).join(' · ') || 'Not set',
    }),
  },
});
