import { defineType, defineField, defineArrayMember } from 'sanity';
import { tableRowWarning, type TableRowValue } from './blogPostRules';

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
      validation: (r) => r.required().assetRequired().warning("Without a hero image, the post is shared with the site's default image and its search data has no image."),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: '155 chars max. Used in cards and as meta description fallback.',
      validation: (r) => r.max(155).warning('Search results show about 155 characters of a description; the rest is cut.'),
    }),
    defineField({ name: 'readTime', title: 'Read time (minutes)', type: 'number' }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      of: [
        // Normal text, two heading levels and a quote: the post's title is its only H1.
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
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
            defineField({
              name: 'type',
              type: 'string',
              description: 'Sets the icon: a note, a caution, or a key figure.',
              options: {
                list: [
                  { title: 'Note', value: 'info' },
                  { title: 'Caution', value: 'warning' },
                  { title: 'Key figure', value: 'stat' },
                ],
              },
            }),
            // The site draws its own icon for each type, so an emoji is no longer shown. Hidden rather than removed, so old content keeps its data.
            defineField({ name: 'icon', type: 'string', title: 'Emoji icon', hidden: true }),
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
          name: 'comparisonTable',
          type: 'object',
          title: 'Comparison table',
          description: 'Compare two to four options side by side, for example Tariff C against Tariff E.',
          fields: [
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: "What the table compares, and on what basis, for example 'Tariff C vs Tariff E, low voltage, from 1 July 2026, excluding VAT'.",
              validation: (r) => r.required(),
            }),
            defineField({ name: 'labelHeader', type: 'string', title: 'First column heading', description: "Optional, for example 'Charge'." }),
            defineField({
              name: 'columns',
              type: 'array',
              title: 'Columns',
              description: 'The options compared, one per column, for example Tariff C and Tariff E.',
              of: [defineArrayMember({ type: 'string' })],
              validation: (r) => r.required().min(1).max(4),
            }),
            defineField({
              name: 'rows',
              type: 'array',
              title: 'Rows',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'comparisonRow',
                  fields: [
                    defineField({ name: 'label', type: 'string', title: 'Label', description: 'Heads the row, for example Demand charge.' }),
                    defineField({ name: 'values', type: 'array', title: 'Values', description: 'One per column, in the same order.', of: [defineArrayMember({ type: 'string' })] }),
                  ],
                  preview: { select: { title: 'label' } },
                  validation: (r) =>
                    r.custom((row, context) => tableRowWarning(row as TableRowValue | undefined, (context.parent as { columns?: string[] } | undefined)?.columns)).warning(),
                }),
              ],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: 'caption' }, prepare: ({ title }) => ({ title: title || 'Comparison table', subtitle: 'Comparison table' }) },
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
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      description: '60 chars max. Leave blank to use display title.',
      validation: (r) => r.max(60).warning('Search results show about 60 characters of a title; the rest is cut.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      description: '155 chars max. Leave blank to use excerpt.',
      validation: (r) => r.max(155).warning('Search results show about 155 characters of a description; the rest is cut.'),
    }),
    defineField({ name: 'ogImage', title: 'Social share image', type: 'image', description: '1200×630px. Leave blank to use hero image.' }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', description: 'Only set if content was originally published elsewhere.' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'heroImage' },
  },
});
