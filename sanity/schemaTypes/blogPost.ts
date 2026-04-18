import { defineType, defineField, defineArrayMember } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Display title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }], validation: (r) => r.required() }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (r) => r.required() }),
    defineField({ name: 'updatedAt', title: 'Last updated', type: 'datetime' }),
    defineField({ name: 'featured', title: 'Pinned to top of index', type: 'boolean', initialValue: false }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Industry Insights', value: 'Industry Insights' },
          { title: 'Project Spotlight', value: 'Project Spotlight' },
          { title: 'Company News', value: 'Company News' },
          { title: 'Press Release', value: 'Press Release' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Vertical tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Solar & Storage', 'Wheeling', 'Carbon Credits', 'Energy Optimisation', 'EV Fleets', 'WeBuySolar',
        ],
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() })],
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, description: '155 chars max. Used in cards and as meta description fallback.' }),
    defineField({ name: 'readTime', title: 'Read time (minutes)', type: 'number' }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (r) => r.required() }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),
        defineArrayMember({
          name: 'callout',
          type: 'object',
          title: 'Callout block',
          fields: [
            defineField({ name: 'type', type: 'string', options: { list: ['info', 'warning', 'stat'] } }),
            defineField({ name: 'icon', type: 'string', title: 'Emoji icon' }),
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'text', type: 'text' }),
          ],
        }),
        defineArrayMember({
          name: 'statStrip',
          type: 'object',
          title: 'Stat strip',
          fields: [defineField({
            name: 'stats',
            type: 'array',
            of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'value', type: 'string' }), defineField({ name: 'label', type: 'string' })] })],
          })],
        }),
        defineArrayMember({
          name: 'inlineCta',
          type: 'object',
          title: 'Inline CTA',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'subtitle', type: 'string' }),
            defineField({ name: 'btnText', type: 'string' }),
            defineField({ name: 'btnHref', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({ name: 'seoTitle', title: 'SEO title', type: 'string', description: '60 chars max. Leave blank to use display title.' }),
    defineField({ name: 'seoDescription', title: 'Meta description', type: 'text', rows: 2, description: '155 chars max. Leave blank to use excerpt.' }),
    defineField({ name: 'ogImage', title: 'Social share image', type: 'image', description: '1200×630px. Leave blank to use hero image.' }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', description: 'Only set if content was originally published elsewhere.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'heroImage' },
  },
});
