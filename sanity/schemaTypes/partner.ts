import { defineType, defineField } from 'sanity';

export const partner = defineType({
  name: 'partner',
  title: 'Partner / Investor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Upload a PNG or SVG with a transparent background. Will be displayed on white.',
      options: { hotspot: false },
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Optional — clicking the logo card will open this link.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Investors & Financiers', value: 'investors' },
          { title: 'Partners', value: 'partners' },
          { title: 'Media & Press', value: 'media' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower = appears first within its category.',
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
    select: { title: 'name', subtitle: 'category', media: 'logo' },
    prepare({ title, subtitle, media }) {
      const labels: Record<string, string> = {
        investors: 'Investors & Financiers',
        partners: 'Partners',
        media: 'Media & Press',
      };
      return { title, subtitle: labels[subtitle] ?? subtitle, media };
    },
  },
});
