// src/app/solutions/carbon-credits/page.tsx
import type { Metadata } from 'next';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { SolutionTabs } from '@/components/sections/SolutionTabs';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { CTABanner } from '@/components/sections/CTABanner';
import { CarbonCalculator } from '@/components/sections/calculators/CarbonCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';

const vertical = 'carbon-credits' as const;
const cfg = VERTICAL_CONFIG[vertical];
const meta = SOLUTION_META[vertical];

export const metadata: Metadata = {
  title: cfg.seoTitle,
  description: cfg.seoDescription,
  alternates: { canonical: `https://phoenixenergy.solutions/solutions/${vertical}` },
  openGraph: { title: cfg.seoTitle, description: cfg.seoDescription, url: `https://phoenixenergy.solutions/solutions/${vertical}`, images: [{ url: 'https://phoenixenergy.solutions/og-solutions-carbon-credits.png', width: 1200, height: 630 }] },
};

const tabs: TabItem[] = [
  {
    label: 'Verra VCS',
    icon: 'Leaf',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Verra Verified Carbon Standard',
    body: 'Phoenix registers your solar system under the Verra VCS methodology, the most widely accepted carbon standard globally. Credits are issued quarterly and tradeable on international markets.',
    bullets: ['Gold Standard or Verra VCS certification', 'Internationally tradeable credits', 'Quarterly issuance and payout', 'Independent third-party verification'],
    imageBg: 'linear-gradient(135deg, rgba(156,175,136,0.18) 0%, rgba(57,87,92,0.18) 100%)',
    imageEmoji: '🌿',
  },
  {
    label: 'MRV & Reporting',
    icon: 'ClipboardCheck',
    iconBg: 'rgba(156,175,136,0.18)',
    title: 'Measurement, Reporting & Verification',
    body: 'Our MRV platform automatically captures generation data from your inverters, calculates displacement emissions, and generates audit-ready reports — with zero manual effort on your part.',
    bullets: ['Automatic inverter data capture', 'Baseline emission displacement calculation', 'Audit-ready MRV reports', 'ESG dashboard for corporate reporting'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.18) 0%, rgba(156,175,136,0.18) 100%)',
    imageEmoji: '📋',
  },
  {
    label: 'Financing',
    icon: 'DollarSign',
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
        heroImage="/hero-carbon.png"
        heroBg="linear-gradient(135deg, #0d1f22 0%, #182a1a 50%, #2a4a28 100%)"
        primaryCta={{ label: 'Check Eligibility', href: '/contact' }}
      >
        <CarbonCalculator />
      </SolutionHero>
      <SolutionTabs id="tabs" tabs={tabs} accent={meta.accent} vertical="carbon-credits" />
      <div id="how-it-works">
        <HowItWorks
          title="Credits in your account <em>within 90 days</em>"
          steps={steps}
          showCTA
          ctaLabel="Check Eligibility →"
          ctaHref="/contact"
        />
      </div>
      <div id="projects">
        <FeaturedProjects vertical={vertical} />
      </div>
      <RelatedArticles vertical={vertical} />
      <CTABanner
        eyebrow="Start earning"
        heading="Turn your clean energy into verified revenue"
        body="We handle Gold Standard registration, annual verification, and credit trading on your behalf. Your sustainability generates income — we do the work."
        primaryCta={{ label: 'Get a Carbon Assessment', href: '/contact' }}
        stats={[
          { value: '12',    label: 'Registered projects' },
          { value: '45k t', label: 'CO₂ offset' },
          { value: 'R12M',  label: 'Credits traded' },
          { value: 'GS',    label: 'Gold Standard certified' },
        ]}
      />
    </>
  );
}
