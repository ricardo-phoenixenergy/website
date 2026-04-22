import { defineType, defineField } from 'sanity';

export const milestoneTimeline = defineType({
  name: 'milestoneTimeline',
  title: 'Timeline Milestone',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date label',
      type: 'string',
      description: 'Display label only — e.g. "March 2026", "2019", "2030". Not a date picker.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Milestone title',
      type: 'string',
      description: 'One sentence. e.g. "First C&I solar installation commissioned in Gauteng"',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'isFuture',
      title: 'Future / Vision milestone',
      type: 'boolean',
      description: 'True = aspirational (dashed track, Vision badge). False = historical event.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower = earlier on the timeline. 1, 2, 3...',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide without deleting.',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'date', subtitle: 'title' },
  },
});
