# About Page Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove three duplicate "join the team" touchpoints, drop the weak stats strip, replace the story section placeholder with an animated impact stats panel, and add Ubuntu as the 6th company value.

**Architecture:** Four independent edits — one CSS keyframe addition, one component rewrite, one component edit, and three deletions/removals. No new dependencies. All changes are confined to the About page and its direct components.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Tailwind CSS v4, Framer Motion (`motion`, `useInView`)

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/app/globals.css` | Modify | Add `@keyframes tile-shimmer` + `.shimmer-tile` utility |
| `src/components/sections/AboutStory.tsx` | Rewrite | Replace gradient placeholder with animated 2×2 stat panel |
| `src/app/about/page.tsx` | Modify | Remove StatsStrip, remove CareersBand, update CTA copy |
| `src/components/sections/AboutValues.tsx` | Modify | Add Ubuntu (#6) to VALUES array, remove join card JSX |
| `src/components/sections/CareersBand.tsx` | Delete | Component removed entirely |
| `specs/08-ABOUT.md` | Modify | Update to reflect final state |

---

## Task 1: Add shimmer keyframe to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add keyframe and utility class**

Open `src/app/globals.css`. Find the existing `@layer utilities` block (around line 81). Add the shimmer keyframe **before** that block and a new rule **inside** the existing `@layer utilities` block:

```css
/* ─── Stat tile shimmer animation ─────────────────────────────────────────── */
@keyframes tile-shimmer {
  0%        { transform: translateX(-101%); }
  40%, 100% { transform: translateX(101%);  }
}
```

Then inside the existing `@layer utilities { ... }` block, add at the end (before the closing `}`):

```css
  /* Stat tile shimmer — ::after pseudo sweeps a 1px gradient line across the top */
  .shimmer-tile::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(112,157,169,0.5), transparent);
    animation: tile-shimmer 2.5s ease-in-out infinite;
    animation-delay: var(--shimmer-delay, 0s);
  }
```

- [ ] **Step 2: Verify build is clean**

```bash
npm run build
```

Expected: build completes with no errors. No output needed beyond "Build complete" / exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(about): add tile-shimmer keyframe for story stat panel"
```

---

## Task 2: Rewrite AboutStory.tsx — animated stat panel

**Files:**
- Modify: `src/components/sections/AboutStory.tsx`

- [ ] **Step 1: Replace the entire file contents**

The current file is a server component with a gradient placeholder. Replace it entirely with the following client component. The right-hand copy is identical to the original — only the left column changes.

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STORY_STATS = [
  { value: 'R380M', label: 'Client savings', featured: true  },
  { value: '48MW',  label: 'Deployed',        featured: false },
  { value: '120+',  label: 'Projects',         featured: false },
  { value: '12kt',  label: 'CO₂ saved / yr',   featured: false },
] as const;

const SHIMMER_DELAYS  = ['0.2s', '0.8s', '1.4s', '2.0s'] as const;
const STAGGER_DELAYS  = [0, 0.15, 0.3, 0.45] as const;

export function AboutStory() {
  const panelRef = useRef<HTMLDivElement>(null);
  const inView   = useInView(panelRef, { once: true, margin: '-60px' });

  return (
    <section className="bg-white py-[52px]">
      <div className="page-container grid gap-11 md:grid-cols-2 md:items-start">

        {/* ── Left — animated stat panel ────────────────────────────────────── */}
        <div
          ref={panelRef}
          className="relative rounded-2xl overflow-hidden"
          style={{ height: 230, background: '#0d1f22' }}
        >
          {/* 2×2 tile grid */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 3,
              padding: 3,
            }}
          >
            {STORY_STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                className="shimmer-tile"
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: STAGGER_DELAYS[i] }}
                style={{
                  borderRadius: 8,
                  background: stat.featured
                    ? 'linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)'
                    : 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 8px',
                  position: 'relative',
                  overflow: 'hidden',
                  '--shimmer-delay': SHIMMER_DELAYS[i],
                } as React.CSSProperties}
              >
                {/* Radial glow on featured tile only */}
                {stat.featured && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: -20, left: -20,
                      width: 80, height: 80,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)',
                    }}
                  />
                )}
                <span
                  className="font-display font-extrabold text-white leading-none relative z-10"
                  style={{ fontSize: stat.featured ? 26 : 24 }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-body relative z-10"
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.38)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Badge — bottom-left anchor */}
          <div
            className="absolute z-10"
            style={{
              bottom: 8, left: 8,
              background: '#39575C',
              border: '2px solid white',
              borderRadius: 7,
              padding: '5px 9px',
            }}
          >
            <p
              className="font-display font-extrabold text-white"
              style={{ fontSize: 10, lineHeight: 1.2 }}
            >
              Since 2019
            </p>
            <p
              className="font-body font-normal uppercase"
              style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}
            >
              Our impact
            </p>
          </div>
        </div>

        {/* ── Right — copy (unchanged) ─────────────────────────────────────── */}
        <div>
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
            Our story
          </p>
          <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-4">
            Built to make clean energy{' '}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>accessible</em>{' '}
            across Africa
          </h2>
          <p className="font-body text-sm leading-[1.8] text-[#6B7280] mb-3">
            Phoenix Energy was created to make renewable energy both accessible and
            transformative across Africa. We set ourselves apart by providing bespoke,
            turnkey solutions that go beyond conventional energy savings.
          </p>

          <blockquote
            className="my-3.5 rounded-r-lg px-4 py-3"
            style={{ borderLeft: '3px solid #709DA9', background: 'rgba(112,157,169,0.07)' }}
          >
            <p className="font-display font-bold text-base text-[#1A1A1A] leading-[1.5] italic">
              "For us, it's not just about saving — it's about empowering businesses to
              earn, grow, and thrive sustainably."
            </p>
            <p className="font-body text-xs text-[#6B7280] mt-1.5">
              — Phoenix Energy founding vision
            </p>
          </blockquote>

          <p className="font-body text-sm leading-[1.8] text-[#6B7280]">
            Our approach gives businesses a comprehensive roadmap designed to drive Net
            Zero Carbon Emissions, enhance efficiency, and unlock new revenue streams
            across Southern Africa and beyond.
          </p>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors, build succeeds.

- [ ] **Step 3: Verify visually in dev server**

```bash
npm run dev
```

Open `http://localhost:3000/about`. Scroll to the "Our Story" section. Confirm:
- The left column shows the 2×2 dark stat grid (not the gradient placeholder)
- R380M tile (top-left) has a subtle lighter gradient and glow
- Tiles animate in with a stagger when they enter the viewport
- A shimmer line sweeps across the top of each tile on a loop
- "Since 2019 / Our impact" badge sits bottom-left
- The right-hand copy is unchanged

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/AboutStory.tsx
git commit -m "feat(about): replace story placeholder with animated impact stat panel"
```

---

## Task 3: Remove stats strip from about/page.tsx

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Delete ABOUT_STATS constant and StatsStrip usage**

In `src/app/about/page.tsx`:

Remove lines 5 and 31–35 (the import and the constant):
```tsx
// DELETE this import line:
import { StatsStrip } from '@/components/ui/StatsStrip';

// DELETE this constant:
const ABOUT_STATS = [
  { value: '3', label: 'Co-founders' },
  { value: '6+', label: 'Solutions' },
  { value: 'Southern', label: 'Africa scope' },
  { value: 'Net 0', label: 'Our goal' },
];
```

Remove the JSX call (currently between the Hero and `<AboutStory />`):
```tsx
// DELETE this line:
<StatsStrip stats={ABOUT_STATS} />
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors. The `StatsStrip` component file is NOT deleted — it's used on `/projects/[slug]`.

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/about`. Confirm the teal strip between the hero and story section is gone — the hero flows directly into the "Our Story" section.

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat(about): remove weak stats strip — impact numbers now live in story panel"
```

---

## Task 4: Replace "Join the team" card with Ubuntu value

**Files:**
- Modify: `src/components/sections/AboutValues.tsx`

- [ ] **Step 1: Update the VALUES array and remove join card JSX**

Replace the entire file with:

```tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const VALUES = [
  {
    num: '01',
    title: 'Empathy',
    text: "We put people first, understanding our clients' unique needs to create meaningful, impactful solutions.",
  },
  {
    num: '02',
    title: 'Pioneering',
    text: 'We break new ground with advanced renewable solutions, setting new standards for sustainable growth in business.',
  },
  {
    num: '03',
    title: 'Trust',
    text: 'We build lasting partnerships rooted in integrity, transparency, and unwavering reliability.',
  },
  {
    num: '04',
    title: 'Conscience',
    text: 'Everything we do is driven by our commitment to creating positive change for the planet and future generations.',
  },
  {
    num: '05',
    title: 'Inspiration',
    text: 'We inspire businesses by creating new opportunities to deliver efficient, sustainable services — empowering them to inspire their own customers.',
  },
  {
    num: '06',
    title: 'Ubuntu',
    text: 'We are rooted in the African belief that we grow stronger together — alongside our clients, our communities, and our continent.',
  },
];

export function AboutValues() {
  return (
    <section className="bg-[#F5F5F5] py-[52px]">
      <AnimatedSection className="page-container text-center mb-8">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          What we stand for
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2]">
          Our <em style={{ color: '#709DA9', fontStyle: 'normal' }}>values</em>
        </h2>
      </AnimatedSection>

      <div className="page-container grid gap-3 grid-cols-1 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <AnimatedSection key={v.num} delay={i * 0.04} as="div">
            <div
              className="rounded-2xl p-[22px] h-full cursor-default transition-all duration-200 hover:-translate-y-[3px]"
              style={{ background: '#0d1f22' }}
            >
              <p
                className="font-display font-extrabold text-4xl leading-none mb-3"
                style={{ color: 'rgba(255,255,255,0.08)' }}
              >
                {v.num}
              </p>
              <p className="font-display font-bold text-base text-white mb-2">{v.title}</p>
              <p
                className="font-body text-sm leading-[1.75]"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {v.text}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/about`. Scroll to the Values section. Confirm:
- Six dark cards in a 3×2 grid
- Card 06 reads "Ubuntu" with the full copy — styled identically to cards 01–05 (dark background, no dashed border)
- No "Join the team" card present anywhere in this section

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/AboutValues.tsx
git commit -m "feat(about): replace join-team slot with Ubuntu as 6th value"
```

---

## Task 5: Remove CareersBand + update CTA copy

**Files:**
- Modify: `src/app/about/page.tsx`
- Delete: `src/components/sections/CareersBand.tsx`

- [ ] **Step 1: Remove CareersBand from about/page.tsx**

In `src/app/about/page.tsx`, delete:
```tsx
// DELETE this import:
import { CareersBand } from '@/components/sections/CareersBand';
```

And delete this JSX line (between `<AboutTrust />` and the CTA section):
```tsx
// DELETE:
<CareersBand />
```

- [ ] **Step 2: Update CTA banner subtext**

In the same file, find the inline CTA section subtext. Change:
```tsx
// BEFORE:
Whether you're a prospective client, partner, or future team member — we'd love to hear from you.

// AFTER:
Whether you're a prospective client or a future partner — we'd love to hear from you.
```

The full paragraph after the change should read:
```tsx
<p
  className="font-body text-sm leading-[1.75] mb-6"
  style={{ color: 'rgba(255,255,255,0.6)' }}
>
  Whether you're a prospective client or a future partner — we'd love to hear from you.
</p>
```

- [ ] **Step 3: Stage CareersBand.tsx for deletion**

Use `git rm` (not `rm`) — this deletes the file and stages the deletion in one step:

```bash
git rm src/components/sections/CareersBand.tsx
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no errors. CareersBand is not imported anywhere else, so no other files break.

- [ ] **Step 5: Verify in browser**

Open `http://localhost:3000/about`. Scroll from the Trust section to the bottom. Confirm:
- The "Become a part of our journey" strip between Trust and CTA is gone
- Trust → CTA flows directly
- CTA subtext no longer mentions "future team member"
- The team section still has its "Become a part of our journey" full-width banner — that stays

- [ ] **Step 6: Commit**

`src/app/about/page.tsx` was edited in steps 1–2. `CareersBand.tsx` was already staged by `git rm` in step 3. Commit all together:

```bash
git add src/app/about/page.tsx
git commit -m "feat(about): remove CareersBand, consolidate careers to team section, tighten CTA copy"
```

---

## Task 6: Update specs/08-ABOUT.md

**Files:**
- Modify: `specs/08-ABOUT.md`

- [ ] **Step 1: Update Stats Strip section**

Find section `## 4. Stats Strip` and replace the content block:

```markdown
## 4. Stats Strip

~~Removed April 2026.~~ The stats strip has been removed. The hero flows directly into the Story section. Impact numbers (48 MW, 120+, R380M, 12kt) are now presented in the Story section's animated stat panel.
```

- [ ] **Step 2: Update Story Section — left column**

Find `## 5. Story Section` → `**Left — image with badge:**` and replace with:

```markdown
**Left — animated stat panel:**
- Container: `border-radius: 16px`, `height: 230px`, `background: #0d1f22`
- Inner 2×2 grid: `gap: 3px`, `padding: 3px`
- Stats: R380M (Client savings), 48MW (Deployed), 120+ (Projects), 12kt (CO₂ saved / yr)
- R380M tile (top-left) is featured: `background: linear-gradient(140deg, #1a4a52, #0f2d33)` + radial glow
- Shimmer: 1px gradient line sweeps top of each tile via `.shimmer-tile` CSS class (keyframe in `globals.css`)
- Scroll reveal: Framer Motion `useInView`, spring stagger 0→0.45s
- Badge bottom-left: "Since 2019 / Our impact"
```

- [ ] **Step 3: Update Values section**

Find `## 7. Values` → `### 6th card — Join the team (accent style)` and replace:

```markdown
### 6th card — Ubuntu
- Same dark card style as values 01–05: `background: #0d1f22`
- Number: `06` in `rgba(255,255,255,0.08)`
- Title: `Ubuntu` — white
- Text: *"We are rooted in the African belief that we grow stronger together — alongside our clients, our communities, and our continent."*
```

- [ ] **Step 4: Update Careers Band section**

Find `## 11. Careers Band` and replace:

```markdown
## 11. Careers Band

~~Removed April 2026.~~ The standalone careers band has been removed. The single careers touchpoint on the About page is the "Become a part of our journey" banner at the bottom of the Team section grid (section 9).
```

- [ ] **Step 5: Update CTA Banner copy**

Find `## 12. CTA Banner` → the sub copy line and update:

```markdown
Sub: "Whether you're a prospective client or a future partner — we'd love to hear from you."
```

- [ ] **Step 6: Commit**

```bash
git add specs/08-ABOUT.md
git commit -m "docs: update 08-ABOUT spec to reflect April 2026 cleanup"
```

---

## Final verification

- [ ] Run `npm run build` one last time and confirm exit 0 with no TypeScript errors.
- [ ] Open `http://localhost:3000/about` and scroll the full page top to bottom. Confirm:
  - Hero → Story (no strip in between)
  - Story left column: animated 2×2 stat panel, shimmer, badge
  - Values: 6 dark cards including Ubuntu
  - Team section: "Become a part of our journey" banner present
  - Trust section: unchanged
  - No CareersBand strip
  - CTA: "prospective client or a future partner" copy
