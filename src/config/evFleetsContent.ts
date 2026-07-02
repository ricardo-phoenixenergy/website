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
  proof?: { client: string; stat: string; detail: string; image?: string; imageAlt?: string };
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
    title: 'Electrify your fleet — <em>fully financed, end to end</em>.',
    subtitle:
      'Phoenix supplies and funds the whole transition: electric vehicles, depot charging, and on-site solar and battery storage — as one managed package. Cut your fuel bill, fix your energy cost, and cut emissions, without the upfront capital.',
  },

  whyNow: {
    eyebrow: 'Why now',
    heading: 'The economics of running a diesel fleet have <em>turned</em>.',
    subtitle:
      'Fuel and carbon costs are rising and volatile — while electric fleets charged from your own solar lock in a lower, stable cost per kilometre. In South Africa, the case is now proven at scale.',
    cards: [
      { icon: 'TrendingUp', title: 'Diesel is volatile and only taxed more', body: 'Diesel sits around R24 a litre and spiked near R32 in 2026. A carbon fuel levy is added at the pump, and the underlying carbon tax rises from R308 a tonne in 2026 to R462 by 2030.' },
      { icon: 'Zap', title: 'Grid power keeps climbing', body: 'Eskom tariffs rise around 9% a year. Charging from on-site solar and battery storage fixes your energy cost and insulates the fleet from tariff hikes and grid risk.' },
      { icon: 'Award', title: 'The savings are proven here', body: 'Across 12.5 million real South African kilometres, electric fleets run 23–27% cheaper than diesel — at Woolworths, DSV, Clicks and Takealot — with full operational availability.' },
    ],
  },

  pillars: {
    eyebrow: 'One managed package',
    heading: 'Everything your fleet needs to go electric — <em>from one partner</em>.',
    cards: [
      { icon: 'Truck', title: 'Electric vehicles', body: 'We source and supply the right electric vehicles for your duty cycle — vans, bakkies, urban trucks, minibuses and buses available in South Africa.' },
      { icon: 'Zap', title: 'Depot charging', body: 'SANS-certified AC and DC charging, designed around your routes and depots, with smart load management to avoid demand spikes.' },
      { icon: 'Sun', title: 'Solar + battery storage', body: 'Charge from on-site solar and BESS for the lowest, most stable cost per kilometre — and real emissions cuts the grid alone can’t deliver.' },
      { icon: 'DollarSign', title: 'Financing', body: 'We fund the whole transition, so you can go electric without the upfront capital. Subscription or financed-to-own — your choice.' },
    ],
  },

  financing: {
    eyebrow: 'Fleet-as-a-Service',
    heading: 'Go electric with <em>zero upfront capital</em>.',
    options: [
      {
        icon: 'agreement',
        title: 'Fleet-as-a-Service',
        tag: 'Zero capital',
        description: 'Phoenix owns and operates the vehicles, chargers and solar. You pay a fixed monthly fee — or a rate per kilometre — with maintenance, insurance and charging included. Scale the fleet up or down as you grow.',
        benefits: ['R0 upfront capital.', 'Fixed monthly or per-km pricing.', 'Maintenance, insurance & charging included.', 'Fully managed — we run and optimise it.'],
      },
      {
        icon: 'purchase',
        title: 'Outright Purchase',
        tag: 'Own the assets',
        description: 'Buy the vehicles, charging and solar outright — with financing arranged if you need it — so the fleet and infrastructure sit on your balance sheet from day one. The on-site solar qualifies for the Section 12B 100% first-year tax deduction.',
        benefits: ['Assets on your balance sheet.', 'Vehicles + charging + solar in one purchase.', 'Section 12B 100% solar deduction.', 'Own it outright — no ongoing fee.'],
      },
    ],
    note: 'All financing is subject to credit approval. Section 12B and tax treatment should be confirmed with your tax advisor.',
  },

  industries: {
    eyebrow: 'Built for your operation',
    heading: 'Electrification pays off first for <em>return-to-depot fleets</em>.',
    subtitle:
      'If your vehicles run predictable routes and come home to a depot each night, they can charge cheaply from solar and deliver the strongest savings.',
    tabs: [
      {
        key: 'industry-last-mile',
        label: 'Last-mile delivery',
        icon: 'Truck',
        title: 'Last-mile & e-commerce delivery',
        body: 'Dense urban routes, constant stop-start running and a nightly return to the depot make last-mile the best-proven fit in South Africa — vehicles charge cheaply overnight from solar and cover high daily kilometres where the fuel saving is largest.',
        bullets: ['Fixed urban routes under ~220 km/day', 'Returns to the depot every night', 'Stop-start running where EVs beat diesel'],
        proof: { client: 'Woolworths + DSV', stat: '41 electric vans', detail: '~400,000 kg of tailpipe CO₂ avoided a year, charged from depot solar.', image: '/proof/woolworths-dsv.webp', imageAlt: 'Woolworths and DSV electric delivery vans' },
      },
      {
        key: 'industry-cold-chain',
        label: 'Cold chain',
        icon: 'Thermometer',
        title: 'Cold-chain & refrigerated distribution',
        body: 'Local, return-to-base distribution where the refrigeration itself can run off solar and battery — removing a second diesel burn. Predictable, temperature-critical routes reward reliable electric running.',
        bullets: ['Local return-to-base distribution', 'Solar-powered refrigeration', 'Predictable, temperature-critical routes'],
        proof: { client: 'Clicks / UPD', stat: '42 solar-refrigerated vans', detail: 'South Africa’s first solar-powered refrigerated EV fleet — about a tonne of CO₂ saved per van each month.', image: '/proof/clicks-upd.jpg', imageAlt: 'Clicks / UPD solar-refrigerated electric van' },
      },
      {
        key: 'industry-fmcg',
        label: 'FMCG distribution',
        icon: 'Layers',
        title: 'FMCG & retail distribution',
        body: 'High-volume, scheduled distribution from distribution centres to stores on fixed routes, with large solar-ready depots — a strong fit for heavier electric trucks on regional loops.',
        bullets: ['Scheduled depot-to-store loops', 'Large, solar-ready distribution centres', 'High daily kilometres'],
        proof: { client: 'DHL + Unilever', stat: 'Africa’s first electric superlink', detail: 'A fully electric Volvo FMX tractor running live Unilever distribution routes.', image: '/proof/dhl-unilever.jpg', imageAlt: 'DHL and Unilever electric Volvo FMX superlink truck' },
      },
      {
        key: 'industry-staff',
        label: 'Staff & shuttle',
        icon: 'Users',
        title: 'Staff & shuttle transport',
        body: 'Fixed, timetabled routes that return to base between shifts are a textbook fit for overnight depot charging — predictable daily distance makes range easy to plan.',
        bullets: ['Fixed timetabled routes', 'Returns to base between shifts', 'Overnight depot charging'],
      },
      {
        key: 'industry-municipal',
        label: 'Municipal & public',
        icon: 'Building',
        title: 'Municipal & public transport',
        body: 'Scheduled urban routes, defined daily range and mandatory overnight depot returns make public and municipal fleets a strong fit — already live on South African roads.',
        bullets: ['Defined urban routes and depots', 'Overnight + off-peak charging', 'Strong public ESG mandate'],
        proof: { client: 'Golden Arrow', stat: '120 electric buses', detail: 'Cape Town’s first electric public bus fleet, charged on solar and off-peak power.', image: '/proof/golden-arrow.webp', imageAlt: 'Golden Arrow electric public bus' },
      },
      {
        key: 'industry-logistics',
        label: 'Regional logistics',
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
