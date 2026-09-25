'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SOLUTION_META } from '@/types/solutions';
import type { SolutionVertical } from '@/types/solutions';
import type { HeroImages } from '@/types/sanity';
import { IconArrowRight } from '@/components/ui/Icons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Button } from '@/components/ui/Button';
import { DISCOVERY_CTA } from '@/config/ctas';

interface Panel {
  vertical: SolutionVertical;
  number: string;
  href: string;
  title: string;
  description: string;
}

const PANELS: Panel[] = [
  {
    vertical: 'ci-solar-storage',
    number: '01',
    href: '/solutions/ci-solar-storage',
    title: 'Reduce your electricity costs with solar & storage',
    description: 'Design, finance, install and operate commercial solar and battery systems that lower energy costs, improve energy resilience and maximise long-term savings.',
  },
  {
    vertical: 'wheeling',
    number: '02',
    href: '/solutions/wheeling',
    title: 'Buy cheaper renewable energy via the grid',
    description: 'Choose from flexible wheeling solutions that give your business access to lower-cost renewable electricity through the grid.',
  },
  {
    vertical: 'webuysolar',
    number: '03',
    href: '/solutions/webuysolar',
    title: 'Cash in your solar investment',
    description: 'Sell your existing solar system while continuing to buy the electricity it generates at a lower cost than your utility. You free up capital without losing the benefits.',
  },
  {
    vertical: 'energy-optimisation',
    number: '04',
    href: '/solutions/energy-optimisation',
    title: 'Reduce energy costs before adding generation',
    description: 'Identify and eliminate energy waste through efficiency upgrades, tariff optimisation, demand management and intelligent energy monitoring.',
  },
  {
    vertical: 'ev-fleets',
    number: '05',
    href: '/solutions/ev-fleets',
    title: 'Electrify your fleet from day one',
    description: 'End-to-end fleet electrification, with infrastructure, vehicles, financing and management in one solution.',
  },
  {
    vertical: 'carbon-credits',
    number: '06',
    href: '/solutions/carbon-credits',
    title: 'Turn your solar into a new revenue stream',
    description: 'We register, verify and trade carbon credits on your behalf, creating additional revenue from the clean energy your system already generates.',
  },
];

// The company-level promise, from the site's own title and description.
const HERO_HEADING = 'Phoenix Energy: integrated clean energy solutions for South African businesses';
const HERO_HEADING_VISIBLE = 'Integrated clean energy for South African businesses';
const HERO_SUMMARY =
  'Six solutions, one partner. Cut your electricity costs, buy renewable power through the grid, electrify your fleet or earn from the solar you already have.';

const revealVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
} as const;

const barVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.3, delay: 0.18, ease: 'easeOut' as const },
  },
  exit: { scaleX: 0, opacity: 0, transition: { duration: 0.1 } },
} as const;

// ─── Shared panel content (active state) ─────────────────────────────────────

// One `sizes` for every hero image, so the static phone hero and the first
// desktop panel resolve to the same file at any width and download it once.
// 60vw is the open desktop panel's width.
const HERO_SIZES = '(max-width: 1279px) 100vw, 60vw';

function PanelBackground({
  img, accent, isActive, sizes, preload,
}: {
  img: { url: string; lqip?: string } | null | undefined;
  accent: string;
  isActive: boolean;
  sizes: string;
  preload: boolean;
}) {
  if (!img?.url) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, var(--color-pe-nav-dark) 0%, ${accent} 160%)` }}
      />
    );
  }
  return (
    <Image
      src={img.url}
      alt=""
      fill
      className={`object-cover transition-transform duration-[800ms] ease-in-out motion-reduce:transition-none ${isActive ? 'motion-safe:scale-105' : 'scale-100'}`}
      sizes={sizes}
      preload={preload}
      quality={85}
      {...(img.lqip ? { placeholder: 'blur' as const, blurDataURL: img.lqip } : {})}
    />
  );
}

function ActivePanelContent({ panel, animateIn }: { panel: Panel; animateIn: boolean }) {
  const meta = SOLUTION_META[panel.vertical];
  // On first load the hero text is in the server HTML at full opacity; the
  // staggered reveal plays only when the visitor opens another panel.
  const initial = animateIn ? 'hidden' : false;
  return (
    <div>
      <motion.div
        variants={barVariants}
        initial={initial} animate="visible"
        className="h-0.5 mb-4 origin-left"
        style={{ width: 40, background: meta.accent }}
      />
      <motion.p
        custom={0.18} variants={revealVariants} initial={initial} animate="visible"
        className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-2"
        style={{ color: meta.accent }}
      >
        {meta.label}
      </motion.p>
      <motion.h2
        custom={0.22} variants={revealVariants} initial={initial} animate="visible"
        className="font-display font-extrabold text-white leading-[1.15] mb-3"
        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', maxWidth: 520 }}
      >
        {panel.title}
      </motion.h2>
      <motion.p
        custom={0.3} variants={revealVariants} initial={initial} animate="visible"
        className="font-body text-base font-normal leading-[1.75] mb-5"
        style={{ color: 'var(--color-on-dark-muted)', maxWidth: 440 }}
      >
        {panel.description}
      </motion.p>
      <motion.div custom={0.38} variants={revealVariants} initial={initial} animate="visible">
        <ArrowLink href={panel.href} size="lg" style={{ color: meta.accent }}>
          Explore {meta.label}
        </ArrowLink>
      </motion.div>
    </div>
  );
}

// ─── Desktop: horizontal accordion ────────────────────────────────────────────
// Panels open on hover, click or keyboard. Nothing rotates on its own: content
// that moves by itself for more than five seconds needs a pause control
// (WCAG 2.2.2), and the auto-advance removed the link a keyboard user had focused.

function DesktopAccordion({ heroImages }: { heroImages: HeroImages }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const uid = useId();

  const open = (i: number) => {
    if (i === activeIndex) return;
    setHasInteracted(true);
    setActiveIndex(i);
  };

  return (
    <div
      className="focus-on-dark relative flex w-full overflow-hidden"
      style={{ height: 'calc(100vh - 60px)', minHeight: 500 }}
    >
      <h1 className="sr-only">{HERO_HEADING}</h1>
      {PANELS.map((panel, i) => {
        const meta = SOLUTION_META[panel.vertical];
        const isActive = i === activeIndex;
        const contentId = `${uid}-panel-${i}`;

        return (
          <div
            key={panel.vertical}
            className="relative overflow-hidden transition-all duration-[600ms] motion-reduce:transition-none"
            style={{
              // The open panel takes 60% of the width: 7.5 against 1 for each of the five closed ones.
              flex: isActive ? 7.5 : 1,
              transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
              borderRight: i < PANELS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
            }}
            onMouseEnter={() => open(i)}
          >
            <PanelBackground
              img={heroImages[panel.vertical]}
              accent={meta.accent}
              isActive={isActive}
              sizes={HERO_SIZES}
              preload={i === 0}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 transition-all duration-500 motion-reduce:transition-none"
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, rgba(13,31,34,0.1) 0%, rgba(13,31,34,0.82) 60%, rgba(13,31,34,0.95) 100%)'
                  : 'rgba(13,31,34,0.72)',
              }}
            />

            {/* The whole panel is the control. One element in both states, so
                keyboard focus stays put when the panel expands. */}
            <button
              type="button"
              aria-expanded={isActive}
              aria-controls={contentId}
              onClick={() => open(i)}
              className={`focus-inset absolute inset-0 z-[1] flex items-center justify-center ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span
                className={isActive ? 'sr-only' : 'font-body text-xs font-bold uppercase tracking-[0.14em] whitespace-nowrap'}
                // on-dark-muted: over the darkened photos on-dark-subtle measured 3.8:1.
                style={isActive ? undefined : { color: 'var(--color-on-dark-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {meta.label}
              </span>
            </button>

            <div id={contentId} className="absolute inset-x-0 bottom-0 z-[2] px-6 pb-10 md:px-8 md:pb-12">
              {isActive && <ActivePanelContent panel={panel} animateIn={hasInteracted} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Below 1280px: one static hero, then a row per solution ──────────────────
// Replaces a 600svh scroll-driven accordion: the first screen now says what
// Phoenix does, and every solution is one tap away without scrolling six screens.

function MobileHero({ heroImages }: { heroImages: HeroImages }) {
  const lead = PANELS[0];
  const leadImg = heroImages[lead.vertical];

  return (
    <section aria-labelledby="home-hero-heading" className="focus-on-dark bg-pe-nav-dark">
      <div className="relative flex flex-col justify-end overflow-hidden min-h-[min(78svh,720px)]">
        {leadImg?.url ? (
          <Image
            src={leadImg.url}
            alt=""
            fill
            preload
            quality={85}
            sizes={HERO_SIZES}
            className="object-cover"
            {...(leadImg.lqip ? { placeholder: 'blur' as const, blurDataURL: leadImg.lqip } : {})}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, var(--color-pe-nav-dark) 0%, ${SOLUTION_META[lead.vertical].accent} 160%)` }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(13,31,34,0.30) 0%, rgba(13,31,34,0.55) 40%, rgba(13,31,34,0.97) 100%)' }}
        />
        <div className="relative page-container w-full pt-32 pb-10">
          <h1
            id="home-hero-heading"
            className="font-display font-extrabold text-white leading-[1.1] text-balance max-w-[18ch]"
            style={{ fontSize: 'clamp(2rem, 6.4vw, 3.25rem)' }}
          >
            {HERO_HEADING_VISIBLE}
          </h1>
          <p className="font-body text-base leading-[1.7] mt-4 max-w-[34rem]" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {HERO_SUMMARY}
          </p>
          <Button variant="light" href={DISCOVERY_CTA.href} className="mt-7">
            {DISCOVERY_CTA.label} <IconArrowRight />
          </Button>
        </div>
      </div>

      <div className="page-container pb-12">
        <h2 className="sr-only">Our solutions</h2>
        <ul className="grid md:grid-cols-2 md:gap-x-8 border-b border-white/10">
          {PANELS.map((panel) => {
            const meta = SOLUTION_META[panel.vertical];
            const thumb = heroImages[panel.vertical];
            return (
              <li key={panel.vertical} className="border-t border-white/10">
                <Link
                  href={panel.href}
                  className="group flex min-h-[72px] items-center gap-4 rounded-xl py-3"
                >
                  <span className="relative size-14 flex-shrink-0 overflow-hidden rounded-xl" style={{ background: '#1a3035' }}>
                    {thumb?.url && (
                      <Image src={thumb.url} alt="" fill sizes="56px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-display text-base font-bold text-white">
                      <span aria-hidden="true" className="size-2 flex-shrink-0 rounded-full" style={{ background: meta.accent }} />
                      {meta.label}
                    </span>
                    <span className="mt-0.5 block font-body text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      {panel.title}
                    </span>
                  </span>
                  <span aria-hidden="true" className="flex-shrink-0 text-white/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white">
                    <IconArrowRight size={16} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ─── Public export — responsive wrapper ──────────────────────────────────────

export function HeroAccordion({ heroImages }: { heroImages: HeroImages }) {
  return (
    <>
      <div className="hidden xl:block">
        <DesktopAccordion heroImages={heroImages} />
      </div>
      <div className="xl:hidden">
        <MobileHero heroImages={heroImages} />
      </div>
    </>
  );
}
