// src/app/solutions/wheeling/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionSubNav } from '@/components/sections/SolutionSubNav';
import { SolutionPain } from '@/components/sections/SolutionPain';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTABanner } from '@/components/sections/CTABanner';
import { StatsStrip } from '@/components/ui/StatsStrip';
import { WheelingCalculator } from '@/components/sections/calculators/WheelingCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'wheeling' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}` },
};

const subNavLinks = [
  { label: 'Overview', href: '#pain' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Agreement Types', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Direct Wheeling',
    icon: '⚡',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Generator-to-Consumer Wheeling',
    body: 'Phoenix Energy connects your facility directly to a renewable generator using the Eskom transmission grid. You pay the generator a fixed tariff below the Eskom rate — no infrastructure investment required.',
    bullets: ['Fixed tariff below Eskom rate', 'Renewable energy certificates (RECs) included', 'NERSA-licensed trading desk', 'Transparent monthly settlement statements'],
    imageBg: 'linear-gradient(135deg, rgba(217,124,118,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔌',
  },
  {
    label: 'Aggregated Pool',
    icon: '🌐',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Multi-Generator Pool Access',
    body: 'For consumers who want supply security, Phoenix aggregates multiple generators into a single pooled agreement. Your volume is matched dynamically to maintain consistent supply.',
    bullets: ['Supply security from multiple generators', 'Volume-matched dynamically', 'Single contract, single invoice', 'Scales with your consumption growth'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(217,124,118,0.15) 100%)',
    imageEmoji: '🌐',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(217,124,118,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Consumption Audit', description: 'We analyse 12 months of interval meter data to quantify your wheeling opportunity.', tag: 'Free' },
  { label: 'Generator Matching', description: 'Phoenix matches your load profile to available generators on our licensed platforms.', tag: '5–10 days' },
  { label: 'Agreement Sign-off', description: 'NERSA-compliant wheeling agreement executed between generator, Eskom, and consumer.', tag: '2–4 weeks' },
  { label: 'Live Settlement', description: 'T-day energy accounting with monthly consolidated invoicing and REC delivery.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: "We switched 70% of our load to wheeled renewable energy and immediately cut our electricity cost by 34%. Phoenix handled every licensing requirement — we didn't lift a finger.", author: 'Tarryn Botha', role: 'Head of Sustainability', company: 'Protea Retail Group' },
  { text: "The wheeling agreement was active within six weeks. The fixed tariff has given us budget certainty we haven't had in years — Eskom increases no longer keep us up at night.", author: 'Mohammed Ismail', role: 'Group Financial Manager', company: 'Ismail Properties' },
  { text: "Phoenix's aggregated pool means we get renewable energy even on cloudy days. The monthly REC certificates satisfy our ESG reporting requirements perfectly.", author: 'Liesl Venter', role: 'COO', company: 'Venter Food Processing' },
];

export default function WheelingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: meta.label,
    provider: { '@type': 'Organization', name: 'Phoenix Energy' },
    description: cfg.seoDescription,
    url: `https://phoenixenergy.solutions/solutions/${vertical}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SolutionHero
        title="Buy renewable energy <em>directly from the source</em>"
        subtitle="Wheel clean power through the Eskom grid to your facility — fixed tariff, no infrastructure, 32% average saving."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #1a0f0f 0%, #3a1a18 50%, #5a2a28 100%)"
        primaryCta={{ label: 'Get a Wheeling Quote', href: '/contact' }}
        secondaryCta={{ label: 'How It Works', href: '#how-it-works' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The problem"
        headline="You're paying Eskom rates <em>when cheaper power exists</em>"
        body="Licensed wheeling allows South African businesses to bypass Eskom's retail tariff and buy directly from renewable generators. The regulatory framework exists — but navigating NERSA licensing, generator contracts, and T-day settlement requires expert intervention."
        pills={['NERSA Licensing', 'Eskom Retail Tariff', 'Tariff Escalation', 'Carbon Footprint']}
        accent={meta.accent}
      >
        <WheelingCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="Wheeling made <em>straightforward</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Wheeling Quote →"
          ctaHref="/contact"
        />
      </div>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} />
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <Testimonials id="testimonials" quotes={testimonials} accent={meta.accent} />
      <CTABanner />
    </>
  );
}
