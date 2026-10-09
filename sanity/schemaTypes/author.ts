import { defineType, defineField } from 'sanity';
import { linkedinUrlError } from './authorRules';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'e.g. "The Strategist · Co-Founder"' }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3, description: '2–4 sentences.' }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Your full profile address, for example https://www.linkedin.com/in/your-name.',
      validation: (rule) => rule.custom((value: string | undefined) => linkedinUrlError(value)),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
