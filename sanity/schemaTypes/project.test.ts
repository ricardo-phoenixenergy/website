// The project schema as the Studio gets it: its groups, the help text, the
// validation limits and the warnings.
import { describe, expect, it, vi } from 'vitest';

// defineType, defineField and defineArrayMember hand back the definition they
// are given. The real package loads the whole Studio, which this test doesn't need.
vi.mock('sanity', () => ({
  defineType: <T,>(definition: T) => definition,
  defineField: <T,>(definition: T) => definition,
  defineArrayMember: <T,>(definition: T) => definition,
}));

import { project } from './project';
import { COMMISSIONED_FUTURE_WARNING, HERO_WIDTH_WARNING } from './projectRules';

interface Definition {
  name?: string;
  title?: string;
  type: string;
  group?: string;
  description?: unknown;
  hidden?: unknown;
  initialValue?: unknown;
  of?: Definition[];
  fields?: Definition[];
  validation?: unknown;
  styles?: Array<{ value: string }>;
  lists?: Array<{ value: string }>;
  marks?: { decorators?: Array<{ value: string }>; annotations?: Definition[] };
  options?: { list?: Array<{ title: string; value: string }> };
}
type Validator = (value: unknown, context: { document?: Record<string, unknown> }) => unknown;

const fields = project.fields as unknown as Definition[];
const field = (name: string): Definition => {
  const found = fields.find((f) => f.name === name);
  if (!found) throw new Error(`No field "${name}"`);
  return found;
};
const member = (definition: Definition, index = 0): Definition => definition.of?.[index] ?? { type: 'missing' };
const subfield = (definition: Definition, name: string): Definition => definition.fields?.find((f) => f.name === name) ?? { type: 'missing' };

/** Runs a field's validation against a stand-in rule, recording each call and keeping the custom validators. */
function rules(definition: Definition): { calls: string[]; customs: Validator[] } {
  const calls: string[] = [];
  const customs: Validator[] = [];
  const rule: Record<string, unknown> = new Proxy(
    {},
    {
      get: (_target, method: string) => (...args: unknown[]) => {
        if (method === 'custom') customs.push(args[0] as Validator);
        calls.push(args.length > 0 && typeof args[0] !== 'function' ? `${method}(${args.map(String).join(',')})` : method);
        return rule;
      },
    },
  );
  if (typeof definition.validation === 'function') definition.validation(rule);
  return { calls, customs };
}

/** The fields the simpler schema of October 2026 removed. Documents may still hold them until they are cleared. */
const REMOVED = [
  'showClientName',
  'clientConsentOn',
  'showRandAmounts',
  'projectValue',
  'completionDate',
  'resultsBasis',
  'resultsAsOf',
  'resultsAssumptions',
  'resultsInputs',
];

describe('the project schema', () => {
  it('puts its fields in six groups, Overview first, the figures under Impact', () => {
    expect(project.groups?.map((g) => [g.name, g.title])).toEqual([
      ['overview', 'Overview'],
      ['results', 'Impact'],
      ['story', 'Story'],
      ['facts', 'Facts'],
      ['photos', 'Photos'],
      ['search', 'Search'],
    ]);
    expect(project.groups?.[0].default).toBe(true);
    expect(fields.filter((f) => !f.hidden && !f.group).map((f) => f.name)).toEqual([]);
  });

  it('keeps no consent or rand switch, no project value, no free-text date and no results basis', () => {
    const names = fields.map((f) => f.name);
    for (const name of REMOVED) {
      expect(names, name).not.toContain(name);
    }
  });

  it('holds only the figures in the Impact group', () => {
    expect(fields.filter((f) => f.group === 'results').map((f) => f.name)).toEqual(['results']);
  });

  it.each([
    ['headline', 'overview', "The page heading: what was built and where, for example 'Rooftop solar and a battery for a Cape Town logistics warehouse'. Leave empty to use the project title. Search results use it too."],
    ['siteType', 'overview', "What the site is, in two or three words, for example 'Logistics warehouse' or 'Office park'."],
    ['financing', 'overview', "How the client paid for the system. Once this is set, delete any 'Deal structure' row from System."],
    ['challengeHeadline', 'story', "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'."],
    ['solutionHeadline', 'story', "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'."],
    ['outcomeHeadline', 'story', "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'."],
    ['equipment', 'facts', 'Each main component as installed: its brand, model and how many.'],
    ['installationWeeks', 'facts', 'Weeks from starting on site to commissioning.'],
    ['approvals', 'facts', "Each approval or certificate on its own line, for example 'Municipal SSEG approval'."],
    ['seoDescription', 'search', 'The search result description. Leave empty to use the summary.'],
  ])('%s sits in %s with its help text', (name, group, description) => {
    expect(field(name).group).toBe(group);
    expect(field(name).description).toBe(description);
  });

  it('asks for the client name only once the client has agreed in writing to be named', () => {
    expect(field('clientName').group).toBe('overview');
    expect(field('clientName').description).toBe(
      'Shown on this page and on project cards. Fill it in only once the client has agreed in writing to be named.',
    );
    expect(field('clientName').validation).toBeUndefined();
  });

  it('keeps one date, stored as commissionedOn and titled "Completion date", warning only about a future date on a completed project', () => {
    const date = field('commissionedOn');
    expect(date.title).toBe('Completion date');
    expect(date.type).toBe('date');
    expect(date.group).toBe('overview');
    expect(date.description).toBe(
      "The day the project was completed or, for a planned or in-progress project, the day it's due. Shown as the month and year, for example 'Completed June 2026' or 'Planned for September 2027', and used to order the project lists, latest first.",
    );
    const { calls, customs } = rules(date);
    expect(calls).toEqual(['custom', 'warning']);
    const [check] = customs;
    expect(check('2999-01-01', { document: { status: 'completed' } })).toBe(COMMISSIONED_FUTURE_WARNING);
    expect(check('2999-01-01', { document: { status: 'planned' } })).toBe(true);
    expect(check(undefined, { document: { status: 'completed' } })).toBe(true);
  });

  it('gives each figure a note and each gallery photo a caption, with their help text and limits', () => {
    const note = subfield(member(field('results')), 'note');
    expect(note.description).toBe("The period and the baseline, for example 'Year 1, against 2025 municipal bills'.");
    expect(rules(note).calls).toEqual(['max(70)']);
    const caption = subfield(member(field('gallery')), 'caption');
    expect(caption.description).toBe('Optional. Shown under the photo in the viewer.');
    expect(rules(caption).calls).toEqual(['max(120)']);
  });

  it('sets the limits on each field', () => {
    expect(rules(field('title')).calls).toEqual(['required']);
    expect(rules(field('slug')).calls).toEqual(['required']);
    expect(rules(field('headline')).calls).toEqual(['max(90)']);
    expect(rules(field('siteType')).calls).toEqual(['max(40)']);
    expect(rules(field('challengeHeadline')).calls).toEqual(['max(90)']);
    expect(rules(field('seoDescription')).calls).toEqual(['max(155)']);
    expect(rules(field('financing')).calls).toEqual(['max(3)', 'unique']);
    expect(field('financing').options?.list?.map((o) => o.title)).toEqual([
      'Outright Purchase',
      'Power Purchase Agreement (PPA)',
      'Power Lease Agreement (PLA)',
      'Energy efficiency asset lease',
      'Other',
    ]);
    expect(rules(field('installationWeeks')).calls).toEqual(['integer', 'min(1)', 'max(104)']);
    expect(rules(field('approvals')).calls).toEqual(['max(6)']);
    expect(rules(member(field('approvals'))).calls).toEqual(['max(100)']);
    const equipment = member(field('equipment'));
    expect(rules(field('equipment')).calls).toEqual(['max(12)']);
    expect(rules(subfield(equipment, 'component')).calls).toEqual(['required']);
    expect(rules(subfield(equipment, 'brand')).calls).toEqual(['required']);
    expect(rules(subfield(equipment, 'quantity')).calls).toEqual(['integer', 'min(1)']);
    expect(subfield(equipment, 'component').options?.list?.map((o) => o.title)).toContain('Variable speed drive');
  });

  it('checks text for its length only: no field warns about a rand amount or a client name any more', () => {
    const equipment = member(field('equipment'));
    const texts: Array<[string, Definition]> = [
      ['title', field('title')],
      ['slug', field('slug')],
      ['headline', field('headline')],
      ['siteType', field('siteType')],
      ['location', field('location')],
      ['summary', field('summary')],
      ['challenge', field('challenge')],
      ['challengeHeadline', field('challengeHeadline')],
      ['seoDescription', field('seoDescription')],
      ['results[]', member(field('results'))],
      ['results[].note', subfield(member(field('results')), 'note')],
      ['metrics[]', member(field('metrics'))],
      ['approvals[]', member(field('approvals'))],
      ['equipment[].brand', subfield(equipment, 'brand')],
      ['equipment[].model', subfield(equipment, 'model')],
      ['heroImage.alt', subfield(field('heroImage'), 'alt')],
      ['gallery[].alt', subfield(member(field('gallery')), 'alt')],
      ['gallery[].caption', subfield(member(field('gallery')), 'caption')],
    ];
    for (const [name, definition] of texts) {
      expect(rules(definition).customs, name).toEqual([]);
    }
  });

  it('keeps the figure and System titles, and the help text of the existing fields', () => {
    expect(field('results').title).toBe('Results (up to 4)');
    expect(field('metrics').title).toBe('System (2 to 4 rows)');
    expect(field('metrics').description).toBe("The system, for example 'Solar PV' with '[size] kWp'.");
    for (const name of ['featured', 'featuredOrder']) {
      expect(String(field(name).description)).not.toMatch(/case stud/i);
    }
  });

  it('requires alt text on every photo, with the help text', () => {
    for (const alt of [subfield(field('heroImage'), 'alt'), subfield(member(field('gallery')), 'alt')]) {
      expect(alt.description).toBe("What the photo shows, for people who can't see it.");
      expect(rules(alt).calls).toEqual(['required']);
    }
  });

  it('hides the system size and offers no images inside the story', () => {
    expect(field('systemSize').hidden).toBe(true);
    for (const name of ['challenge', 'solution', 'outcome']) {
      expect(field(name).of?.map((m) => m.type)).toEqual(['block']);
    }
    const block = member(field('solution'));
    expect(block.styles?.map((s) => s.value)).toEqual(['normal', 'h3']);
    expect(block.lists?.map((l) => l.value)).toEqual(['bullet', 'number']);
    expect(block.marks?.decorators?.map((d) => d.value)).toEqual(['strong', 'em']);
    expect(block.marks?.annotations?.map((a) => a.name)).toEqual(['link']);
  });

  it('warns about more than four figures, System rows outside two to four, and a hero photo under 2400px wide', () => {
    expect(rules(field('results')).calls).toEqual(['custom', 'warning']);
    expect(rules(field('metrics')).calls).toEqual(['custom', 'warning']);
    const [width] = rules(field('heroImage')).customs;
    expect(width({ asset: { _ref: 'image-abc123-1200x900-png' } }, {})).toBe(HERO_WIDTH_WARNING);
  });
});
