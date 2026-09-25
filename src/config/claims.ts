// src/config/claims.ts
// The claims register: every performance figure, price, standard and promise the
// site states in code, in one place. Pages read the figure from here, so when the
// business confirms or corrects one it is a single edit.
//
// Nothing here is confirmed yet. Each entry keeps the value the site showed when
// the register was built (September 2026) and records what the figure seems to
// mean, what it rests on and every place it appears. Wording that restates a
// claim in its own words ("zero upfront") is listed under usedOn; change it with
// the entry.
//
// Three figures are owned by the module that computes or promises them, and
// read here so the two can't drift: the reply window (src/config/contact.ts),
// the WeBuySolar audit report time (src/config/webuysolarOffer.ts) and the
// carbon credit price band (src/lib/carbon/estimate.ts). Those are also the
// client-side modules, which keeps this register out of browser bundles.
//
// Company stats (home, About) live in the Sanity "Company Stats" document and
// case study figures on each Sanity project. docs/content/claims-register.md
// covers all three, with the conflicts between them and the evidence needed.
import { REPLY_PROMISE } from '@/config/contact';
import { AUDIT_REPORT_TIME } from '@/config/webuysolarOffer';
import { CREDIT_PRICE_HIGH, CREDIT_PRICE_LOW } from '@/lib/carbon/estimate';

export type ClaimStatus = 'confirmed' | 'unconfirmed';

export interface ClaimRecord {
  /** The figure as the site shows it, e.g. "60%" or "within 1 business day". */
  value: string;
  /** The label shown with it. */
  label: string;
  /** What the figure measures, as the site's wording implies. */
  definition: string;
  /** How it was worked out. */
  basis: string;
  /** Where the evidence is. */
  source: string;
  /** When the figure was true (YYYY-MM-DD), or null when not recorded. */
  asOf: string | null;
  status: ClaimStatus;
  /** Every surface that states it. */
  usedOn: readonly string[];
  /** A conflict with another claim, or an open question. */
  note?: string;
}

const NOT_RECORDED = 'Not recorded.';

/** WeBuySolar's illustration of silent underperformance, as percentages of potential output. */
export const UNDERPERFORMANCE_EXAMPLE = { actual: 78, potential: 92 } as const;

const REGISTER = {
  // ── C&I Solar & Storage ──────────────────────────────────────────────────────
  'ci-installations': {
    value: '250+',
    label: 'C&I Installations',
    definition: 'Number of commercial and industrial installations, as the label implies. Whose installations, and over what period, is not recorded.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (C&I Solar & Storage card stat)'],
    note: 'Conflicts with "40+ projects completed" (company stats, home and About) and with the two projects published. The audit recommends removing it unless it can be evidenced.',
  },
  'ci-bill-reduction': {
    value: '60%',
    label: 'Avg. Bill Reduction',
    definition: 'Reduction in a client’s electricity bill from C&I solar and storage. The card calls it an average; the page description calls it a maximum ("up to 60%").',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions (C&I Solar & Storage card stat, as an average)',
      '/solutions/ci-solar-storage (meta description, "up to 60%")',
      '/solutions (C&I Solar & Storage card text, "up to 60%")',
    ],
    note: 'An average and a maximum can’t both be 60%. The one published case study (31 Sacks Circle) projects a 41.8% bill reduction.',
  },
  'ci-ppa-upfront': {
    value: 'R0',
    label: 'Upfront with PPA',
    definition: 'What a client pays up front under the power purchase agreement (PPA) model.',
    basis: 'The PPA model: Phoenix funds, installs and maintains the system and the client buys its power.',
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      'VERTICAL_CONFIG stat (not rendered)',
      '/solutions/ci-solar-storage (meta description, "Zero upfront with our PPA model")',
      '/solutions/ci-solar-storage (hero, "zero upfront cost")',
    ],
  },
  'ci-system-lifespan': {
    value: '25yr',
    label: 'System Lifespan',
    definition: 'Expected life of a solar and storage system.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)'],
  },

  // ── Wheeling ─────────────────────────────────────────────────────────────────
  'wheeling-cost-saving': {
    value: '32%',
    label: 'Avg. Cost Saving',
    definition: 'Saving on electricity costs from a wheeling agreement. The card calls it an average; the page description calls it a maximum ("up to 32%").',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions (Wheeling card stat, as an average)',
      '/solutions/wheeling (meta description, "Save up to 32%")',
      '/solutions (Wheeling card text, "Save up to 32%")',
    ],
    note: 'Average on the card, maximum in the description.',
  },
  'wheeling-licensed-platforms': {
    value: '3',
    label: 'Licensed Platforms',
    definition: 'Number of licensed trading platforms Phoenix works with or holds. The site doesn’t say which, or what the licence is.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (Wheeling card stat)'],
    note: 'Not explained anywhere on the site. The audit recommends removing it unless it can be evidenced.',
  },
  'wheeling-infrastructure-cost': {
    value: 'R0',
    label: 'Infrastructure Cost',
    definition: 'What a client pays for infrastructure to start wheeling.',
    basis: 'Wheeled power arrives through the existing grid connection.',
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      'VERTICAL_CONFIG stat (not rendered)',
      '/solutions/wheeling (tabs, "No on-site infrastructure or upfront capital investment.")',
    ],
  },
  'wheeling-settlement': {
    value: 'T-day',
    label: 'Settlement',
    definition: 'When wheeling transactions settle. "T-day" isn’t explained on the site.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)'],
  },

  // ── Energy Optimisation ──────────────────────────────────────────────────────
  'eo-waste-identified': {
    value: '28%',
    label: 'Avg. Waste Identified',
    definition: 'Share of a facility’s energy use identified as waste in an energy audit, on average.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (Energy Optimisation card stat)'],
  },
  'eo-typical-roi': {
    value: '<12mo',
    label: 'Typical ROI',
    definition: 'Typical payback period of an efficiency upgrade: under 12 months. The label says ROI but the value is a period.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (Energy Optimisation card stat)'],
  },
  'eo-capital-outlay': {
    value: 'R0',
    label: 'Capital Outlay',
    definition: 'What a client pays up front on the energy efficiency asset lease.',
    basis: 'The lease is funded by fixed monthly payments.',
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      'VERTICAL_CONFIG stat (not rendered)',
      '/solutions/energy-optimisation (meta description and financing, "zero-capex efficiency lease")',
    ],
  },
  'eo-live-monitoring': {
    value: '24/7',
    label: 'Live Monitoring',
    definition: 'Monitoring runs around the clock.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)'],
  },

  // ── Carbon Credits ───────────────────────────────────────────────────────────
  'carbon-credit-price-floor': {
    value: 'R8+',
    label: 'Per Carbon Credit',
    definition: 'Price per carbon credit: at least R8.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (Carbon Credits card stat)'],
    note: 'Conflicts with the estimator’s R50 to R150 band on the Carbon Credits page (carbon-credit-price-band).',
  },
  'carbon-credit-price-band': {
    value: `R${CREDIT_PRICE_LOW} to R${CREDIT_PRICE_HIGH}`,
    label: 'Per credit (estimator price band)',
    definition: 'The price range per credit that the carbon revenue estimator multiplies by. Revenue is shown gross.',
    basis: 'An estimator assumption, set in src/lib/carbon/estimate.ts. The estimate also assumes about 1,600 kWh a year per kWp and a grid emissions factor of 0.95 tCO₂/MWh.',
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions/carbon-credits (estimator result and assumptions line)'],
    note: 'Conflicts with "R8+ per carbon credit" on /solutions.',
  },
  'carbon-standard': {
    value: 'Verra',
    label: 'Certified Standard',
    definition: 'The carbon standard the credits are certified under.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions (Carbon Credits card stat)',
      '/solutions/carbon-credits (meta description, "Verra-certified carbon credits")',
      '/solutions (Carbon Credits card text)',
    ],
    note: 'The Carbon Credits page itself names no standard ("recognised carbon standards"). Confirm that Verra accepts South African grid-connected solar before naming it.',
  },
  'carbon-payout-frequency': {
    value: 'Quarterly',
    label: 'Payouts',
    definition: 'How often credit revenue is paid out.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      'VERTICAL_CONFIG stat (not rendered)',
      '/solutions/carbon-credits (meta description, "Quarterly payouts")',
      '/solutions (Carbon Credits card text)',
    ],
    note: 'The FAQ says credits are "issued and sold on a scheduled basis", not quarterly.',
  },
  'carbon-registration-stat': {
    value: '90 days',
    label: 'To Registration',
    definition: 'Time from sign-up to project registration.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)'],
    note: 'The FAQ and How It Works say six to eight weeks (carbon-onboarding-time).',
  },
  'carbon-onboarding-time': {
    value: 'six to eight weeks',
    label: 'Onboarding and registration',
    definition: 'Time for onboarding and project registration, before monitoring and credit issuance start.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions/carbon-credits (FAQ, "How long before I receive my first payment?")',
      '/solutions/carbon-credits (How It Works tag, 6 to 8 week onboarding, in Sanity)',
    ],
    note: 'Conflicts with the unrendered "90 days To Registration" stat.',
  },

  // ── WeBuySolar ───────────────────────────────────────────────────────────────
  'webuysolar-free-audit': {
    value: 'Free',
    label: 'Expert audit',
    definition: 'The on-site audit that starts the WeBuySolar process costs the owner nothing.',
    basis: 'The WeBuySolar offer (src/config/webuysolarOffer.ts, step 1).',
    source: 'src/config/webuysolarOffer.ts',
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions (WeBuySolar card stat)',
      '/solutions/webuysolar (meta description, hero CTA, How It Works, final CTA)',
      '/tools/solar-valuation (step 3)',
    ],
  },
  'webuysolar-power-after-sale': {
    value: 'PPA / Lease',
    label: 'After the sale',
    definition: 'After we acquire the system, the owner keeps buying its power under a PPA or a lease.',
    basis: 'The WeBuySolar offer: "Zero-capex Power Purchase Agreement (PPA) or lease" and a "PPA/lease and sale agreement".',
    source: 'src/config/webuysolarContent.ts (comparison) and src/config/webuysolarOffer.ts (steps 2 and 4)',
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (WeBuySolar card stat)'],
    note: 'Relabelled in September 2026: it said "Flexible buyback", the retired name for what is an acquisition.',
  },
  'webuysolar-operated': {
    value: 'Operated',
    label: 'We run & optimise',
    definition: 'After the acquisition, Phoenix operates and optimises the system.',
    basis: 'The WeBuySolar offer (steps 5 and 6).',
    source: 'src/config/webuysolarOffer.ts',
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)'],
  },
  'webuysolar-eligibility': {
    // A no-break space keeps "Tier 1" on one line, as in the eligibility sentence.
    value: 'Tier 1',
    label: 'BloombergNEF equipment',
    definition: 'Who qualifies: systems built on BloombergNEF Tier 1 equipment, with or without battery storage.',
    basis: 'The WeBuySolar eligibility rule.',
    source: 'src/config/webuysolarOffer.ts (eligibility)',
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      'VERTICAL_CONFIG stat (not rendered)',
      'The eligibility sentence itself: /solutions/webuysolar (hero, FAQ) and /tools/solar-valuation',
    ],
    note: 'Replaces "Any brand / Systems considered", which contradicted the eligibility rule. The valuation tool still accepts every panel and inverter brand: confirm whether it should.',
  },
  'webuysolar-audit-report-time': {
    value: AUDIT_REPORT_TIME,
    label: 'Written audit report',
    definition: 'Time from the on-site audit to the written report.',
    basis: NOT_RECORDED,
    source: 'src/config/webuysolarOffer.ts (step 1)',
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions/webuysolar (How It Works, step 1)',
      '/tools/solar-valuation (step 3, What happens next)',
    ],
  },
  'webuysolar-battery-price-drop': {
    value: '~40%',
    label: 'Fall in C&I battery prices over two years',
    definition: 'How far commercial and industrial battery prices have fallen in two years.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions/webuysolar (Why now, "Battery economics flipped")'],
  },
  'webuysolar-underperformance-example': {
    value: `${UNDERPERFORMANCE_EXAMPLE.actual}% versus ${UNDERPERFORMANCE_EXAMPLE.potential}%`,
    label: 'Illustrative output against potential',
    definition: 'An illustration: a system producing 78% of its potential looks the same as one producing 92%. It isn’t presented as a measurement.',
    basis: 'Illustrative.',
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions/webuysolar (Where value is lost, "Silent underperformance")'],
  },

  // ── EV Fleets & Infrastructure ───────────────────────────────────────────────
  'ev-fuel-saving': {
    value: '60%',
    label: 'Fuel Saving',
    definition: 'Saving on fuel costs from electrifying a fleet.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/solutions (EV Fleets card stat, "60%+")',
      '/solutions/ev-fleets (meta description, "up to 60% savings on fuel costs")',
      '/solutions (EV Fleets card text)',
    ],
    note: '"60%+" (at least 60%) and "up to 60%" (at most 60%) contradict each other. The FAQ quotes 23 to 27% total-cost savings (ev-total-cost-saving).',
  },
  'ev-chargers-sans': {
    value: 'SANS',
    label: 'Certified Chargers',
    definition: 'Chargers certified to a South African National Standard. Which standard isn’t recorded.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions (EV Fleets card stat)', '/solutions/ev-fleets (meta description, "SANS-certified chargers")'],
  },
  'ev-dashboard': {
    value: 'Fleet',
    label: 'Dashboard Included',
    definition: 'A fleet management dashboard comes with the service.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)', '/solutions/ev-fleets (meta description, "a fleet management dashboard")'],
    note: 'The EV Fleets page doesn’t describe a dashboard.',
  },
  'ev-v2g': {
    value: 'V2G',
    label: 'Ready',
    definition: 'The charging set-up supports vehicle-to-grid.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['VERTICAL_CONFIG stat (not rendered)'],
  },
  'ev-total-cost-saving': {
    value: '23 to 27%',
    label: 'Cheaper than diesel (total running cost)',
    definition: 'How much cheaper electric fleets have run than diesel in South Africa.',
    basis: 'Across 12.5 million kilometres of South African operation (ev-evidence-distance).',
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions/ev-fleets (FAQ, "How much cheaper is it really?")'],
    note: 'The audit recommends showing the source beside it.',
  },
  'ev-evidence-distance': {
    value: '12.5 million kilometres',
    label: 'South African electric fleet operation',
    definition: 'The distance the 23 to 27% figure is drawn from.',
    basis: NOT_RECORDED,
    source: NOT_RECORDED,
    asOf: null,
    status: 'unconfirmed',
    usedOn: ['/solutions/ev-fleets (FAQ, "How much cheaper is it really?")'],
  },

  // ── Response times ───────────────────────────────────────────────────────────
  'reply-time': {
    value: REPLY_PROMISE.window,
    label: 'Reply to an enquiry or a valuation request',
    definition: 'Time from a contact form enquiry or a valuation request to our first reply.',
    basis: 'The team’s service standard.',
    source: 'src/config/contact.ts (REPLY_PROMISE)',
    asOf: null,
    status: 'unconfirmed',
    usedOn: [
      '/contact (contact details, What happens next, message sent)',
      '/tools/solar-valuation (step 3, What happens next)',
      '/projects/[slug] (case study CTA band)',
      'Company-level footer band: /, /about, /projects, /blog, /blog/authors/[slug], /blog/[slug], /tools',
    ],
    note: 'Replaced "results delivered in 48 hours" (shared footer default) and "a free assessment for your facility in under 48 hours" (case study CTA) in September 2026.',
  },
} as const satisfies Record<string, ClaimRecord>;

export type ClaimId = keyof typeof REGISTER;

export interface Claim extends ClaimRecord {
  id: ClaimId;
}

export function claim(id: ClaimId): Claim {
  return { id, ...REGISTER[id] };
}

/** The figure alone, for sentences that state it in their own words. */
export function claimValue(id: ClaimId): string {
  return REGISTER[id].value;
}

/** Value and label, as a stat tile shows them. */
export function claimStat(id: ClaimId): { value: string; label: string } {
  const { value, label } = REGISTER[id];
  return { value, label };
}

/** Every claim, for the register document and tests. */
export function allClaims(): Claim[] {
  return (Object.keys(REGISTER) as ClaimId[]).map(claim);
}
