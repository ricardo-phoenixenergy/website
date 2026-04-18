import { defineType, defineField } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    // Studio UI ordered per spec: photo first
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', description: 'e.g. "Erin Berman-Levy, Co-Founder, Phoenix Energy"' })],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', title: 'Full name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / Job title', type: 'string', description: 'Max ~40 chars. e.g. "Co-Founder & CEO"', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Founders', value: 'founders' },
          { title: 'Business', value: 'business' },
          { title: 'Technical', value: 'technical' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'archetype', title: 'Archetype (optional)', type: 'string', description: 'e.g. "The Strategist". Shown below role on card.' }),
    defineField({ name: 'order', title: 'Display order', type: 'number', description: 'Lower = earlier within category. 1, 2, 3...', validation: (r) => r.required() }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', description: 'Uncheck to hide without deleting.', initialValue: true }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4, description: '2–4 sentences. Not shown on grid card — reserved for future profile pages.' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
