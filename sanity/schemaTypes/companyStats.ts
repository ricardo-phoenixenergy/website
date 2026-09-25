import { defineType, defineField } from 'sanity';

/**
 * Singleton document: the four headline stats shown in the home-page "By the
 * numbers" strip and the "Phoenix at a glance" About section. Edit once, updates both.
 * Surfaced as a single editable panel via the structure tool in sanity.config.ts.
 *
 * Each stat can record what it counts, how it was worked out, the evidence and
 * the date it was true. These are the company stats' rows in the claims register
 * (docs/content/claims-register.md). Only the date shows on the site, as an
 * "As at …" caption; the rest is for whoever has to stand behind the figure.
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
      description: 'Exactly four headline stats. Shown on the home "By the numbers" strip and the About "at a glance" section.',
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
              description: 'The headline figure, for example “40+” or “10 MWp”.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Short description beneath the value, for example “Projects completed”.',
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: 'definition',
              title: 'What it counts',
              type: 'text',
              rows: 2,
              description: 'Definition and scope: what counts towards the figure and what doesn’t (for example, whether projects under development are included). Not shown on the site.',
            }),
            defineField({
              name: 'basis',
              title: 'How it was worked out',
              type: 'text',
              rows: 2,
              description: 'Counted, measured or estimated, and from what. Not shown on the site.',
            }),
            defineField({
              name: 'source',
              title: 'Evidence',
              type: 'string',
              description: 'Where the proof is kept: a project list, commissioning certificates, a report. Not shown on the site.',
            }),
            defineField({
              name: 'asOf',
              title: 'As at',
              type: 'date',
              description: 'The date the figure was true. When set, the site shows “As at 30 June 2026” under the stat.',
              options: { dateFormat: 'D MMMM YYYY' },
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
