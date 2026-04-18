import { defineType, defineField } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'vertical',
      title: 'Solution vertical',
      type: 'string',
      options: {
        list: [
          { title: 'C&I Solar & Storage', value: 'ci-solar-storage' },
          { title: 'Wheeling', value: 'wheeling' },
          { title: 'Energy Optimisation', value: 'energy-optimisation' },
          { title: 'Carbon Credits', value: 'carbon-credits' },
          { title: 'WeBuySolar', value: 'webuysolar' },
          { title: 'EV Fleets & Infrastructure', value: 'ev-fleets' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'clientName', title: 'Client name', type: 'string' }),
    defineField({ name: 'systemSize', title: 'System size', type: 'string', description: 'e.g. "4.8 MW"' }),
    defineField({ name: 'completionDate', title: 'Completion date', type: 'string', description: 'e.g. "Q3 2024"' }),
    defineField({ name: 'projectValue', title: 'Project value', type: 'string', description: 'e.g. "R42M"' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['completed', 'in-progress', 'planned'] },
      initialValue: 'completed',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', description: 'e.g. "Shoprite DC rooftop solar array — Centurion, GP"' })],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }],
    }),
    defineField({ name: 'summary', title: 'Project summary', type: 'text', rows: 3, description: '2–3 sentences introducing the project.' }),
    defineField({ name: 'challenge', title: 'The challenge', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'solution', title: 'Our solution', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'outcome', title: 'The outcome', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'metrics',
      title: 'Stats strip metrics (4 items)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'value', type: 'string', title: 'Value' },
        ],
      }],
    }),
    defineField({
      name: 'results',
      title: 'Results strip (4 items)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'value', type: 'string', title: 'Value' },
        ],
      }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'vertical', media: 'heroImage' },
  },
});
