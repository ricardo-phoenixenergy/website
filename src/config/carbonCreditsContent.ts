// src/config/carbonCreditsContent.ts
import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { TabItem } from '@/components/sections/SolutionTabs';
import type { FaqItem } from '@/components/sections/FaqAccordion';

const TAB_ICON_BG = 'rgba(156,175,136,0.18)';
const TAB_IMAGE_BG_A = 'linear-gradient(135deg, rgba(156,175,136,0.18) 0%, rgba(57,87,92,0.18) 100%)';
const TAB_IMAGE_BG_B = 'linear-gradient(135deg, rgba(57,87,92,0.18) 0%, rgba(156,175,136,0.18) 100%)';

export const CARBON_CREDITS: {
  hero: { title: string; subtitle: string };
  becomes: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  opportunity: { eyebrow: string; heading: string; cards: ExplainerCardItem[] };
  whyPhoenix: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  tabs: TabItem[];
  faq: { heading: string; items: FaqItem[] };
  cta: { eyebrow: string; heading: string; body: string };
} = {
  hero: {
    title: 'Turn your existing solar system into <em>a new revenue stream</em>.',
    subtitle:
      'Your solar system already avoids carbon emissions every day. Phoenix certifies those reductions, converts them into verified carbon credits, and sells them on your behalf — creating additional revenue on top of the electricity savings you already enjoy.',
  },

  becomes: {
    eyebrow: 'The basics',
    heading: 'How does your solar system generate <em>carbon credits</em>?',
    subtitle:
      'Every unit of solar electricity your system produces avoids emissions that would otherwise have come from the national grid. Those avoided emissions can be independently verified, certified and sold as carbon credits — creating an entirely new revenue stream from the same solar asset.',
    cards: [
      { icon: 'Sun', title: 'Your solar already avoids emissions', body: 'Every megawatt-hour your system generates replaces electricity from the grid, preventing carbon emissions that would otherwise have been produced.' },
      { icon: 'ClipboardCheck', title: 'Those reductions are independently verified', body: 'Your generation data is measured, audited and verified against recognised carbon standards before credits are issued.' },
      { icon: 'DollarSign', title: 'Verified credits become revenue', body: 'Once issued, the credits are sold to qualified buyers. Phoenix manages the entire process and you receive the proceeds.' },
    ],
  },

  opportunity: {
    eyebrow: 'The opportunity',
    heading: 'Your solar system already saves money. <em>It could also be generating revenue.</em>',
    cards: [
      { icon: 'Zap', title: 'You’re already creating the asset', body: 'If your solar system is generating electricity, it’s already producing the emissions reductions required for carbon credits.' },
      { icon: 'TrendingUp', title: 'Revenue that stacks on your savings', body: 'Carbon credit income is earned in addition to the electricity bill savings your system already delivers.' },
      { icon: 'Building', title: 'No changes to your system', body: 'No additional equipment, operational changes or disruption to your facility. Phoenix handles registration, verification and trading while your system continues operating as normal.' },
    ],
  },

  whyPhoenix: {
    eyebrow: 'Why work with us?',
    heading: 'We unlock the value. <em>You keep running your business.</em>',
    subtitle:
      'Generating carbon credits is far more than simply owning solar. It requires ongoing monitoring, independent verification, registry management and access to carbon markets. Phoenix manages the entire process on your behalf.',
    cards: [
      { icon: 'ClipboardCheck', title: 'Registration & Compliance', body: 'Project registration, eligibility assessment and documentation.' },
      { icon: 'Activity', title: 'Monitoring & Verification', body: 'Continuous monitoring, emissions calculations and third-party verification.' },
      { icon: 'TrendingUp', title: 'Trading & Payouts', body: 'We market your credits, manage buyer relationships and distribute proceeds with complete transparency.' },
    ],
  },

  tabs: [
    {
      label: 'Measurement & MRV',
      icon: 'Activity',
      iconBg: TAB_ICON_BG,
      title: 'Measurement, Reporting & Verification',
      body: 'Automatic collection of inverter data, emissions calculations and audit-ready reporting throughout the life of the project.',
      bullets: ['Automatic inverter data capture.', 'Baseline emission displacement calculation.', 'Audit-ready reports.', 'ESG dashboard for corporate reporting.'],
      imageBg: TAB_IMAGE_BG_A,
      imageEmoji: '📊',
    },
    {
      label: 'Verification & Standards',
      icon: 'ClipboardCheck',
      iconBg: TAB_ICON_BG,
      title: 'Independent verification against recognised standards',
      body: 'Independent third-party verification against recognised international carbon standards. Phoenix selects the most appropriate methodology for your project.',
      bullets: ['Independent third-party audit.', 'Recognised international standards.', 'Best-fit methodology per project.', 'Full documentation trail.'],
      imageBg: TAB_IMAGE_BG_B,
      imageEmoji: '🔍',
    },
    {
      label: 'Trading & Payouts',
      icon: 'DollarSign',
      iconBg: TAB_ICON_BG,
      title: 'Credit trading and transparent payouts',
      body: 'Verified credits are sold through trusted carbon markets and buyer networks. You receive scheduled payouts together with complete reporting and transaction transparency.',
      bullets: ['Access to vetted buyer networks.', 'Scheduled credit sales.', 'Transparent payouts.', 'Full transaction reporting.'],
      imageBg: TAB_IMAGE_BG_A,
      imageEmoji: '💰',
    },
  ],

  faq: {
    heading: 'Carbon credits, answered.',
    items: [
      { question: 'Is carbon credit trading legitimate?', answer: 'Yes. Carbon credits are a well-established, regulated global market. Credits are only issued after independent third-party verification against recognised standards, so every credit represents a genuine, audited tonne of avoided emissions.' },
      { question: 'Do I still own my solar system?', answer: 'Yes. You retain full ownership of your system and continue to operate it exactly as you do today. Phoenix only manages the certification and sale of the carbon reductions it produces.' },
      { question: 'Can I still claim my renewable energy benefits?', answer: 'Your electricity bill savings are unaffected. We’ll confirm how carbon credit registration interacts with any other environmental claims so there’s no double-counting, and structure everything correctly from the start.' },
      { question: 'What does the service cost?', answer: 'There’s no upfront cost to assess and register your system. Phoenix is paid from a share of the credit revenue generated, so our incentives are aligned with yours — we only earn when you do.' },
      { question: 'Is there a minimum system size?', answer: 'Larger systems generate more credits and are the most economical to register, but we assess each system individually. Book an assessment and we’ll tell you whether yours qualifies.' },
      { question: 'How long before I receive my first payment?', answer: 'Onboarding and registration typically take six to eight weeks, after which monitoring runs continuously and credits are issued and sold on a scheduled basis.' },
      { question: 'What happens if carbon prices change?', answer: 'Carbon prices move with the market, which is why we show revenue as a range rather than a fixed figure. Phoenix actively manages the timing and placement of sales to protect your returns.' },
      { question: 'Can newly installed solar systems be registered from day one?', answer: 'Yes. New systems can be enrolled at commissioning so they start generating carbon credits from their first day of operation.' },
    ],
  },

  cta: {
    eyebrow: 'Start earning',
    heading: 'Turn your solar system into an additional source of revenue',
    body: 'We’ll assess your existing solar system, estimate how many carbon credits it could generate and confirm whether it qualifies — all at no obligation.',
  },
};
