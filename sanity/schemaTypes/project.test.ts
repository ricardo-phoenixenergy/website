// The project schema as the Studio gets it: its groups, the help text from the
// spec's "CMS fields (step 2)" table, the validation limits and the warnings.
import { describe, expect, it, vi } from 'vitest';

// defineType, defineField and defineArrayMember hand back the definition they
// are given. The real package loads the whole Studio, which this test doesn't need.
vi.mock('sanity', () => ({
  defineType: <T,>(definition: T) => definition,
  defineField: <T,>(definition: T) => definition,
  defineArrayMember: <T,>(definition: T) => definition,
}));

import { project } from './project';
import { CLIENT_NAME_WARNING, CONSENT_DATE_ERROR, HERO_WIDTH_WARNING, RAND_WARNING } from './projectRules';

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

describe('the project schema', () => {
  it('puts its fields in six groups, Overview first', () => {
    expect(project.groups?.map((g) => [g.name, g.title])).toEqual([
      ['overview', 'Overview'],
      ['results', 'Results'],
      ['story', 'Story'],
      ['facts', 'Facts'],
      ['photos', 'Photos'],
      ['search', 'Search'],
    ]);
    expect(project.groups?.[0].default).toBe(true);
    expect(fields.filter((f) => !f.hidden && !f.group).map((f) => f.name)).toEqual([]);
  });

  it.each([
    ['headline', 'overview', "The page heading: what was built and where, for example 'Rooftop solar and a battery for a Cape Town logistics warehouse'. Leave empty to use the project title. Search results use it too."],
    ['siteType', 'overview', "What the site is, in two or three words, for example 'Logistics warehouse' or 'Office park'."],
    ['showClientName', 'overview', 'On only when the client has agreed in writing to be named on this page and on project cards.'],
    ['clientConsentOn', 'overview', "The date of the client's written consent. Not shown on the site."],
    ['showRandAmounts', 'overview', 'On only when the client has agreed to publish rand amounts: the project value and any figure in rands. Off hides them everywhere.'],
    ['commissionedOn', 'overview', 'The day the system was commissioned. Shown as the month and year, and used to list projects newest first. For a planned or in-progress project, put the target in Completion date instead.'],
    ['financing', 'overview', "How the client paid for the system. Once this is set, delete any 'Deal structure' row from System."],
    ['resultsInputs', 'results', "The inputs behind the figures, one per row, for example tariff escalation, panel degradation, battery cycles, the tariff and where the load data came from. Shown under 'How we calculated this'."],
    ['challengeHeadline', 'story', "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'."],
    ['solutionHeadline', 'story', "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'."],
    ['outcomeHeadline', 'story', "One line saying what happened in this part, for example 'Peak tariffs landed on the tenant's busiest hours'."],
    ['equipment', 'facts', 'Each main component as installed: its brand, model and how many.'],
    ['installationWeeks', 'facts', 'Weeks from starting on site to commissioning.'],
    ['approvals', 'facts', "Each approval or certificate on its own line, for example 'Municipal SSEG approval'."],
    ['seoDescription', 'search', 'The search result description. Leave empty to use the summary.'],
  ])('%s sits in %s with the spec\'s help text', (name, group, description) => {
    expect(field(name).group).toBe(group);
    expect(field(name).description).toBe(description);
  });

  it("gives each figure a note and each gallery photo a caption, with the spec's help text and limits", () => {
    const note = subfield(member(field('results')), 'note');
    expect(note.description).toBe("The period and the baseline, for example 'Year 1, against 2025 municipal bills'.");
    expect(rules(note).calls).toContain('max(70)');
    const caption = subfield(member(field('gallery')), 'caption');
    expect(caption.description).toBe('Optional. Shown under the photo in the viewer.');
    expect(rules(caption).calls).toContain('max(120)');
  });

  it('sets the limits the spec gives each new field', () => {
    expect(rules(field('headline')).calls).toContain('max(90)');
    expect(rules(field('siteType')).calls).toEqual(['max(40)']);
    expect(rules(field('challengeHeadline')).calls).toContain('max(90)');
    expect(rules(field('seoDescription')).calls).toContain('max(155)');
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
    expect(rules(field('resultsInputs')).calls).toContain('max(8)');
    const input = member(field('resultsInputs'));
    expect(rules(subfield(input, 'label')).calls).toEqual(['required', 'max(40)']);
    expect(rules(subfield(input, 'value')).calls).toEqual(['required', 'max(80)']);
    const equipment = member(field('equipment'));
    expect(rules(field('equipment')).calls).toEqual(['max(12)']);
    expect(rules(subfield(equipment, 'component')).calls).toEqual(['required']);
    expect(rules(subfield(equipment, 'brand')).calls).toEqual(['required']);
    expect(rules(subfield(equipment, 'quantity')).calls).toEqual(['integer', 'min(1)']);
    expect(subfield(equipment, 'component').options?.list?.map((o) => o.title)).toContain('Variable speed drive');
  });

  it('keeps both switches off by default, and asks for the consent date only with the name switch on', () => {
    expect(field('showClientName').initialValue).toBe(false);
    expect(field('showRandAmounts').initialValue).toBe(false);
    const consent = field('clientConsentOn');
    const hidden = consent.hidden as (context: { document?: Record<string, unknown> }) => boolean;
    expect(hidden({ document: { showClientName: false } })).toBe(true);
    expect(hidden({ document: { showClientName: true } })).toBe(false);
    const [required] = rules(consent).customs;
    expect(required(undefined, { document: { showClientName: true } })).toBe(CONSENT_DATE_ERROR);
    expect(rules(consent).calls).not.toContain('warning');
  });

  it('retitles the figures and rewrites the help text of the existing fields', () => {
    expect(field('results').title).toBe('Results (up to 4)');
    expect(field('metrics').title).toBe('System (2 to 4 rows)');
    expect(field('metrics').description).toBe("The system, for example 'Solar PV' with '[size] kWp'.");
    expect(field('completionDate').description).toBe(
      "For a completed project, set the commissioning date instead. For a planned or in-progress project, the target, for example 'Q3 2027'.",
    );
    expect(field('projectValue').description).toBe(
      "The capital cost or contract value, with its basis, for example 'R[x]M excl. VAT'. Shown only when 'Show rand amounts' is on.",
    );
    expect(field('clientName').description).toBe("Shown only when 'Show client name' is on.");
    for (const name of ['featured', 'featuredOrder']) {
      expect(String(field(name).description)).not.toMatch(/case stud/i);
    }
  });

  it('requires alt text on every photo, with the help text', () => {
    for (const alt of [subfield(field('heroImage'), 'alt'), subfield(member(field('gallery')), 'alt')]) {
      expect(alt.description).toBe("What the photo shows, for people who can't see it.");
      expect(rules(alt).calls[0]).toBe('required');
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

  it('warns about rand amounts and the client name in every piece of prose the page shows', () => {
    const document = { clientName: 'Hidden Client Ltd', showRandAmounts: false, showClientName: false };
    const prose = [
      field('headline'),
      field('summary'),
      field('challenge'),
      field('challengeHeadline'),
      field('resultsAssumptions'),
      field('seoDescription'),
      subfield(member(field('results')), 'note'),
      subfield(field('heroImage'), 'alt'),
      subfield(member(field('gallery')), 'alt'),
      subfield(member(field('gallery')), 'caption'),
    ];
    for (const definition of prose) {
      const { customs } = rules(definition);
      const results = customs.map((check) => [check('Saved R450 000 a year', { document }), check('Built for Hidden Client Ltd', { document })]);
      expect(results, definition.name).toContainEqual([RAND_WARNING, CLIENT_NAME_WARNING]);
    }
  });

  it('warns about a hero photo under 2400px wide', () => {
    const [width] = rules(field('heroImage')).customs;
    expect(width({ asset: { _ref: 'image-abc123-1200x900-png' } }, {})).toBe(HERO_WIDTH_WARNING);
  });
});
