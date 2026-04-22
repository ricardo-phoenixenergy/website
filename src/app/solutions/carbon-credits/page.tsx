// src/app/solutions/carbon-credits/page.tsx
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
import { CarbonCalculator } from '@/components/sections/calculators/CarbonCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'carbon-credits' as const;
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
  { label: 'Standards & Process', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Verra VCS',
    icon: '🌿',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Verra Verified Carbon Standard',
    body: 'Phoenix registers your solar system under the Verra VCS methodology, the most widely accepted carbon standard globally. Credits are issued quarterly and tradeable on international markets.',
    bullets: ['Gold Standard or Verra VCS certification', 'Internationally tradeable credits', 'Quarterly issuance and payout', 'Independent third-party verification'],
    imageBg: 'linear-gradient(135deg, rgba(156,175,136,0.18) 0%, rgba(57,87,92,0.18) 100%)',
    imageEmoji: '🌿',
  },
  {
    label: 'MRV & Reporting',
    icon: '📋',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Measurement, Reporting & Verification',
    body: 'Our MRV platform automatically captures generation data from your inverters, calculates displacement emissions, and generates audit-ready reports — with zero manual effort on your part.',
    bullets: ['Automatic inverter data capture', 'Baseline emission displacement calculation', 'Audit-ready MRV reports', 'ESG dashboard for corporate reporting'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.18) 0%, rgba(156,175,136,0.18) 100%)',
    imageEmoji: '📋',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Eligibility Check', description: 'We verify your solar system meets Verra VCS project criteria — takes 48 hours.', tag: 'Free' },
  { label: 'Project Registration', description: 'Phoenix submits your project to the registry. Third-party validation is arranged.', tag: '30–60 days' },
  { label: 'First Issuance', description: 'Credits issued for retrospective generation since system commissioning date.', tag: 'Once registered' },
  { label: 'Quarterly Payouts', description: 'Credits issued and sold quarterly. Revenue is deposited directly to your account.', tag: 'Every quarter' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'We had no idea our solar system was sitting on a revenue stream. Phoenix registered us in 45 days and we received our first credit payout within the quarter.', author: 'Desiree Mkhize', role: 'Sustainability Lead', company: 'Mkhize Manufacturing' },
  { text: "The MRV platform does everything automatically. The quarterly ESG reports Phoenix produces have been invaluable for our JSE sustainability disclosure.", author: 'Bernhard Steyn', role: 'Group CFO', company: 'Steyn Holdings Ltd' },
  { text: 'Carbon credit revenue now offsets our entire annual maintenance contract. It has turned our solar system from a cost centre into a net revenue generator.', author: 'Fatima Davids', role: 'Financial Director', company: 'Davids Retail Group' },
];

export default function CarbonCreditsPage() {
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
        title="Turn your solar generation into <em>quarterly revenue</em>"
        subtitle="Verra-certified carbon credits from your existing solar system — fully managed, zero admin, quarterly payouts."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)"
        primaryCta={{ label: 'Check Eligibility', href: '/contact' }}
        secondaryCta={{ label: 'How It Works', href: '#how-it-works' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The opportunity"
        headline="Your solar system is generating <em>untapped revenue</em>"
        body="Every kWh your solar system produces displaces grid-sourced CO₂. Under Verra VCS, those avoided emissions convert to tradeable carbon credits worth R8+ each. Most solar owners have never claimed them — leaving significant revenue on the table."
        pills={['Verra VCS Standard', 'ESG Reporting', 'JSE Disclosure', 'Carbon Tax Offset']}
        accent={meta.accent}
      >
        <CarbonCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="Credits in your account <em>within 90 days</em>"
          steps={steps}
          showCTA
          ctaLabel="Check Eligibility →"
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
