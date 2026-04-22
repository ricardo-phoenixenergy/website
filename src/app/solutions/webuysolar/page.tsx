// src/app/solutions/webuysolar/page.tsx
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
import { WeBuySolarCalculator } from '@/components/sections/calculators/WeBuySolarCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'webuysolar' as const;
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
  { label: 'What We Accept', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Rooftop Systems',
    icon: '🏭',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'Commercial Rooftop Solar',
    body: 'We purchase rooftop solar installations of any size from commercial and industrial facilities. Reason for selling does not matter — relocation, upgrade, closure, or portfolio rationalisation all qualify.',
    bullets: ['Systems from 10 kWp to 10 MWp', 'All major inverter brands accepted', 'Panels up to 15 years old considered', 'Roof structural assessment included'],
    imageBg: 'linear-gradient(135deg, rgba(201,122,64,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🏭',
  },
  {
    label: 'Ground-Mount',
    icon: '🌾',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'Ground-Mount & Farm Systems',
    body: 'Agricultural and ground-mount solar installations are assessed on a case-by-case basis. We handle all decommissioning, transport, and repowering logistics.',
    bullets: ['Single-axis tracker systems accepted', 'Agricultural installations welcome', 'DC and AC-coupled systems', 'Full decommissioning by our certified teams'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(201,122,64,0.15) 100%)',
    imageEmoji: '🌾',
  },
  {
    label: 'Battery Storage',
    icon: '🔋',
    iconBg: 'rgba(201,122,64,0.18)',
    title: 'BESS & Hybrid Systems',
    body: 'Battery systems paired with solar installations are purchased as a bundle. We assess state-of-health and offer fair buyback based on remaining capacity.',
    bullets: ['LFP and NMC chemistries', 'State-of-health assessment included', 'Bundle pricing for solar + BESS', 'Inverter and BMS included in offer'],
    imageBg: 'linear-gradient(135deg, rgba(201,122,64,0.18) 0%, rgba(57,87,92,0.22) 100%)',
    imageEmoji: '🔋',
  },
];

const steps = [
  { label: 'Submit Details', description: 'Share your system specs and location — a 5-minute online form or a quick call.', tag: 'Online' },
  { label: 'Site Inspection', description: 'Our technician visits within 48 hours, assesses condition, and prepares an offer.', tag: '48 hours' },
  { label: 'Offer & Sign', description: "You receive a written offer. No obligation — accept if it works for you.", tag: 'Your choice' },
  { label: 'Cash & Removal', description: 'Payment is transferred within 14 days. Our team handles all decommissioning.', tag: '14 days' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'We relocated our head office and had no use for the solar system. Phoenix made a fair offer within 48 hours and their team removed everything cleanly within a week.', author: 'Siya Mthembu', role: 'Facilities Director', company: 'Mthembu Group' },
  { text: "Upgrading to a larger system, we sold the old installation to Phoenix. The process was effortless — one site visit, one offer, one bank transfer. Exactly what you'd want.", author: 'Karen Fourie', role: 'COO', company: 'Fourie Industrial' },
  { text: 'Phoenix paid significantly more than the scrap quotes we received elsewhere. They clearly know the second-life value of solar assets and price accordingly.', author: 'Rajesh Pillay', role: 'Managing Director', company: 'Pillay Manufacturing' },
];

export default function WeBuySolarPage() {
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
        title="We buy your solar system — <em>cash in 14 days</em>"
        subtitle="Fast valuation, fair price, full decommissioning. Any brand, any size, any reason for selling."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #1a0f00 0%, #3a2000 50%, #5a3a10 100%)"
        primaryCta={{ label: 'Get a Valuation', href: '/contact' }}
        secondaryCta={{ label: 'What We Accept', href: '#tabs' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The situation"
        headline="Your solar system has <em>real second-life value</em>"
        body="Businesses relocating, upgrading, or closing often leave solar assets stranded. Scrap dealers undervalue them; brokers take months. Phoenix Energy buys directly — a fair offer based on generation potential and component condition, settled fast."
        pills={['Business Relocation', 'System Upgrade', 'Portfolio Sale', 'Business Closure']}
        accent={meta.accent}
      >
        <WeBuySolarCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="From enquiry to cash <em>in 14 days</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Valuation →"
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
