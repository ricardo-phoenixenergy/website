// sanity/schemaTypes/project.ts
// A project: the project page, the project cards and the Studio's form
// (docs/superpowers/specs/2026-09-29-project-page-design.md, "CMS fields").
// Every field added in step 2 is optional, with a fallback on the site, so a
// project that doesn't set one keeps working. The consent switches decide what
// may show: the queries (src/lib/queries.ts) leave out the client's name and
// the project value while theirs is off, and discloseProject()
// (src/lib/projectDisclosure.ts) drops rand amounts from the figures. Prose
// isn't filtered, so the Studio warns when it holds a rand amount or the
// client's name while a switch is off (projectRules.ts).
import { defineArrayMember, defineField, defineType } from 'sanity';
import { EQUIPMENT_COMPONENTS, FINANCING_METHODS } from '../../src/lib/projectOptions';
import {
  asOfWarning,
  commissionedWarning,
  consentDateError,
  heroWidthWarning,
  inputsWarning,
  measuredWarning,
  proseWarning,
  resultsCountWarning,
  systemRowsWarning,
} from './projectRules';

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
    { name: 'results', title: 'Results' },
    { name: 'story', title: 'Story' },
    { name: 'facts', title: 'Facts' },
    { name: 'photos', title: 'Photos' },
    { name: 'search', title: 'Search' },
  ],
  fields: [
    /* ─── Overview ─── */
    defineField({ name: 'title', title: 'Project title', type: 'string', group: 'overview', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'overview', options: { source: 'title' }, validation: (rule) => rule.required() }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'overview',
      description:
        "The page heading: what was built and where, for example 'Rooftop solar and a battery for a Cape Town logistics warehouse'. Leave empty to use the project title. Search results use it too.",
      validation: (rule) => [rule.max(90), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
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
    defineField({ name: 'location', title: 'Location', type: 'string', group: 'overview' }),
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
      title: 'Commissioning date',
      type: 'date',
      group: 'overview',
      description:
        'The day the system was commissioned. Shown as the month and year, and used to list projects newest first. For a planned or in-progress project, put the target in Completion date instead.',
      options: { dateFormat: 'D MMMM YYYY' },
      validation: (rule) => rule.custom((value, context) => commissionedWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion date',
      type: 'string',
      group: 'overview',
      description: "For a completed project, set the commissioning date instead. For a planned or in-progress project, the target, for example 'Q3 2027'.",
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
      description: "Shown only when 'Show client name' is on.",
    }),
    defineField({
      name: 'showClientName',
      title: 'Show client name',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
      description: 'On only when the client has agreed in writing to be named on this page and on project cards.',
    }),
    defineField({
      name: 'clientConsentOn',
      title: "Date of the client's written consent",
      type: 'date',
      group: 'overview',
      description: "The date of the client's written consent. Not shown on the site.",
      options: { dateFormat: 'D MMMM YYYY' },
      hidden: ({ document }) => document?.showClientName !== true,
      validation: (rule) => rule.custom((value, context) => consentDateError(value, context.document)),
    }),
    defineField({
      name: 'showRandAmounts',
      title: 'Show rand amounts',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
      description:
        'On only when the client has agreed to publish rand amounts: the project value and any figure in rands. Off hides them everywhere.',
    }),
    defineField({
      name: 'projectValue',
      title: 'Project value',
      type: 'string',
      group: 'overview',
      description: "The capital cost or contract value, with its basis, for example 'R[x]M excl. VAT'. Shown only when 'Show rand amounts' is on.",
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
              validation: (rule) => [rule.max(70), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
            }),
          ],
        }),
      ],
      validation: (rule) => rule.custom((value) => resultsCountWarning(value)).warning(),
    }),
    // What the results rest on. Empty means projected: the site never calls
    // modelled figures measured unless an editor says so here.
    defineField({
      name: 'resultsBasis',
      title: 'Results basis',
      type: 'string',
      group: 'results',
      description:
        'Projected: figures from the financial model (the default when empty). Measured: figures from metered or billed data. Sets the strip heading ("Projected results" or "Measured results") and the label on project cards.',
      options: {
        list: [
          { title: 'Projected (financial model)', value: 'projected' },
          { title: 'Measured (metered or billed data)', value: 'measured' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.custom((value, context) => measuredWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'resultsAsOf',
      title: 'Results as of',
      type: 'date',
      group: 'results',
      description: 'The date of the model, or the end of the measured period. Shown beside the results heading.',
      options: { dateFormat: 'D MMMM YYYY' },
      validation: (rule) => rule.custom((value, context) => asOfWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'resultsAssumptions',
      title: 'Results note',
      type: 'text',
      rows: 3,
      group: 'results',
      description:
        'One or two sentences on what the figures rest on: tariff escalation, degradation, baseline, data source. Replaces the default note under the results strip.',
      validation: (rule) => [
        rule.max(300).warning('Keep the note to one or two short sentences.'),
        rule.custom((value, context) => proseWarning(value, context.document)).warning(),
      ],
    }),
    defineField({
      name: 'resultsInputs',
      title: 'Calculation inputs',
      type: 'array',
      group: 'results',
      description:
        "The inputs behind the figures, one per row, for example tariff escalation, panel degradation, battery cycles, the tariff and where the load data came from. Shown under 'How we calculated this'.",
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (rule) => rule.required().max(40) }),
            defineField({ name: 'value', type: 'string', title: 'Value', validation: (rule) => rule.required().max(80) }),
          ],
        }),
      ],
      validation: (rule) => [rule.max(8), rule.custom((value, context) => inputsWarning(value, context.document)).warning()],
    }),

    /* ─── Story ─── */
    defineField({
      name: 'summary',
      title: 'Project summary',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'Two or three sentences introducing the project.',
      validation: (rule) => rule.custom((value, context) => proseWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'challengeHeadline',
      title: 'The challenge: headline',
      type: 'string',
      group: 'story',
      description: CHAPTER_HEADLINE_HELP,
      validation: (rule) => [rule.max(90), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
    }),
    defineField({
      name: 'challenge',
      title: 'The challenge',
      type: 'array',
      group: 'story',
      of: [storyBlock],
      validation: (rule) => rule.custom((value, context) => proseWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'solutionHeadline',
      title: 'Our solution: headline',
      type: 'string',
      group: 'story',
      description: CHAPTER_HEADLINE_HELP,
      validation: (rule) => [rule.max(90), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
    }),
    defineField({
      name: 'solution',
      title: 'Our solution',
      type: 'array',
      group: 'story',
      of: [storyBlock],
      validation: (rule) => rule.custom((value, context) => proseWarning(value, context.document)).warning(),
    }),
    defineField({
      name: 'outcomeHeadline',
      title: 'The outcome: headline',
      type: 'string',
      group: 'story',
      description: CHAPTER_HEADLINE_HELP,
      validation: (rule) => [rule.max(90), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
    }),
    defineField({
      name: 'outcome',
      title: 'The outcome',
      type: 'array',
      group: 'story',
      of: [storyBlock],
      validation: (rule) => rule.custom((value, context) => proseWarning(value, context.document)).warning(),
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
            defineField({ name: 'brand', type: 'string', title: 'Brand', validation: (rule) => rule.required() }),
            defineField({ name: 'model', type: 'string', title: 'Model' }),
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
      of: [defineArrayMember({ type: 'string', validation: (rule) => rule.max(100) })],
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
          validation: (rule) => [rule.required(), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
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
              validation: (rule) => [rule.required(), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional. Shown under the photo in the viewer.',
              validation: (rule) => [rule.max(120), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
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
      validation: (rule) => [rule.max(155), rule.custom((value, context) => proseWarning(value, context.document)).warning()],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'vertical', media: 'heroImage' },
  },
});
