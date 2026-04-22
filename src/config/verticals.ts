// src/config/verticals.ts
import type { SolutionVertical } from '@/types/solutions';

export interface VerticalStat {
  value: string;
  label: string;
}

export interface VerticalConfig {
  seoTitle: string;
  seoDescription: string;
  stats: VerticalStat[];
}

export const VERTICAL_CONFIG: Record<SolutionVertical, VerticalConfig> = {
  'ci-solar-storage': {
    seoTitle: 'C&I Solar & Storage Solutions | Phoenix Energy',
    seoDescription:
      'Commercial and industrial solar and battery storage systems. Zero upfront with our PPA model. Cut your electricity bill by up to 60%.',
    stats: [
      { value: '250+', label: 'C&I Installations' },
      { value: '60%', label: 'Avg. Bill Reduction' },
      { value: 'R0', label: 'Upfront with PPA' },
      { value: '25yr', label: 'System Lifespan' },
    ],
  },
  wheeling: {
    seoTitle: 'Electricity Wheeling Solutions | Phoenix Energy',
    seoDescription:
      'Buy renewable energy directly from generators via the Eskom grid. Save up to 32% on electricity costs with Phoenix Energy wheeling agreements.',
    stats: [
      { value: '32%', label: 'Avg. Cost Saving' },
      { value: '3', label: 'Licensed Platforms' },
      { value: 'R0', label: 'Infrastructure Cost' },
      { value: 'T-day', label: 'Settlement' },
    ],
  },
  'energy-optimisation': {
    seoTitle: 'Energy Optimisation Services | Phoenix Energy',
    seoDescription:
      'Real-time monitoring, HVAC tuning, and load-shifting that cuts energy waste by up to 28% — zero capital outlay required.',
    stats: [
      { value: '28%', label: 'Avg. Waste Identified' },
      { value: '<12mo', label: 'Typical ROI' },
      { value: 'R0', label: 'Capital Outlay' },
      { value: '24/7', label: 'Live Monitoring' },
    ],
  },
  'carbon-credits': {
    seoTitle: 'Carbon Credit Solutions | Phoenix Energy',
    seoDescription:
      'Monetise your solar generation through Verra-certified carbon credits. Quarterly payouts, no admin burden, fully managed by Phoenix Energy.',
    stats: [
      { value: 'R8+', label: 'Per Carbon Credit' },
      { value: 'Verra', label: 'Certified Standard' },
      { value: 'Quarterly', label: 'Payouts' },
      { value: '90 days', label: 'To Registration' },
    ],
  },
  webuysolar: {
    seoTitle: 'We Buy Solar Systems | Phoenix Energy',
    seoDescription:
      'Sell your existing solar installation to Phoenix Energy. Fast valuation, cash within 14 days, any brand accepted. We handle the removal.',
    stats: [
      { value: '48hr', label: 'Free Valuation' },
      { value: '14 days', label: 'Cash Payment' },
      { value: 'Any Brand', label: 'Systems Accepted' },
      { value: 'Included', label: 'Removal & Transport' },
    ],
  },
  'ev-fleets': {
    seoTitle: 'EV Fleet & Infrastructure Solutions | Phoenix Energy',
    seoDescription:
      'Electrify your commercial fleet with SANS-certified chargers, a fleet management dashboard, and up to 60% savings on fuel costs.',
    stats: [
      { value: '60%+', label: 'Fuel Saving' },
      { value: 'SANS', label: 'Certified Chargers' },
      { value: 'Fleet', label: 'Dashboard Included' },
      { value: 'V2G', label: 'Ready' },
    ],
  },
};
