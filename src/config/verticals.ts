import type { SolutionVertical } from '@/types/solutions';

export interface VerticalStep {
  label: string;
  description: string;
  tag?: string;
}

export interface VerticalTab {
  label: string;
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  bullets: string[];
  imageBg: string;
}

export interface VerticalConfig {
  slug: SolutionVertical;
  label: string;
  accent: string;
  accentText: string;
  heroTitle: string;
  heroSub: string;
  stats: { value: string; label: string }[];
  pain: {
    eyebrow: string;
    headline: string;
    body: string;
    pills: string[];
    calcTitle: string;
    calcLabel: string;
    calcHighlightLabel: string;
    calcNote: string;
    calcFn: (monthlyBill: number) => { left: number; highlight: number; right: number };
  };
  solution: {
    h2: string;
    intro: string;
    tabs: VerticalTab[];
    showFinancingTab: boolean;
  };
  howItWorks: {
    title: string;
    steps: VerticalStep[];
  };
  projectsEyebrow: string;
  cta: { title: string; sub: string };
  seo: { title: string; description: string };
}

/* ─── Shared calculator helpers ─────────────────────────────────────────────── */

function eskomCost(monthlyBill: number, years: number): number {
  let total = 0;
  for (let i = 0; i < years; i++) {
    total += monthlyBill * 12 * Math.pow(1.127, i);
  }
  return total;
}

/* ─── Vertical configurations ───────────────────────────────────────────────── */

export const verticalConfigs: Record<SolutionVertical, VerticalConfig> = {
  'ci-solar-storage': {
    slug: 'ci-solar-storage',
    label: 'C&I Solar & Storage',
    accent: '#E3C58D',
    accentText: '#6b4e10',
    heroTitle: 'Cut your Eskom bill by up to 80% with <em>bespoke solar & storage</em>',
    heroSub: 'Turnkey C&I solar and BESS systems designed for South African businesses. CapEx or PPA financing, 25-year warranty.',
    stats: [
      { value: '12.7%', label: '2025 tariff hike' },
      { value: 'R600k', label: 'Cost per Stage 6 event' },
      { value: '4–7 yr', label: 'Typical payback' },
      { value: '25 yr', label: 'Panel warranty' },
    ],
    pain: {
      eyebrow: 'Calculate your exposure',
      headline: 'What is grid dependence actually <em>costing you?</em>',
      body: 'Eskom tariffs have increased at 3× inflation since 2008. Drag to your monthly spend to see your 10-year cost trajectory.',
      pills: ['12.7% hike April 2025', 'R3.50/kWh', 'Doubles every 5.8 yrs', 'No ceiling'],
      calcTitle: 'Your Eskom cost trajectory',
      calcLabel: 'Monthly electricity bill',
      calcHighlightLabel: '5-yr potential saving',
      calcNote: 'Based on 12.7% annual escalation (NERSA 2025/26) and 48% average saving after solar/opex amortised.',
      calcFn: (bill) => ({
        left: Math.round(eskomCost(bill, 5)),
        highlight: Math.round(eskomCost(bill, 5) * 0.48),
        right: Math.round(eskomCost(bill, 10)),
      }),
    },
    solution: {
      h2: 'A complete solar solution — <em>from design to monitoring</em>',
      intro: 'Phoenix Energy delivers end-to-end C&I solar and battery systems — from feasibility through to commissioning and 24/7 monitoring.',
      tabs: [
        {
          label: 'Solar array',
          icon: '☀️',
          iconBg: 'rgba(227,197,141,0.15)',
          title: 'Tier 1 panels, engineered for your load profile',
          body: 'We specify and install Tier 1 panels (JA Solar, Canadian Solar, LONGi, Trina) sized precisely to your consumption data — maximising yield and minimising payback period.',
          bullets: ['Single-axis tracking available for large sites', 'Shading analysis included', 'Rooftop, carport or ground-mount', 'NRS097-2-1 compliant installation'],
          imageBg: 'linear-gradient(135deg, #E3C58D22, #39575C22)',
        },
        {
          label: 'Battery storage',
          icon: '🔋',
          iconBg: 'rgba(112,157,169,0.12)',
          title: 'LFP BESS — backup and peak-shaving in one',
          body: 'Lithium iron phosphate batteries keep your business running through load-shedding and shave costly peak-demand charges, accelerating ROI.',
          bullets: ['Pylontech, BYD, and CATL systems', '3,000+ cycle life (10+ years)', 'Integrated energy management system', 'Scalable from 10 kWh upwards'],
          imageBg: 'linear-gradient(135deg, #709DA922, #0d1f2222)',
        },
        {
          label: 'Monitoring & O&M',
          icon: '📊',
          iconBg: 'rgba(57,87,92,0.08)',
          title: '24/7 remote monitoring and proactive maintenance',
          body: 'Our cloud-based monitoring platform tracks performance in real time. Our O&M team responds to alerts before you know there is a problem.',
          bullets: ['Real-time generation and consumption dashboard', 'SMS + email fault alerts', 'Quarterly performance reports', 'Annual panel cleaning and inverter service'],
          imageBg: 'linear-gradient(135deg, #9CAF8822, #39575C22)',
        },
        {
          label: 'Tax benefits',
          icon: '📋',
          iconBg: 'rgba(156,175,136,0.12)',
          title: 'Section 12B — 125% first-year deduction',
          body: 'The Section 12B accelerated depreciation allowance lets qualifying businesses deduct 125% of the cost of renewable energy assets in year one.',
          bullets: ['125% deduction on qualifying solar assets', 'Reduces effective payback by 1–2 years', 'Applicable to both owned and financed systems', 'Phoenix Energy provides Section 12B documentation'],
          imageBg: 'linear-gradient(135deg, #E3C58D22, #9CAF8822)',
        },
      ],
      showFinancingTab: true,
    },
    howItWorks: {
      title: 'Your path to <em>energy independence</em>',
      steps: [
        { label: 'Free assessment', description: 'We visit your site and model three solution scenarios at no cost, no obligation.', tag: 'No cost · No obligation' },
        { label: 'Custom proposal', description: 'Full ROI model, payback period, and financing options delivered in 5 business days.', tag: 'Delivered in 5 days' },
        { label: 'Installation', description: 'Certified install in 8–12 weeks with minimal disruption to your operations.', tag: '8–12 week commissioning' },
        { label: 'Live & monitored', description: '24/7 remote monitoring from day one, backed by our 25-year panel warranty.', tag: '25-yr warranty' },
      ],
    },
    projectsEyebrow: 'SOLAR & STORAGE PROJECTS',
    cta: {
      title: 'Ready to eliminate your Eskom dependency?',
      sub: 'Get a free solar feasibility assessment — delivered in 48 hours, no commitment required.',
    },
    seo: {
      title: 'Commercial Solar Panels & Battery Storage South Africa | Phoenix Energy',
      description: 'Bespoke C&I solar and BESS systems for South African businesses. Free assessment, 25-yr warranty, CapEx or PPA financing.',
    },
  },

  'wheeling': {
    slug: 'wheeling',
    label: 'Wheeling',
    accent: '#D97C76',
    accentText: '#ffffff',
    heroTitle: 'Buy cheap renewable energy directly via the national grid — <em>no solar on your roof</em>',
    heroSub: 'Energy wheeling PPAs let you purchase clean power from independent generators at 20–40% below Eskom TOU tariffs.',
    stats: [
      { value: '32%', label: 'Typical tariff saving' },
      { value: '5 MW', label: 'Min viable offtake' },
      { value: '90 days', label: 'Licensing timeline' },
      { value: 'R28M', label: 'Largest PPA signed' },
    ],
    pain: {
      eyebrow: 'Calculate your wheeling opportunity',
      headline: 'What is a 32% tariff saving worth to <em>your business?</em>',
      body: 'Drag to your monthly spend and see the annual saving a wheeling PPA can deliver — starting within 90 days of agreement.',
      pills: ['32% average reduction', '90-day licensing', 'NERSA 2025 framework', 'Min 5 MW'],
      calcTitle: 'Your annual wheeling saving',
      calcLabel: 'Monthly electricity bill',
      calcHighlightLabel: 'Annual wheeling saving',
      calcNote: 'Based on 32% average tariff reduction from a NERSA 2025-compliant wheeling agreement.',
      calcFn: (bill) => ({
        left: Math.round(bill * 12),
        highlight: Math.round(bill * 12 * 0.32),
        right: Math.round(bill * 12 * 0.32 * 10),
      }),
    },
    solution: {
      h2: 'A turnkey wheeling PPA — <em>from feasibility to first kWh</em>',
      intro: 'Phoenix Energy structures, licenses, and manages your wheeling agreement from end to end.',
      tabs: [
        {
          label: 'PPA structuring',
          icon: '📄',
          iconBg: 'rgba(217,124,118,0.12)',
          title: 'Bankable, NERSA-compliant wheeling agreements',
          body: 'We negotiate and structure your PPA with an independent power producer, ensuring tariff certainty for 10–15 years.',
          bullets: ['Fixed or escalating tariff options', '10–15 year agreement terms', 'Standard Bank-financed IPP generators', 'Force majeure and termination protections'],
          imageBg: 'linear-gradient(135deg, #D97C7622, #39575C22)',
        },
        {
          label: 'Grid connection',
          icon: '🔌',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'NERSA licensing and network access agreement',
          body: 'We manage the complete licensing process — from NERSA registration to Eskom/municipality network access agreements.',
          bullets: ['NERSA generation and trading licence', 'Eskom NAA application and approval', 'Wheeling charge negotiation', 'Compliance documentation'],
          imageBg: 'linear-gradient(135deg, #39575C22, #709DA922)',
        },
        {
          label: 'Ongoing management',
          icon: '⚙️',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'Monthly reconciliation and dispute resolution',
          body: 'Phoenix Energy handles all monthly metering reconciliation, invoice verification, and Eskom dispute resolution on your behalf.',
          bullets: ['Monthly production vs consumption reconciliation', 'Eskom invoice verification', 'Dispute resolution management', 'Annual tariff review and optimisation'],
          imageBg: 'linear-gradient(135deg, #D97C7622, #9CAF8822)',
        },
      ],
      showFinancingTab: true,
    },
    howItWorks: {
      title: 'From feasibility to <em>first kWh wheeled</em>',
      steps: [
        { label: 'Feasibility review', description: 'We assess your load profile and confirm wheeling viability at no cost.', tag: 'Free feasibility' },
        { label: 'PPA structuring', description: 'We negotiate your agreement with a licensed IPP and present it to you within 5 business days.', tag: '5 business days' },
        { label: 'Grid connection', description: 'We manage the full NERSA licensing and network access agreement process.', tag: '90-day process' },
        { label: 'First kWh wheeled', description: 'Your business starts saving from the moment the first electron flows.', tag: 'Savings live' },
      ],
    },
    projectsEyebrow: 'WHEELING PROJECTS',
    cta: {
      title: 'Find out if wheeling works for your business',
      sub: 'Free feasibility assessment — we\'ll confirm viability and indicative savings within 5 days.',
    },
    seo: {
      title: 'Energy Wheeling & PPA South Africa | Phoenix Energy',
      description: 'Purchase clean energy via the national grid at 20–40% below Eskom TOU tariffs. NERSA 2025 compliant wheeling agreements.',
    },
  },

  'energy-optimisation': {
    slug: 'energy-optimisation',
    label: 'Energy Optimisation',
    accent: '#709DA9',
    accentText: '#ffffff',
    heroTitle: 'Eliminate the 28% of energy your business wastes — <em>with zero capital outlay</em>',
    heroSub: 'Free commercial energy audit. Identify and eliminate waste, restructure tariffs, and verify savings.',
    stats: [
      { value: '28%', label: 'Avg C&I energy waste' },
      { value: 'R0', label: 'Cost of an audit' },
      { value: '3 mo', label: 'Typical payback' },
      { value: 'R12M', label: 'Savings to date' },
    ],
    pain: {
      eyebrow: 'Identify your savings potential',
      headline: 'How much is energy waste <em>costing your business?</em>',
      body: '28% of energy in commercial facilities is wasted with no impact on productivity. Drag to see your monthly waste.',
      pills: ['28% avg waste', 'R0 audit cost', '3-month payback', 'Carbon Trust benchmark'],
      calcTitle: 'Your energy waste estimate',
      calcLabel: 'Monthly electricity bill',
      calcHighlightLabel: 'Est. monthly energy waste',
      calcNote: 'Based on 28% average waste benchmark from Carbon Trust commercial energy studies.',
      calcFn: (bill) => ({
        left: Math.round(bill * 12),
        highlight: Math.round(bill * 0.28),
        right: Math.round(bill * 0.28 * 12),
      }),
    },
    solution: {
      h2: 'End-to-end optimisation — <em>audit to verified savings</em>',
      intro: 'Phoenix Energy identifies, implements, and verifies energy savings across your entire facility portfolio.',
      tabs: [
        {
          label: 'Energy audit',
          icon: '🔍',
          iconBg: 'rgba(112,157,169,0.12)',
          title: 'Free ISO 50001-aligned commercial energy audit',
          body: 'Our certified energy auditors analyse your consumption data, on-site equipment, and tariff structure to identify all saving opportunities.',
          bullets: ['12-month consumption data analysis', 'On-site walkthrough and equipment inventory', 'Tariff benchmarking vs market rates', 'Prioritised saving opportunity register'],
          imageBg: 'linear-gradient(135deg, #709DA922, #39575C22)',
        },
        {
          label: 'Tariff restructuring',
          icon: '💰',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'Tariff optimisation and demand charge reduction',
          body: 'Many businesses are on the wrong Eskom tariff schedule. Switching tariffs and managing demand peaks can save 10–20% with no capital required.',
          bullets: ['TOU tariff schedule optimisation', 'Maximum demand reduction strategies', 'Power factor correction', 'Municipal tariff negotiation'],
          imageBg: 'linear-gradient(135deg, #9CAF8822, #709DA922)',
        },
        {
          label: 'Demand management',
          icon: '📈',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'Automated demand management and SCADA',
          body: 'Our cloud-based demand management platform automatically sheds non-critical loads during peak periods, reducing your maximum demand charges.',
          bullets: ['Real-time demand monitoring across all meters', 'Automated load shedding protocols', 'Integration with existing BMS/SCADA', 'Monthly savings verification reports'],
          imageBg: 'linear-gradient(135deg, #709DA922, #E3C58D22)',
        },
      ],
      showFinancingTab: true,
    },
    howItWorks: {
      title: 'From audit to <em>verified savings</em>',
      steps: [
        { label: 'Energy audit', description: 'Our certified auditors analyse your facility at no cost and identify all saving opportunities.', tag: 'Free audit' },
        { label: 'Recommendations', description: 'A prioritised saving roadmap with ROI calculations delivered in 3 business days.', tag: 'Delivered in 3 days' },
        { label: 'Implementation', description: 'We implement approved measures with zero disruption to your operations.', tag: 'Zero disruption' },
        { label: 'Savings verified', description: 'Monthly reports prove the savings and identify further optimisation opportunities.', tag: 'Proven & reported' },
      ],
    },
    projectsEyebrow: 'OPTIMISATION PROJECTS',
    cta: {
      title: 'Find out where your business is losing money on energy',
      sub: 'Book a free energy audit — we identify the savings, you keep them.',
    },
    seo: {
      title: 'Energy Optimisation & Audit South Africa | Phoenix Energy',
      description: 'Free commercial energy audit. Identify and eliminate the 28% average energy waste in your facility — typical payback under 3 months.',
    },
  },

  'carbon-credits': {
    slug: 'carbon-credits',
    label: 'Carbon Credits',
    accent: '#9CAF88',
    accentText: '#2a4a18',
    heroTitle: 'Turn your solar assets into a <em>Gold Standard revenue stream</em>',
    heroSub: 'Earn R6–10M per MW per year from verified carbon credits on your renewable energy projects. Zero upfront cost, fully managed.',
    stats: [
      { value: 'R8M', label: 'Avg revenue per MW/yr' },
      { value: 'Gold', label: 'Standard certified' },
      { value: 'R0', label: 'Enrolment cost' },
      { value: '100%', label: 'Phoenix manages all' },
    ],
    pain: {
      eyebrow: 'Calculate your carbon revenue',
      headline: 'How much is your solar system <em>leaving on the table?</em>',
      body: 'Most SA businesses with solar assets are missing an entirely untapped revenue stream. Drag to see your estimate.',
      pills: ['R6–10M per MW/yr', 'Gold Standard', 'R0 enrolment', '100% managed'],
      calcTitle: 'Your annual carbon credit revenue',
      calcLabel: 'Monthly electricity bill (pre-solar proxy)',
      calcHighlightLabel: 'Est. annual credit revenue',
      calcNote: 'Indicative estimate. Actual revenue depends on verified system size, Gold Standard audit outcome, and carbon credit market price.',
      calcFn: (bill) => {
        const estKw = bill / 3500;
        const annualRevenue = Math.round(estKw * 1680 * 0.5 * 90 / 1000 * 8);
        return {
          left: Math.round(estKw * 1000),
          highlight: annualRevenue,
          right: annualRevenue * 5,
        };
      },
    },
    solution: {
      h2: 'Gold Standard registration — <em>fully managed by Phoenix Energy</em>',
      intro: 'We handle every step of the Gold Standard carbon credit process, from eligibility check through to quarterly credit payments.',
      tabs: [
        {
          label: 'Registration',
          icon: '📋',
          iconBg: 'rgba(156,175,136,0.12)',
          title: 'Gold Standard registration — zero upfront cost',
          body: 'Phoenix Energy covers all Gold Standard registration fees and project development costs. You pay nothing until credits are issued.',
          bullets: ['Free eligibility assessment', 'Gold Standard project development document', 'Third-party validation by accredited verifier', 'Phoenix Energy manages the full submission process'],
          imageBg: 'linear-gradient(135deg, #9CAF8822, #39575C22)',
        },
        {
          label: 'Monitoring & MRV',
          icon: '📡',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'Continuous monitoring, reporting and verification',
          body: 'Our MRV platform automatically collects generation data from your inverters and prepares the annual verification submission.',
          bullets: ['Automated meter data collection', 'Annual Gold Standard verification by accredited body', 'Additionality and baseline updates', 'Credits issued quarterly after verification'],
          imageBg: 'linear-gradient(135deg, #9CAF8822, #709DA922)',
        },
        {
          label: 'Credit trading',
          icon: '💹',
          iconBg: 'rgba(156,175,136,0.12)',
          title: 'We trade your credits at the best available price',
          body: 'Phoenix Energy has established relationships with corporate carbon buyers in South Africa and internationally. We handle all trading and remit 70% of revenue to you.',
          bullets: ['Access to premium corporate buyers', '70% revenue share to asset owner', 'Quarterly payment directly to your account', 'Annual price optimisation review'],
          imageBg: 'linear-gradient(135deg, #9CAF8822, #E3C58D22)',
        },
      ],
      showFinancingTab: true,
    },
    howItWorks: {
      title: 'From eligibility to <em>quarterly payments</em>',
      steps: [
        { label: 'Eligibility check', description: 'We assess your renewable energy assets and confirm Gold Standard eligibility at no cost.', tag: 'Free check' },
        { label: 'Registration', description: 'Phoenix Energy manages the full Gold Standard project development and submission process.', tag: '6–8 week process' },
        { label: 'Monitoring & MRV', description: 'Automated data collection and annual third-party verification keeps your credits current.', tag: 'Continuous' },
        { label: 'Credit issuance', description: 'Verified credits are issued quarterly and traded at the best available market price.', tag: 'Quarterly payments' },
      ],
    },
    projectsEyebrow: 'CARBON CREDIT PROJECTS',
    cta: {
      title: 'Start earning from your clean energy assets',
      sub: 'Find out how much your existing or planned solar system generates in annual carbon credit revenue.',
    },
    seo: {
      title: 'Solar Carbon Credits South Africa — Gold Standard | Phoenix Energy',
      description: 'Earn R6–10M per MW per year from verified carbon credits on your renewable energy assets. Zero upfront cost, fully managed.',
    },
  },

  'webuysolar': {
    slug: 'webuysolar',
    label: 'WeBuySolar',
    accent: '#C97A40',
    accentText: '#ffffff',
    heroTitle: 'Sell your solar system fast and fair — <em>formal offer in 5 days</em>',
    heroSub: 'Get an instant indicative buyback valuation and formal offer within 5 business days. South Africa\'s fastest solar asset buyback service.',
    stats: [
      { value: '2 min', label: 'Online valuation' },
      { value: '5 days', label: 'Formal offer' },
      { value: '42', label: 'Systems acquired' },
      { value: 'R0', label: 'Cost to get valued' },
    ],
    pain: {
      eyebrow: 'What is your system worth?',
      headline: 'Get an instant indicative <em>buyback estimate.</em>',
      body: 'Drag to your approximate bill before solar was installed. We use this to estimate your system size and indicative value.',
      pills: ['5-day turnaround', '42 systems acquired', 'DCF-based model', 'R0 to value'],
      calcTitle: 'Your indicative buyback estimate',
      calcLabel: 'Monthly bill before solar (proxy for system size)',
      calcHighlightLabel: 'Indicative buyback value',
      calcNote: 'Indicative only. A formal offer requires on-site verification of system condition, production data, and compliance documentation.',
      calcFn: (bill) => {
        const estKw = bill / 3500;
        const indicative = Math.round(estKw * 1680 * 20000 * 0.4 / 12);
        return {
          left: Math.round(estKw * 10) / 10,
          highlight: indicative,
          right: Math.round(indicative * 1.12),
        };
      },
    },
    solution: {
      h2: 'A transparent, fast-moving buyback process — <em>no obligation</em>',
      intro: 'WeBuySolar uses a rigorous DCF + depreciated cost + market comparables model to give you a fair, bankable offer.',
      tabs: [
        {
          label: 'Online valuation',
          icon: '💻',
          iconBg: 'rgba(201,122,64,0.12)',
          title: 'Instant indicative valuation — 2 minutes',
          body: 'Our online tool calculates an indicative buyback range based on your system size, age, panel tier, and inverter type. No site visit needed to start.',
          bullets: ['DCF-based displaced tariff savings model', 'Depreciated replacement cost methodology', 'WeBuySolar transaction comparables', 'BESS valued independently'],
          imageBg: 'linear-gradient(135deg, #C97A4022, #39575C22)',
        },
        {
          label: 'Site verification',
          icon: '🔍',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'Free on-site verification — no obligation',
          body: 'Our technical team visits your site to verify the system condition, review production data, and confirm compliance documentation.',
          bullets: ['Inverter data download and analysis', 'Panel visual inspection', 'COC and compliance document review', 'No charge, no obligation'],
          imageBg: 'linear-gradient(135deg, #C97A4022, #9CAF8822)',
        },
        {
          label: 'Formal offer',
          icon: '📄',
          iconBg: 'rgba(201,122,64,0.12)',
          title: 'Written formal offer — 5 business days',
          body: 'Following the site visit, we issue a formal written offer within 5 business days. The offer is valid for 30 days.',
          bullets: ['Fixed offer price — no last-minute revisions', 'Full disclosure of valuation methodology', 'Legal asset purchase agreement', '30-day validity period'],
          imageBg: 'linear-gradient(135deg, #E3C58D22, #C97A4022)',
        },
        {
          label: 'Payment & transfer',
          icon: '💰',
          iconBg: 'rgba(201,122,64,0.12)',
          title: 'Payment in the same week as transfer',
          body: 'Once you accept, we handle all legal transfer documentation. Payment is made in the same week as the asset transfer.',
          bullets: ['Full legal asset purchase agreement', 'Phoenix Energy covers transfer costs', 'EFT payment on transfer day', 'Decommissioning and removal included'],
          imageBg: 'linear-gradient(135deg, #C97A4022, #E3C58D22)',
        },
      ],
      showFinancingTab: false,
    },
    howItWorks: {
      title: 'From valuation to <em>payment in days</em>',
      steps: [
        { label: 'Online valuation', description: 'Use our free tool for an instant indicative buyback range in under 2 minutes.', tag: '2 minutes' },
        { label: 'Site verification', description: 'Our technical team visits your site to verify the system at no cost and no obligation.', tag: 'Free · no obligation' },
        { label: 'Formal offer', description: 'A written offer with full methodology disclosure delivered within 5 business days.', tag: '5 business days' },
        { label: 'Payment', description: 'EFT payment in the same week as the legal asset transfer. Phoenix Energy covers all transfer costs.', tag: 'Same week' },
      ],
    },
    projectsEyebrow: 'WEBUYSOLAR ACQUISITIONS',
    cta: {
      title: 'Get your solar system valuation now',
      sub: 'Use our free tool for an instant indicative buyback range — no site visit needed to start.',
    },
    seo: {
      title: 'Sell Your Solar System — WeBuySolar | Phoenix Energy',
      description: 'Get an instant indicative buyback valuation and formal offer within 5 business days. South Africa\'s fastest solar asset buyback service.',
    },
  },

  'ev-fleets': {
    slug: 'ev-fleets',
    label: 'EV Fleets & Infrastructure',
    accent: '#A9D6CB',
    accentText: '#1a5a48',
    heroTitle: 'Cut your fleet running costs by 40–60% with <em>end-to-end electrification</em>',
    heroSub: 'Fleet depot assessment, charging infrastructure design, vehicle procurement, and R0 CapEx OpEx model.',
    stats: [
      { value: '87%', label: 'Diesel increase since 2019' },
      { value: '60%', label: 'Fleet cost reduction' },
      { value: 'R0', label: 'CapEx under OpEx model' },
      { value: '40+', label: 'Trucks commissioned' },
    ],
    pain: {
      eyebrow: 'Calculate your fleet savings',
      headline: 'What is diesel dependency <em>costing your fleet?</em>',
      body: 'SA diesel has increased 87% since 2019. Drag to your monthly fuel spend to see the savings from electrification.',
      pills: ['87% diesel increase', '50% avg saving', 'R0 OpEx model', '40+ trucks live'],
      calcTitle: 'Your fleet electrification savings',
      calcLabel: 'Monthly fleet fuel spend',
      calcHighlightLabel: 'Est. 5-yr fuel saving',
      calcNote: 'Based on 50% average running cost reduction for comparable EV fleet deployments in Southern Africa.',
      calcFn: (bill) => ({
        left: Math.round(bill * 12),
        highlight: Math.round(bill * 12 * 5 * 0.5),
        right: Math.round(bill * 12 * 10 * 0.5),
      }),
    },
    solution: {
      h2: 'End-to-end fleet electrification — <em>from depot to road</em>',
      intro: 'Phoenix Energy manages the complete fleet electrification journey — infrastructure, vehicles, and ongoing fleet management.',
      tabs: [
        {
          label: 'Charging infrastructure',
          icon: '⚡',
          iconBg: 'rgba(169,214,203,0.15)',
          title: 'Depot and en-route charging — designed for your routes',
          body: 'We design and install the complete charging infrastructure at your depot, integrated with renewable energy where available.',
          bullets: ['Load flow analysis and grid upgrade management', 'AC and DC fast-charging hardware', 'Smart charging management software', 'Solar + BESS integration option'],
          imageBg: 'linear-gradient(135deg, #A9D6CB22, #39575C22)',
        },
        {
          label: 'Vehicle procurement',
          icon: '🚛',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'EV fleet specification and procurement',
          body: 'We specify and procure the right EV models for your route profiles — from last-mile delivery vans to heavy-duty long-haul trucks.',
          bullets: ['Route and payload analysis', 'OEM selection and negotiation', 'Total cost of ownership modelling', 'Driver training programme'],
          imageBg: 'linear-gradient(135deg, #A9D6CB22, #9CAF8822)',
        },
        {
          label: 'Fleet management',
          icon: '📡',
          iconBg: 'rgba(57,87,92,0.08)',
          title: 'Telematics, charging management and reporting',
          body: 'Our fleet management platform tracks all vehicles and chargers in real time, optimises charging schedules, and produces monthly savings reports.',
          bullets: ['Real-time vehicle and charger monitoring', 'Automated charging schedule optimisation', 'Driver behaviour analytics', 'Monthly carbon reduction reporting'],
          imageBg: 'linear-gradient(135deg, #709DA922, #A9D6CB22)',
        },
      ],
      showFinancingTab: true,
    },
    howItWorks: {
      title: 'From depot to <em>fleet live</em>',
      steps: [
        { label: 'Depot assessment', description: 'Free depot and route analysis to confirm EV viability and infrastructure requirements.', tag: 'Free assessment' },
        { label: 'Infrastructure design', description: 'Charging infrastructure design, load flow analysis, and ROI model in 5 business days.', tag: '5 business days' },
        { label: 'Installation', description: 'Grid upgrade, charging hardware, and vehicle delivery in 6–10 weeks.', tag: '6–10 weeks' },
        { label: 'Fleet live', description: 'All vehicles and chargers monitored in real time. Savings verified from day one.', tag: 'Savings from day one' },
      ],
    },
    projectsEyebrow: 'EV FLEET PROJECTS',
    cta: {
      title: 'Ready to electrify your fleet?',
      sub: 'Free fleet electrification feasibility study — ROI model, infrastructure design, and financing options in 5 days.',
    },
    seo: {
      title: 'EV Fleet Electrification South Africa | Phoenix Energy',
      description: 'Reduce fleet running costs by 40–60%. End-to-end EV charging infrastructure, vehicle procurement, and R0 OpEx model.',
    },
  },
};
