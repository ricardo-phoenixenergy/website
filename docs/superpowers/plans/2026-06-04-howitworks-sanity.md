# Sanity-driven How It Works — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the How It Works section on the home page and all 6 solutions pages editable from Sanity, hiding the section when its document is empty, and delete the dead `SolutionSubNav`.

**Architecture:** A single `howItWorks` Sanity document type, surfaced as 7 fixed-ID singleton panels (Home + 6 verticals) — mirroring the existing `companyStats` pattern. A server-side `getHowItWorks(key)` helper returns the content or `null` (drives "hide if empty"). Pages spread the content into the existing prop-driven `HowItWorks` component. A one-off seed script migrates today's content so nothing disappears at deploy.

**Tech Stack:** Next.js 16 App Router (RSC), Sanity v5 (`next-sanity` client), TypeScript.

**Verification note:** This project has **no unit-test runner** (package.json scripts are only `dev`/`build`/`start`/`lint`). Per "follow existing patterns," tasks are verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and a manual Studio/browser check — not unit tests. Do **not** add a test framework.

**Sequencing for "hide if empty":** Tasks 1–7 are non-breaking (they add a backward-compatible `subtitle` prop, schema, query, helper, revalidate branch — nothing changes what renders). Task 8 seeds the 7 documents. Only Tasks 9–11 (page wiring) make the sections depend on Sanity. Run the seed (Task 8) **before deploying** Tasks 9–11 so no section vanishes in production.

---

## Page key → document ID → path

| Key | Document ID | Path |
|---|---|---|
| `home` | `howItWorks.home` | `/` |
| `ci-solar-storage` | `howItWorks.ci-solar-storage` | `/solutions/ci-solar-storage` |
| `wheeling` | `howItWorks.wheeling` | `/solutions/wheeling` |
| `energy-optimisation` | `howItWorks.energy-optimisation` | `/solutions/energy-optimisation` |
| `carbon-credits` | `howItWorks.carbon-credits` | `/solutions/carbon-credits` |
| `webuysolar` | `howItWorks.webuysolar` | `/solutions/webuysolar` |
| `ev-fleets` | `howItWorks.ev-fleets` | `/solutions/ev-fleets` |

---

## Task 1: Add HowItWorks content types

**Files:**
- Modify: `src/types/sanity.ts`

- [ ] **Step 1: Append the types** to the end of `src/types/sanity.ts`:

```ts
export interface HowItWorksStep {
  label: string;
  description: string;
  tag?: string;
}

export interface HowItWorksContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: HowItWorksStep[];
  showCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/sanity.ts
git commit -m "feat(types): add HowItWorksContent types"
```

---

## Task 2: Create the `howItWorks` schema and register it

**Files:**
- Create: `sanity/schemaTypes/howItWorks.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create `sanity/schemaTypes/howItWorks.ts`:**

```ts
import { defineType, defineField } from 'sanity';

/**
 * The "How It Works" section content for a single page. Managed as 7 fixed-ID
 * singletons (home + 6 solution verticals) via the structure tool in
 * sanity.config.ts. When a document has no title or no steps, the page hides
 * the section entirely (see src/lib/getHowItWorks.ts).
 */
export const howItWorks = defineType({
  name: 'howItWorks',
  title: 'How It Works',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above the title.',
      initialValue: 'How it works',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Wrap the accent word(s) in <em></em>, e.g. From assessment to <em>savings in weeks</em>.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Short sentence beneath the title.',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (r) => r.min(2).error('Add at least 2 steps.'),
      of: [
        defineField({
          name: 'step',
          title: 'Step',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, validation: (r) => r.required() }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', description: 'Optional pill, e.g. “Free”, “5–7 days”.' }),
          ],
          preview: { select: { title: 'label', subtitle: 'tag' } },
        }),
      ],
    }),
    defineField({
      name: 'showCta',
      title: 'Show CTA button',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
      hidden: ({ parent }) => !parent?.showCta,
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA link',
      type: 'string',
      description: 'e.g. /contact',
      hidden: ({ parent }) => !parent?.showCta,
    }),
  ],
  preview: {
    select: { title: 'title', steps: 'steps' },
    prepare: ({ title, steps }) => ({
      title: title || 'Untitled',
      subtitle: `${Array.isArray(steps) ? steps.length : 0} step(s)`,
    }),
  },
});
```

- [ ] **Step 2: Register it** in `sanity/schemaTypes/index.ts` — add the import and append to the array:

```ts
import { project } from './project';
import { blogPost } from './blogPost';
import { author } from './author';
import { teamMember } from './teamMember';
import { milestoneTimeline } from './milestoneTimeline';
import { partner } from './partner';
import { companyStats } from './companyStats';
import { howItWorks } from './howItWorks';

export const schemaTypes = [project, blogPost, author, teamMember, milestoneTimeline, partner, companyStats, howItWorks];
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/howItWorks.ts sanity/schemaTypes/index.ts
git commit -m "feat(sanity): add howItWorks document schema"
```

---

## Task 3: Add the 7 fixed-ID panels to the Studio structure

**Files:**
- Modify: `sanity.config.ts`

- [ ] **Step 1: Add a "How It Works" group.** In `sanity.config.ts`, inside the `.items([ ... ])` array (after the Company Stats `listItem`, before the array closes), insert:

```ts
            S.divider(),
            S.listItem()
              .title('How It Works')
              .child(
                S.list()
                  .title('How It Works')
                  .items([
                    S.listItem().title('Home').child(S.document().schemaType('howItWorks').documentId('howItWorks.home')),
                    S.listItem().title('C&I Solar & Storage').child(S.document().schemaType('howItWorks').documentId('howItWorks.ci-solar-storage')),
                    S.listItem().title('Wheeling').child(S.document().schemaType('howItWorks').documentId('howItWorks.wheeling')),
                    S.listItem().title('Energy Optimisation').child(S.document().schemaType('howItWorks').documentId('howItWorks.energy-optimisation')),
                    S.listItem().title('Carbon Credits').child(S.document().schemaType('howItWorks').documentId('howItWorks.carbon-credits')),
                    S.listItem().title('WeBuySolar').child(S.document().schemaType('howItWorks').documentId('howItWorks.webuysolar')),
                    S.listItem().title('EV Fleets').child(S.document().schemaType('howItWorks').documentId('howItWorks.ev-fleets')),
                  ]),
              ),
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add sanity.config.ts
git commit -m "feat(sanity): add How It Works panels to studio structure"
```

---

## Task 4: Add the GROQ query

**Files:**
- Modify: `src/lib/queries.ts`

- [ ] **Step 1: Append the query** to `src/lib/queries.ts` (note the `"showCTA": showCta` alias so it spreads into the component's `showCTA` prop):

```ts
export const HOW_IT_WORKS_QUERY = `
  *[_id == $id][0]{
    eyebrow,
    title,
    subtitle,
    steps[]{ label, description, tag },
    "showCTA": showCta,
    ctaLabel,
    ctaHref
  }
`;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries.ts
git commit -m "feat(queries): add HOW_IT_WORKS_QUERY"
```

---

## Task 5: Create the `getHowItWorks` fetch helper

**Files:**
- Create: `src/lib/getHowItWorks.ts`

- [ ] **Step 1: Create `src/lib/getHowItWorks.ts`:**

```ts
import { sanityClient } from '@/lib/sanity';
import { HOW_IT_WORKS_QUERY } from '@/lib/queries';
import type { HowItWorksContent } from '@/types/sanity';

/**
 * Fetches the How It Works content for a page (key = 'home' or a solution
 * vertical slug). Returns null when the document is missing, has no title, or
 * has no steps — the page then hides the section. Never throws.
 */
export async function getHowItWorks(pageKey: string): Promise<HowItWorksContent | null> {
  try {
    const data = await sanityClient.fetch<HowItWorksContent | null>(
      HOW_IT_WORKS_QUERY,
      { id: `howItWorks.${pageKey}` },
    );
    if (!data || !data.title || !Array.isArray(data.steps) || data.steps.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/getHowItWorks.ts
git commit -m "feat(lib): add getHowItWorks helper with hide-if-empty"
```

---

## Task 6: Add the `subtitle` prop to the HowItWorks component

**Files:**
- Modify: `src/components/sections/HowItWorks.tsx`

- [ ] **Step 1: Add `subtitle` to the props interface.** Change the `HowItWorksProps` interface (around line 15) to add `subtitle?: string`:

```ts
interface HowItWorksProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: Step[];
  autoAdvanceInterval?: number;
  showCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}
```

- [ ] **Step 2: Destructure `subtitle`.** In the function signature (around line 25), add `subtitle` after `title`:

```ts
export function HowItWorks({
  eyebrow = 'How it works',
  title,
  subtitle,
  steps,
  autoAdvanceInterval = 2600,
  showCTA = true,
  ctaLabel = 'Get a Free Assessment',
  ctaHref = '/contact',
}: HowItWorksProps) {
```

- [ ] **Step 3: Replace the hardcoded subtitle paragraph.** Find this block (around lines 90-95):

```tsx
        <p
          className="font-body text-base font-normal leading-[1.75] max-w-[440px] mx-auto"
          style={{ color: '#6B7280' }}
        >
          A simple, transparent process — from first conversation to ongoing savings.
        </p>
```

Replace it with (renders only when a subtitle is provided):

```tsx
        {subtitle && (
          <p
            className="font-body text-base font-normal leading-[1.75] max-w-[440px] mx-auto"
            style={{ color: '#6B7280' }}
          >
            {subtitle}
          </p>
        )}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HowItWorks.tsx
git commit -m "feat(how-it-works): make subtitle a prop"
```

---

## Task 7: Revalidate `howItWorks` changes

**Files:**
- Modify: `src/app/api/revalidate/route.ts`

- [ ] **Step 1: Extract `_id`.** In `src/app/api/revalidate/route.ts`, just after the line `const slug = extractSlug(raw.slug);`, add:

```ts
  const id = typeof raw._id === 'string' ? raw._id : undefined;
```

- [ ] **Step 2: Add the howItWorks branch.** After the existing `if (type === 'companyStats') { ... }` block (and before the final `return Response.json(...)`), add:

```ts
  if (type === 'howItWorks' && id) {
    const key = id.replace(/^drafts\./, '').replace(/^howItWorks\./, '');
    if (key === 'home') {
      revalidatePath('/');
    } else {
      revalidatePath(`/solutions/${key}`);
    }
  }
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/revalidate/route.ts
git commit -m "feat(revalidate): revalidate pages on howItWorks changes"
```

---

## Task 8: Seed the 7 documents with today's content

**Files:**
- Create: `scripts/seedHowItWorks.mjs`

> Requires `SANITY_API_TOKEN` in `.env.local` with **write/editor** permissions. If the existing token is read-only, create a write token at sanity.io/manage → API → Tokens.

- [ ] **Step 1: Create `scripts/seedHowItWorks.mjs`:**

```js
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

// Standalone scripts don't get Next.js env loading — parse .env.local ourselves.
try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* vars may already be in the environment */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SUBTITLE = 'A simple, transparent process — from first conversation to ongoing savings.';

// Add Sanity _key to each step (required for array items).
const steps = (arr) => arr.map((s, i) => ({ _key: `s${i + 1}`, ...s }));

const docs = [
  {
    _id: 'howItWorks.home',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Your path to energy <em>independence</em>',
    subtitle: SUBTITLE,
    showCta: false,
    steps: steps([
      { label: 'Free assessment', description: 'We visit your site and model three solution scenarios at no cost, no obligation.', tag: 'No cost · No obligation' },
      { label: 'Proposal & financing', description: 'Full ROI model, payback period, and financing options delivered in 5 business days.', tag: 'Delivered in 5 days' },
      { label: 'Installation & beyond', description: 'Certified install in 8–12 weeks, then 24/7 monitoring with a 25-year warranty.', tag: '8–12 week commissioning' },
    ]),
  },
  {
    _id: 'howItWorks.ci-solar-storage',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'From assessment to <em>savings in weeks</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Free Assessment',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Site Assessment', description: 'We audit your consumption data, roof or ground area, and grid connection details.', tag: 'Free' },
      { label: 'System Design', description: 'Our engineers produce a yield simulation and NERSA-compliant single-line diagram.', tag: '5–7 days' },
      { label: 'Installation', description: 'SAPVIA-certified teams install and commission with zero business disruption.', tag: '1–3 weeks' },
      { label: 'Monitoring', description: '24/7 remote monitoring with monthly generation reports and annual preventive maintenance.', tag: 'Ongoing' },
    ]),
  },
  {
    _id: 'howItWorks.wheeling',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Wheeling made <em>straightforward</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Wheeling Quote',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Consumption Audit', description: 'We analyse 12 months of interval meter data to quantify your wheeling opportunity.', tag: 'Free' },
      { label: 'Generator Matching', description: 'Phoenix matches your load profile to available generators on our licensed platforms.', tag: '5–10 days' },
      { label: 'Agreement Sign-off', description: 'NERSA-compliant wheeling agreement executed between generator, Eskom, and consumer.', tag: '2–4 weeks' },
      { label: 'Live Settlement', description: 'T-day energy accounting with monthly consolidated invoicing and REC delivery.', tag: 'Ongoing' },
    ]),
  },
  {
    _id: 'howItWorks.energy-optimisation',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'From audit to savings <em>in two weeks</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Book a Free Audit',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Energy Audit', description: 'A certified energy auditor walks your facility and identifies top waste sources.', tag: 'Free' },
      { label: 'Sub-Meter Install', description: 'Circuit-level sub-meters and IoT sensors installed within 2–5 days.', tag: '2–5 days' },
      { label: 'Tuning & Automation', description: 'BMS integration and load-shift automations deployed — savings start immediately.', tag: '1–2 weeks' },
      { label: 'Continuous Reporting', description: 'Monthly savings reports with attributed ROI. We review and retune quarterly.', tag: 'Ongoing' },
    ]),
  },
  {
    _id: 'howItWorks.carbon-credits',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Credits in your account <em>within 90 days</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Check Eligibility',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Eligibility Check', description: 'We verify your solar system meets Verra VCS project criteria — takes 48 hours.', tag: 'Free' },
      { label: 'Project Registration', description: 'Phoenix submits your project to the registry. Third-party validation is arranged.', tag: '30–60 days' },
      { label: 'First Issuance', description: 'Credits issued for retrospective generation since system commissioning date.', tag: 'Once registered' },
      { label: 'Quarterly Payouts', description: 'Credits issued and sold quarterly. Revenue is deposited directly to your account.', tag: 'Every quarter' },
    ]),
  },
  {
    _id: 'howItWorks.webuysolar',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'From enquiry to cash <em>in 14 days</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Valuation',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Submit Details', description: 'Share your system specs and location — a 5-minute online form or a quick call.', tag: 'Online' },
      { label: 'Site Inspection', description: 'Our technician visits within 48 hours, assesses condition, and prepares an offer.', tag: '48 hours' },
      { label: 'Offer & Sign', description: 'You receive a written offer. No obligation — accept if it works for you.', tag: 'Your choice' },
      { label: 'Cash & Removal', description: 'Payment is transferred within 14 days. Our team handles all decommissioning.', tag: '14 days' },
    ]),
  },
  {
    _id: 'howItWorks.ev-fleets',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Your fleet electrified <em>in four steps</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Fleet Assessment',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Fleet Assessment', description: 'We analyse your fleet routes, duty cycles, and depot layout to design the right charging solution.', tag: 'Free' },
      { label: 'Depot Design', description: 'Load flow study, charger placement plan, and grid connection sizing delivered in 7 days.', tag: '7 days' },
      { label: 'Installation', description: 'SANS-certified electricians install chargers and connect fleet management software.', tag: '2–4 weeks' },
      { label: 'Fleet Dashboard', description: 'Dashboard onboarding and driver training. Live savings reporting from day one.', tag: 'Ongoing' },
    ]),
  },
];

const run = async () => {
  for (const doc of docs) {
    await client.createOrReplace(doc);
    console.log('seeded', doc._id);
  }
  console.log('Done.');
};

run().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run the seed**

Run: `node scripts/seedHowItWorks.mjs`
Expected: prints `seeded howItWorks.home` … `seeded howItWorks.ev-fleets`, then `Done.`
If it errors with a 401/permission message, the `SANITY_API_TOKEN` lacks write access — create a write token and retry.

- [ ] **Step 3: Verify in the Studio (manual).** Run `npm run dev`, open `/studio` → "How It Works" → confirm all 7 panels show the seeded content. Stop the dev server.

- [ ] **Step 4: Commit the script**

```bash
git add scripts/seedHowItWorks.mjs
git commit -m "chore(sanity): add one-off seed script for howItWorks docs"
```

---

## Task 9: Wire the home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add the import.** Near the other `@/lib` imports at the top of `src/app/page.tsx`, add:

```ts
import { getHowItWorks } from '@/lib/getHowItWorks';
```

- [ ] **Step 2: Delete the `HOME_HIW_STEPS` constant** (the whole `const HOME_HIW_STEPS = [ ... ];` block, currently lines ~59-75).

- [ ] **Step 3: Fetch the content.** Inside `HomePage`, after `const companyStats = await getCompanyStats();`, add:

```ts
  const homeHowItWorks = await getHowItWorks('home');
```

- [ ] **Step 4: Replace the HowItWorks render.** Find the current block:

```tsx
        <HowItWorks
          title="Your path to energy <em>independence</em>"
          steps={HOME_HIW_STEPS}
          autoAdvanceInterval={2600}
          showCTA={false}
        />
```

Replace with:

```tsx
        {homeHowItWorks && <HowItWorks {...homeHowItWorks} autoAdvanceInterval={2600} />}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): drive How It Works from Sanity"
```

---

## Task 10: Wire the 6 solution pages

**Files (apply the identical edit to each):**
- Modify: `src/app/solutions/ci-solar-storage/page.tsx`
- Modify: `src/app/solutions/wheeling/page.tsx`
- Modify: `src/app/solutions/energy-optimisation/page.tsx`
- Modify: `src/app/solutions/carbon-credits/page.tsx`
- Modify: `src/app/solutions/webuysolar/page.tsx`
- Modify: `src/app/solutions/ev-fleets/page.tsx`

Each file already declares `const vertical = '<key>' as const;`, so the edit below is the same for all six.

- [ ] **Step 1: Add the import** alongside the other component imports:

```ts
import { getHowItWorks } from '@/lib/getHowItWorks';
```

- [ ] **Step 2: Add ISR.** After the `export const metadata = { ... };` block, add:

```ts
export const revalidate = 3600;
```

- [ ] **Step 3: Delete the inline `const steps = [ ... ];` block** (the array defined above the page component).

- [ ] **Step 4: Make the component async and fetch.** Change the component signature from e.g. `export default function CiSolarStoragePage() {` to `export default async function CiSolarStoragePage() {`, and as the first line of the body add:

```ts
  const howItWorks = await getHowItWorks(vertical);
```

- [ ] **Step 5: Replace the How It Works block.** Find:

```tsx
      <div id="how-it-works">
        <HowItWorks
          title="..."
          steps={steps}
          showCTA
          ctaLabel="..."
          ctaHref="/contact"
        />
      </div>
```

Replace with:

```tsx
      {howItWorks && <HowItWorks {...howItWorks} />}
```

- [ ] **Step 6: Remove the remaining orphaned anchors.** On the `<SolutionTabs … />` line, delete only the `id="tabs"` attribute — leave `tabs`, `accent`, and `vertical` exactly as they are. For example:

```tsx
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} vertical="ci-solar-storage" />
```
becomes:
```tsx
      <SolutionTabs tabs={tabs} accent={meta.accent} vertical="ci-solar-storage" />
```

And change:
```tsx
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
```
to:
```tsx
      <FeaturedProjects vertical={vertical} />
```

- [ ] **Step 7: After editing all six**, type-check

Run: `npx tsc --noEmit`
Expected: no errors. (`HowItWorks` and `SolutionTabs` may now be reported unused only if a file no longer references them — both are still used, so expect clean.)

- [ ] **Step 8: Commit**

```bash
git add src/app/solutions
git commit -m "feat(solutions): drive How It Works from Sanity and drop orphaned anchors"
```

---

## Task 11: Delete the dead SolutionSubNav component

**Files:**
- Delete: `src/components/sections/SolutionSubNav.tsx`

- [ ] **Step 1: Delete the file**

```bash
git rm src/components/sections/SolutionSubNav.tsx
```

- [ ] **Step 2: Verify nothing imports it**

Run: `npx tsc --noEmit`
Expected: no errors (the component was never imported).

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove unused SolutionSubNav component"
```

---

## Task 12: Final integration check

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; `/`, `/about`, and all 6 `/solutions/*` routes compile.

- [ ] **Step 3: Manual smoke test.** Run `npm run dev`, visit `/` and one solution page (e.g. `/solutions/ci-solar-storage`) — confirm the How It Works section renders with the seeded content (eyebrow, title accent, subtitle, steps, and CTA on solution pages / no CTA on home). Stop the dev server.

- [ ] **Step 4: Push**

```bash
git push origin main
```

---

## Done when
- All 7 How It Works instances render from Sanity.
- Editing a panel in the Studio updates the corresponding page (instantly via webhook if configured, otherwise within the hourly ISR window).
- Emptying a panel hides that section.
- `SolutionSubNav` and the `#tabs`/`#how-it-works`/`#projects` anchors are gone.
- `npm run build` passes.
