// src/config/verticals.ts
// SEO copy and headline stats per vertical. Every figure comes from the claims
// register (src/config/claims.ts), so a confirmed change is made there once.
// The qualifier around a figure ("up to", "Avg.", the "+" on 60%+) stays here;
// where two qualifiers disagree, the register notes the conflict.
import type { SolutionVertical } from '@/types/solutions';
import { claimStat, claimValue } from '@/config/claims';
import { SITE_URL, type ShareImage } from '@/lib/seo';

export interface VerticalStat {
  value: string;
  label: string;
}

export interface VerticalConfig {
  seoTitle: string;
  seoDescription: string;
  /** The page's share image: 1200 by 630, a JPEG, with alt text. */
  shareImage: ShareImage;
  stats: VerticalStat[];
}

const shareImage = (file: string, alt: string): ShareImage => ({ url: `${SITE_URL}/${file}`, width: 1200, height: 630, alt });

export const VERTICAL_CONFIG: Record<SolutionVertical, VerticalConfig> = {
  'ci-solar-storage': {
    seoTitle: 'C&I Solar & Storage Solutions | Phoenix Energy',
    seoDescription:
      `Commercial and industrial solar and battery storage systems. Zero upfront with our PPA model. Cut your electricity bill by up to ${claimValue('ci-bill-reduction')}.`,
    shareImage: shareImage('og-solutions-ci-solar.jpg', 'Solar panels on a warehouse roof at sunset, with the words C&I Solar & Storage and the Phoenix Energy logo.'),
    stats: [
      claimStat('ci-installations'),
      claimStat('ci-bill-reduction'),
      claimStat('ci-ppa-upfront'),
      claimStat('ci-system-lifespan'),
    ],
  },
  wheeling: {
    seoTitle: 'Electricity Wheeling Solutions | Phoenix Energy',
    seoDescription:
      `Buy renewable energy directly from generators via the Eskom grid. Save up to ${claimValue('wheeling-cost-saving')} on electricity costs with Phoenix Energy wheeling agreements.`,
    shareImage: shareImage('og-solutions-wheeling.jpg', 'Electricity pylons against an evening sky, with the word Wheeling and the Phoenix Energy logo.'),
    stats: [
      claimStat('wheeling-cost-saving'),
      claimStat('wheeling-licensed-platforms'),
      claimStat('wheeling-infrastructure-cost'),
      claimStat('wheeling-settlement'),
    ],
  },
  'energy-optimisation': {
    seoTitle: 'Energy Optimisation Services | Phoenix Energy',
    seoDescription:
      'Cut energy costs with high-efficiency WEG motors, VSDs, smart controls and demand management, bought outright or on a zero-capex efficiency lease.',
    shareImage: shareImage('og-solutions-energy-optimisation.jpg', 'An energy monitoring dashboard in front of an industrial plant, with the words Energy Optimisation and the Phoenix Energy logo.'),
    stats: [
      claimStat('eo-waste-identified'),
      claimStat('eo-typical-roi'),
      claimStat('eo-capital-outlay'),
      claimStat('eo-live-monitoring'),
    ],
  },
  'carbon-credits': {
    seoTitle: 'Carbon Credit Solutions | Phoenix Energy',
    seoDescription:
      `Monetise your solar generation through ${claimValue('carbon-standard')}-certified carbon credits. ${claimValue('carbon-payout-frequency')} payouts, no admin burden, fully managed by Phoenix Energy.`,
    shareImage: shareImage('og-solutions-carbon-credits.jpg', 'A solar farm in open savanna, with the words Carbon Credits and the Phoenix Energy logo.'),
    stats: [
      claimStat('carbon-credit-price-floor'),
      claimStat('carbon-standard'),
      claimStat('carbon-payout-frequency'),
      claimStat('carbon-registration-stat'),
    ],
  },
  webuysolar: {
    seoTitle: 'WeBuySolar: We Acquire & Operate Your Solar | Phoenix Energy',
    seoDescription:
      'We acquire and operate existing C&I solar and battery systems: fair-market valuation, flexible PPA or lease, and active optimisation. Free expert audit.',
    shareImage: shareImage('og-solutions-webuysolar.jpg', 'A smiling man with folded arms on a rooftop of solar panels, Table Mountain behind him, with the words We Buy Solar and the Phoenix Energy logo.'),
    // Worded to match the WeBuySolar offer (src/config/webuysolarOffer.ts): an
    // acquisition, not a "buyback", and Tier 1 equipment rather than any brand.
    stats: [
      claimStat('webuysolar-free-audit'),
      claimStat('webuysolar-power-after-sale'),
      claimStat('webuysolar-operated'),
      claimStat('webuysolar-eligibility'),
    ],
  },
  'ev-fleets': {
    seoTitle: 'EV Fleet & Infrastructure Solutions | Phoenix Energy',
    seoDescription:
      `Electrify your commercial fleet with ${claimValue('ev-chargers-sans')}-certified chargers, a fleet management dashboard, and up to ${claimValue('ev-fuel-saving')} savings on fuel costs.`,
    shareImage: shareImage('og-solutions-ev-fleets.jpg', 'An electric truck at a charging station beneath a solar canopy, with the words EV Fleets & Infrastructure and the Phoenix Energy logo.'),
    stats: [
      { ...claimStat('ev-fuel-saving'), value: `${claimValue('ev-fuel-saving')}+` },
      claimStat('ev-chargers-sans'),
      claimStat('ev-dashboard'),
      claimStat('ev-v2g'),
    ],
  },
};
