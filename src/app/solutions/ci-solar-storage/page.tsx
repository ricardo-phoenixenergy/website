// src/app/solutions/ci-solar-storage/page.tsx
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
import { SolarCalculator } from '@/components/sections/calculators/SolarCalculator';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { TestimonialQuote } from '@/components/sections/Testimonials';

const vertical = 'ci-solar-storage' as const;
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
  { label: 'Technology & Financing', href: '#tabs' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
];

const tabs: TabItem[] = [
  {
    label: 'Solar Technology',
    icon: '🔆',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'Tier 1 Panels & Hybrid Inverters',
    body: 'We specify Tier 1 monocrystalline panels with string or hybrid inverters sized to your load profile, ensuring maximum yield and full NERSA grid compliance.',
    bullets: ['Tier 1 monocrystalline panels (JA, Longi, Jinko)', 'Hybrid inverters — battery-ready from day one', 'NERSA-compliant single-line diagram', 'Remote performance monitoring via web portal'],
    imageBg: 'linear-gradient(135deg, rgba(227,197,141,0.15) 0%, rgba(57,87,92,0.20) 100%)',
    imageEmoji: '🔆',
  },
  {
    label: 'Battery Storage',
    icon: '🔋',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'BESS — Energy Without Limits',
    body: 'Battery Energy Storage Systems extend your solar window through peak tariff hours, eliminate demand charges, and provide seamless UPS failover during loadshedding.',
    bullets: ['LFP chemistry for 6 000+ cycle life', 'Peak-shaving algorithms cut demand charges', 'Sub-20ms UPS failover — zero disruption', 'Scalable — add capacity as demand grows'],
    imageBg: 'linear-gradient(135deg, rgba(57,87,92,0.20) 0%, rgba(227,197,141,0.15) 100%)',
    imageEmoji: '⚡',
  },
  {
    label: 'Financing',
    icon: '💰',
    iconBg: 'rgba(227,197,141,0.18)',
    title: 'Financing Options',
    body: '',
    bullets: [],
    imageBg: '',
    imageEmoji: '',
    type: 'financing',
  },
];

const steps = [
  { label: 'Site Assessment', description: 'We audit your consumption data, roof or ground area, and grid connection details.', tag: 'Free' },
  { label: 'System Design', description: 'Our engineers produce a yield simulation and NERSA-compliant single-line diagram.', tag: '5–7 days' },
  { label: 'Installation', description: 'SAPVIA-certified teams install and commission with zero business disruption.', tag: '1–3 weeks' },
  { label: 'Monitoring', description: '24/7 remote monitoring with monthly generation reports and annual preventive maintenance.', tag: 'Ongoing' },
];

const testimonials: TestimonialQuote[] = [
  { text: 'Phoenix Energy cut our electricity bill by 58% in the first month. The PPA model meant we paid nothing upfront — a no-brainer for our manufacturing plant.', author: 'Sipho Dlamini', role: 'Operations Director', company: 'Coastal Manufacturing (Pty) Ltd' },
  { text: 'The installation team finished three days ahead of schedule. Our BESS system has seen us through every Stage 6 event without a single production stoppage.', author: 'Anele Nkosi', role: 'CFO', company: 'Nkosi Textiles' },
  { text: 'We were sceptical about yield projections but Phoenix delivered 4% above forecast in year one. Their monitoring portal gives us real-time data at our fingertips.', author: 'Pieter van der Berg', role: 'CEO', company: 'Berg Cold Chain Solutions' },
];

export default function CiSolarStoragePage() {
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
        title="Cut your electricity bill by <em>up to 60%</em>"
        subtitle="Commercial and industrial solar and battery storage — zero upfront capital with our PPA model."
        accent={meta.accent}
        badge={meta.label}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={{ label: 'Get a Free Assessment', href: '/contact' }}
        secondaryCta={{ label: 'See Projects', href: '#projects' }}
      />
      <SolutionSubNav links={subNavLinks} />
      <StatsStrip stats={cfg.stats} />
      <SolutionPain
        id="pain"
        eyebrow="The problem"
        headline="Eskom tariffs rising <em>15% every year</em>"
        body="South African businesses face relentless tariff escalation compounded by loadshedding that costs the economy over R1bn per day. Diesel generators are expensive and polluting. Commercial solar eliminates both problems — with no upfront cost on a PPA."
        pills={['Stage 6 Loadshedding', '15% Annual Tariff Hikes', 'NERSA Compliance', 'Generator Diesel Costs']}
        accent={meta.accent}
      >
        <SolarCalculator />
      </SolutionPain>
      <div id="how-it-works">
        <HowItWorks
          title="From assessment to <em>savings in weeks</em>"
          steps={steps}
          showCTA
          ctaLabel="Get a Free Assessment →"
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
