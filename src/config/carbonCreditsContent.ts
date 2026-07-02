// src/config/carbonCreditsContent.ts
import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { FaqItem } from '@/components/sections/FaqAccordion';

export const CARBON_CREDITS: {
  hero: { title: string; subtitle: string };
  becomes: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  opportunity: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  whyPhoenix: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  faq: { heading: string; items: FaqItem[] };
  cta: { eyebrow: string; heading: string; body: string };
} = {
  hero: {
    title: 'Maximise the <em>return</em> on your solar investment.',
    subtitle:
      'Your solar system already saves you money by reducing your electricity bill. It also generates verified carbon reductions with real market value. We manage the certification, trading, and sale of your carbon credits — creating a new revenue stream from the same solar asset.',
  },

  becomes: {
    eyebrow: 'The basics',
    heading: 'How does your solar system generate <em>carbon credits</em>?',
    subtitle:
      'Every unit of clean electricity your solar system produces displaces electricity that would otherwise have been supplied by the national grid, avoiding carbon emissions in the process. Those avoided emissions can be independently measured, certified, and sold as carbon credits — creating an additional revenue stream from the solar system you already own.',
    cards: [
      { icon: 'Sun', title: 'Your solar already avoids emissions', body: 'Every megawatt-hour your system generates reduces your reliance on grid electricity, preventing the associated carbon emissions. If your system is producing clean energy, it’s already creating the environmental benefit required to generate carbon credits.' },
      { icon: 'ClipboardCheck', title: 'Your emissions are independently certified', body: 'We collect and analyse your generation data, quantify the avoided emissions, and coordinate independent third-party verification against recognised carbon standards. Once certified, the corresponding carbon credits are issued to your project.' },
      { icon: 'DollarSign', title: 'Your carbon credits are sold on your behalf', body: 'We market and sell your certified carbon credits to qualified buyers, manage the transaction from start to finish, and distribute the proceeds — turning your existing solar system into an ongoing source of additional revenue.' },
    ],
  },

  opportunity: {
    eyebrow: 'The opportunity',
    heading: 'Most commercial solar systems never realise their <em>full value</em>.',
    subtitle:
      'Generating carbon credits isn’t automatic. Most businesses own solar systems that qualify, but never register them, verify the emissions reductions, or access the carbon markets needed to turn those reductions into revenue.',
    cards: [
      { icon: 'Zap', title: 'Your system may already qualify', body: 'If your solar system generates clean electricity, it may already be producing eligible emissions reductions. Most owners simply never take the next step.' },
      { icon: 'Globe', title: 'Carbon markets are highly specialised', body: 'Generating carbon credits requires project registration, ongoing monitoring, independent verification, and access to recognised carbon registries and buyers.' },
      { icon: 'UserTie', title: 'That’s where we come in', body: 'We manage the entire process — from eligibility assessment and certification to trading and payouts — so your existing solar system becomes an additional source of revenue.' },
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
