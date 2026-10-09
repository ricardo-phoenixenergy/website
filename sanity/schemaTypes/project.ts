// sanity/schemaTypes/project.ts
// A project: the project page, the project cards and the Studio's form
// (specs/06-PROJECT-SINGLE.md, specs/12-CMS.md). Every field is optional
// unless marked required, with a fallback on the site, so a project that
// doesn't set one keeps working. What a field holds shows on the site as
// written: the client's name wherever it is set, and any rand amount in the
// figures or System rows.
import { defineArrayMember, defineField, defineType } from 'sanity';
import { EQUIPMENT_COMPONENTS, FINANCING_METHODS } from '../../src/lib/projectOptions';
import { commissionedWarning, heroWidthWarning, resultsCountWarning, systemRowsWarning } from './projectRules';

const ALT_HELP = "What the photo shows, for people who can't see it.";
const CHAPTER_HEADLINE_HELP =
  "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'.";

// The story's text: Normal and Subheading styles, bullet and numbered lists,
// bold, italic and links. The page shows no images inside the text, so the
// chapters don't offer them.
const storyBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Subheading', value: 'h3' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            type: 'url',
            title: 'Link to',
            validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
          }),
        ],
      },
    ],
  },
});

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'results', title: 'Impact' },
    { name: 'story', title: 'Story' },
    { name: 'facts', title: 'Facts' },
    { name: 'photos', title: 'Photos' },
    { name: 'search', title: 'Search' },
  ],
  fields: [
    /* ─── Overview ─── */
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'overview',
      description:
        "The page heading: what was built and where, for example 'Rooftop solar and a battery for a Cape Town logistics warehouse'. Leave empty to use the project title. Search results use it too.",
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'vertical',
      title: 'Solution vertical',
      type: 'string',
      group: 'overview',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteType',
      title: 'Site type',
      type: 'string',
      group: 'overview',
      description: "What the site is, in two or three words, for example 'Logistics warehouse' or 'Office park'.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'overview',
      options: { list: ['completed', 'in-progress', 'planned'] },
      initialValue: 'completed',
    }),
    defineField({
      name: 'commissionedOn',
      title: 'Completion date',
      type: 'date',
      group: 'overview',
      description:
        "The day the project was completed or, for a planned or in-progress project, the day it's due. Shown as the month and year, for example 'Completed June 2026' or 'Planned for September 2027', and used to order the project lists, latest first.",
      options: { dateFormat: 'D MMMM YYYY' },
      validation: (rule) => rule.custom((value, context) => commissionedWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'financing',
      title: 'Financing',
      type: 'array',
      group: 'overview',
      description: "How the client paid for the system. Once this is set, delete any 'Deal structure' row from System.",
      of: [defineArrayMember({ type: 'string' })],
      options: { list: [...FINANCING_METHODS], layout: 'grid' },
      validation: (rule) => rule.max(3).unique(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client name',
      type: 'string',
      group: 'overview',
      description: 'Shown on this page and on project cards. Fill it in only once the client has agreed in writing to be named.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Flagship',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
      description:
        'Shows this project in the projects section on the home page. On /projects, featured projects come first, and once there are enough projects to filter, the first one leads as the large card.',
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured order',
      type: 'number',
      group: 'overview',
      description:
        'Its place among the featured projects, on the home page and at the top of /projects: lower numbers come first (1, 2, 3). Give each featured project its own number. One without a number comes after those with one.',
    }),
    // Never shown on the site. Hidden rather than removed, so the data stays.
    defineField({ name: 'systemSize', title: 'System size', type: 'string', hidden: true }),

    /* ─── Results ─── */
    defineField({
      name: 'results',
      title: 'Results (up to 4)',
      type: 'array',
      group: 'results',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'value', type: 'string', title: 'Value' }),
            defineField({
              name: 'note',
              type: 'string',
              title: 'Note',
              description: "The period and the baseline, for example 'Year 1, against 2025 municipal bills'.",
              validation: (rule) => rule.max(70),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.custom((value) => resultsCountWarning(value)).warning(),
    }),

    /* ─── Story ─── */
    defineField({
      name: 'summary',
      title: 'Project summary',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'Two or three sentences introducing the project.',
    }),
    defineField({
      name: 'challengeHeadline',
      title: 'The challenge: headline',
      type: 'string',
      group: 'story',
      description: CHAPTER_HEADLINE_HELP,
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'challenge',
      title: 'The challenge',
      type: 'array',
      group: 'story',
      of: [storyBlock],
    }),
    defineField({
      name: 'solutionHeadline',
      title: 'Our solution: headline',
      type: 'string',
      group: 'story',
      description: CHAPTER_HEADLINE_HELP,
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'solution',
      title: 'Our solution',
      type: 'array',
      group: 'story',
      of: [storyBlock],
    }),
    defineField({
      name: 'outcomeHeadline',
      title: 'The outcome: headline',
      type: 'string',
      group: 'story',
      description: CHAPTER_HEADLINE_HELP,
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'outcome',
      title: 'The outcome',
      type: 'array',
      group: 'story',
      of: [storyBlock],
    }),

    /* ─── Facts ─── */
    defineField({
      name: 'metrics',
      title: 'System (2 to 4 rows)',
      type: 'array',
      group: 'facts',
      description: "The system, for example 'Solar PV' with '[size] kWp'.",
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'value', type: 'string', title: 'Value' }),
          ],
        }),
      ],
      validation: (rule) => rule.custom((value) => systemRowsWarning(value)).warning(),
    }),
    defineField({
      name: 'equipment',
      title: 'Equipment',
      type: 'array',
      group: 'facts',
      description: 'Each main component as installed: its brand, model and how many.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'component',
              type: 'string',
              title: 'Component',
              options: { list: [...EQUIPMENT_COMPONENTS] },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'brand',
              type: 'string',
              title: 'Brand',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'model',
              type: 'string',
              title: 'Model',
            }),
            defineField({ name: 'quantity', type: 'number', title: 'Quantity', validation: (rule) => rule.integer().min(1) }),
          ],
          preview: { select: { title: 'brand', subtitle: 'model' } },
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'installationWeeks',
      title: 'Weeks on site',
      type: 'number',
      group: 'facts',
      description: 'Weeks from starting on site to commissioning.',
      validation: (rule) => rule.integer().min(1).max(104),
    }),
    defineField({
      name: 'approvals',
      title: 'Approvals and certificates',
      type: 'array',
      group: 'facts',
      description: "Each approval or certificate on its own line, for example 'Municipal SSEG approval'.",
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => rule.max(100),
        }),
      ],
      validation: (rule) => rule.max(6),
    }),

    /* ─── Photos ─── */
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'photos',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: ALT_HELP,
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.custom((value) => heroWidthWarning(value)).warning(),
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      group: 'photos',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: ALT_HELP,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional. Shown under the photo in the viewer.',
              validation: (rule) => rule.max(120),
            }),
          ],
        }),
      ],
    }),

    /* ─── Search ─── */
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'string',
      group: 'search',
      description: 'The search result description. Leave empty to use the summary.',
      validation: (rule) => rule.max(155),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'vertical', media: 'heroImage' },
  },
});
