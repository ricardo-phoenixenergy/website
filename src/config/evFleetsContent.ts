// src/config/evFleetsContent.ts
import type { ExplainerCardItem } from '@/components/sections/ExplainerCards';
import type { FaqItem } from '@/components/sections/FaqAccordion';
import type { FinancingOption } from '@/components/sections/FinancingCards';
import type { IconName } from '@/components/sections/SolutionTabs';

interface IndustryTab {
  key: string;
  label: string;
  icon: IconName;
  title: string;
  body: string;
  bullets: string[];
  proof?: { client: string; stat: string; detail: string; image?: string; imageAlt?: string; imagePosition?: string; kicker?: string };
}

export const EV_FLEETS: {
  hero: { title: string; subtitle: string };
  whyNow: { eyebrow: string; heading: string; subtitle: string; cards: ExplainerCardItem[] };
  pillars: { eyebrow: string; heading: string; cards: ExplainerCardItem[] };
  financing: { eyebrow: string; heading: string; options: FinancingOption[]; note: string };
  industries: {
    eyebrow: string; heading: string; subtitle: string; tabs: IndustryTab[];
  };
  faq: { heading: string; items: FaqItem[] };
  cta: { eyebrow: string; heading: string; body: string };
} = {
  hero: {
    title: 'The complete <em>fleet electrification</em> solution.',
    subtitle:
      'From electric vehicles and charging infrastructure to on-site solar, battery storage and financing, we deliver everything you need to transition your fleet—reducing operating costs while simplifying the move to electric.',
  },

  whyNow: {
    eyebrow: 'Why now',
    heading: 'The economics of running a diesel fleet have <em>fundamentally changed</em>.',
    subtitle:
      'Electric vehicles paired with on-site solar and battery storage replace volatile fuel costs with low-cost, self-generated energy. As diesel prices and carbon taxes continue to rise, businesses can now significantly reduce the cost of every kilometre while improving energy security and cutting emissions.',
    cards: [
      { icon: 'TrendingUp', title: 'Diesel costs keep increasing', body: 'Diesel prices remain volatile, making fleet operating costs difficult to forecast. Carbon levies and the increasing national carbon tax continue to add further pressure, making every litre more expensive over time.' },
      { icon: 'Zap', title: 'Generate your own fuel', body: 'Charge your fleet using electricity generated from your own solar system and battery storage instead of buying diesel. By producing the energy that powers your vehicles, you lock in a lower and more predictable cost per kilometre while reducing exposure to fuel price volatility.' },
      { icon: 'Award', title: 'Proven by South African fleets', body: 'The business case is no longer theoretical. Across millions of kilometres driven, leading South African fleets have demonstrated lower operating costs while maintaining the performance and reliability required for commercial operations.' },
    ],
  },

  pillars: {
    eyebrow: 'One integrated solution',
    heading: 'Everything you need to electrify your fleet—<em>from one partner</em>.',
    cards: [
      { icon: 'Truck', title: 'Electric Vehicles', body: 'We source and supply the right electric vehicles for your operation—from vans and bakkies to urban trucks, minibuses and buses—matched to your routes, payloads and operational requirements.' },
      { icon: 'Zap', title: 'Charging Infrastructure', body: 'We design and install AC and DC charging infrastructure strategically across your depots, facilities, and operational routes. Intelligent load management optimises charging schedules, minimises demand peaks, and reduces charging costs.' },
      { icon: 'Sun', title: 'Renewable Energy', body: 'Power your fleet with renewable electricity from on-site solar, battery storage, off-site wheeling—or the optimal combination of all three. We design the right energy strategy to minimise your cost per kilometre while improving energy security and reducing emissions.' },
      { icon: 'DollarSign', title: 'Financing', body: 'We finance your entire fleet electrification project—from vehicles and charging infrastructure to renewable energy systems. Choose between flexible subscriptions or financed ownership, with little to no upfront capital.' },
    ],
  },

  financing: {
    eyebrow: 'Fleet-as-a-Service',
    heading: 'Go electric with <em>zero upfront capital</em>.',
    options: [
      {
        icon: 'agreement',
        title: 'Fleet-as-a-Service',
        tag: 'Subscription',
        subtitle: 'Electrify your fleet with little to no upfront capital.',
        description: 'Transition to electric through a fully managed subscription. We provide the vehicles, charging infrastructure and renewable energy solution as one integrated service, with flexible monthly or per-kilometre pricing that grows with your business.',
        benefits: ['Little to no upfront capital investment', 'Fixed monthly or per-kilometre pricing', 'Maintenance, insurance and charging included', 'Fully managed and optimised throughout the contract'],
      },
      {
        icon: 'purchase',
        title: 'Outright Purchase',
        tag: 'Ownership',
        subtitle: 'Own your fleet. Capture the full lifetime returns.',
        description: 'Purchase your electric vehicles, charging infrastructure and renewable energy system outright—or finance the investment through our lending partners. You own the assets from day one while maximising long-term savings and tax benefits.',
        benefits: ['Full ownership of all fleet and energy assets', 'Vehicles, charging and renewable energy in one solution', 'Eligible solar assets qualify for the Section 12B first-year tax deduction', 'Maximum lifetime savings and return on investment'],
      },
    ],
    note: 'All financing is subject to credit approval. Section 12B and tax treatment should be confirmed with your tax advisor.',
  },

  industries: {
    eyebrow: 'Built for your operation',
    heading: 'The best fleets for electrification already follow <em>predictable schedules</em>.',
    subtitle:
      'If your vehicles return to the same depot each day, they can charge from dedicated infrastructure and renewable energy—delivering the lowest cost per kilometre and the fastest return on investment.',
    tabs: [
      {
        key: 'industry-last-mile',
        label: 'Last-Mile Delivery',
        icon: 'Truck',
        title: 'Last-Mile & E-commerce Delivery',
        body: 'Urban delivery fleets are one of the strongest commercial cases for electrification. Predictable daily routes, frequent stop-start driving, and overnight depot parking allow vehicles to recharge during off-hours using dedicated charging infrastructure and renewable energy. Combined with high annual mileage, these operating characteristics maximise fuel savings and deliver a lower cost per kilometre.',
        bullets: ['Predictable urban routes typically under 200–250 km per day', 'Vehicles that return to a depot or distribution centre each night', 'High stop-start utilisation where regenerative braking improves efficiency', 'High annual mileage where fuel and maintenance savings compound quickly'],
        proof: { client: 'Woolworths & DSV', stat: '41 Electric Delivery Vans', detail: 'Electric delivery vans operating from solar-powered depots, avoiding approximately 400 tonnes of tailpipe CO₂ emissions each year while demonstrating the commercial viability of fleet electrification in South Africa.', image: '/proof/woolworths-dsv.webp', imageAlt: 'Woolworths and DSV electric delivery vans' },
      },
      {
        key: 'industry-cold-chain',
        label: 'Cold Chain',
        icon: 'Thermometer',
        title: 'Cold Chain & Refrigerated Distribution',
        body: 'Cold-chain fleets are ideally suited to electrification because both the vehicle and refrigeration system can be powered by electricity rather than diesel. Combined with predictable delivery schedules and return-to-depot charging, businesses can significantly reduce fuel consumption while maintaining strict temperature control.',
        bullets: ['Predictable local and regional delivery routes', 'Vehicles return to base for overnight charging', 'Electric refrigeration reduces diesel consumption and emissions', 'Reliable temperature control with lower operating costs'],
        proof: { client: 'Clicks & UPD', stat: '42 Refrigerated Electric Vans', detail: 'South Africa’s first solar-supported refrigerated electric fleet, demonstrating that temperature-controlled logistics can reduce emissions and operating costs without compromising cold-chain performance.', image: '/proof/clicks-upd.jpg', imageAlt: 'Clicks & UPD refrigerated electric van' },
      },
      {
        key: 'industry-fmcg',
        label: 'FMCG Distribution',
        icon: 'Layers',
        title: 'FMCG & Retail Distribution',
        body: 'FMCG distribution networks combine high daily vehicle utilisation with predictable depot-to-store routes, making them an excellent fit for fleet electrification. Large distribution centres provide ideal locations for charging infrastructure and renewable energy, helping businesses reduce transport costs while improving supply chain sustainability.',
        bullets: ['Scheduled depot-to-store distribution routes', 'Vehicles returning to distribution centres between shifts', 'High annual mileage where operating cost savings compound', 'Large depots with space for charging infrastructure and renewable energy'],
        proof: { client: 'DHL & Unilever', stat: 'Africa’s First Electric Superlink', detail: 'A fully electric Volvo FMX superlink operating on live Unilever distribution routes, demonstrating the viability of heavy-duty electric transport for commercial FMCG logistics.', image: '/proof/dhl-unilever.jpg', imageAlt: 'DHL & Unilever electric Volvo FMX superlink truck', imagePosition: 'bottom' },
      },
      {
        key: 'industry-staff',
        label: 'Staff & Shuttle',
        icon: 'Users',
        title: 'Staff & shuttle transport',
        body: 'Fixed, timetabled routes that return to base between shifts are a textbook fit for overnight depot charging — predictable daily distance makes range easy to plan.',
        bullets: ['Fixed timetabled routes', 'Returns to base between shifts', 'Overnight depot charging'],
        proof: { client: 'eKamva', kicker: 'Made in South Africa', stat: 'SA’s first electric minibus taxi', detail: 'A locally built 15-seater electric minibus taxi with a 200 km range and 40–70% lower running costs — developed by a GoMetro-led South African consortium.', image: '/proof/ekamva.jpeg', imageAlt: 'eKamva electric minibus taxi' },
      },
      {
        key: 'industry-municipal',
        label: 'Municipal & Public',
        icon: 'Building',
        title: 'Municipal & public transport',
        body: 'Scheduled urban routes, defined daily range and mandatory overnight depot returns make public and municipal fleets a strong fit — already live on South African roads.',
        bullets: ['Defined urban routes and depots', 'Overnight + off-peak charging', 'Strong public ESG mandate'],
        proof: { client: 'Golden Arrow', stat: '120 electric buses', detail: 'Cape Town’s first electric public bus fleet, charged on solar and off-peak power.', image: '/proof/golden-arrow.webp', imageAlt: 'Golden Arrow electric public bus' },
      },
      {
        key: 'industry-logistics',
        label: 'Regional Logistics',
        icon: 'TrendingUp',
        title: 'Regional logistics',
        body: 'Depot-to-depot regional lanes with predictable distance and a return to base are viable for electric today — the sweet spot between short urban runs and true long-haul.',
        bullets: ['Depot-to-depot regional lanes', 'Predictable distance', 'Return-to-base charging'],
        proof: { client: 'Vector Logistics', stat: 'Electric Volvo FH trucks', detail: 'South Africa’s first bumper-to-bumper net-zero cold-chain trucks.', image: '/proof/vector-logistics.jpeg', imageAlt: 'Vector Logistics electric Volvo FH cold-chain truck' },
      },
    ],
  },

  faq: {
    heading: 'Fleet electrification, answered.',
    items: [
      { question: 'What if my vehicles don’t return to a depot each night?', answer: 'Depot charging is where electric fleets save the most, because you charge cheaply overnight from solar. If your routes don’t return to base, we’ll tell you honestly at the assessment whether electrification stacks up yet.' },
      { question: 'Is the range enough for our routes?', answer: 'Most last-mile and urban routes run 150–220 km a day, well within the range of the vehicles we supply. We match vehicle range to your actual duty cycles during the assessment.' },
      { question: 'What happens during load-shedding?', answer: 'Charging from on-site solar and battery storage keeps your fleet moving independently of the grid — one of the main reasons we bundle solar and BESS into the package.' },
      { question: 'Do we need capital to start?', answer: 'No. With Fleet-as-a-Service you pay a fixed monthly or per-kilometre fee with zero upfront capital. If you prefer to own the assets, we arrange financing to own them over the term.' },
      { question: 'How much cheaper is it really?', answer: 'Across 12.5 million kilometres of South African operation, electric fleets have run 23–27% cheaper than diesel. Your saving depends on distance, vehicle type and whether you charge from solar — our estimator gives an indicative figure and the assessment confirms it.' },
      { question: 'What about battery life and resale?', answer: 'Fleet EV batteries are warrantied for years of commercial use, and under Fleet-as-a-Service the battery and residual-value risk sits with us, not you.' },
    ],
  },

  cta: {
    eyebrow: 'Electrify your fleet',
    heading: 'See what electric could save your fleet',
    body: 'Book a free fleet assessment — we’ll analyse your routes and fuel spend and show you the vehicles, charging and financing that make the switch pay.',
  },
};
