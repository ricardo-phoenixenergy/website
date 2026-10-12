// src/config/wegPartner.ts
// The WEG band on the location pages (spec 2026-10-12-location-pages-v2, section 5).
// WEG's figures are WEG's own, credited on the page and held in the claims register.
import { claimStat, claimValue } from '@/config/claims';

export interface PartnerBandContent {
  partnerName: string;
  eyebrow: string;
  heading: string;
  lead: string;
  stats: { value: string; label: string }[];
  /** Credits the figures, e.g. "Source: WEG". */
  statsSource: string;
  points: { title: string; body: string }[];
  link: { label: string; href: string };
}

/** "One solution warranty" from the claims register, as it reads mid-sentence. */
const warranty = claimValue('weg-solution-warranty').replace(/^./, (c) => c.toLowerCase());

export const WEG_BAND: PartnerBandContent = {
  partnerName: 'WEG',
  eyebrow: 'Our technology partner',
  heading: 'Backed by WEG, from panel to motor',
  lead: `Since June 2025 we have partnered with WEG, a global manufacturer founded in 1961. We install WEG equipment across solar, storage and energy efficiency, and back every system with ${warranty}.`,
  stats: [claimStat('weg-solar-capacity'), claimStat('weg-countries')],
  statsSource: 'Source: WEG',
  points: [
    { title: 'One partner for every part', body: 'WEG makes solar inverters, battery storage, high-efficiency motors, variable speed drives and automation, so we design how you generate and how you use energy with one brand, and avoid integration problems.' },
    { title: 'One point of accountability', body: 'A fully wrapped solution warranty for the whole system, with dedicated local support, instead of several vendors blaming each other.' },
    { title: 'Built to last', body: 'More than 60 years of manufacturing and a presence in over 135 countries stand behind the equipment for the life of your system.' },
  ],
  link: { label: 'About WEG', href: 'https://www.weg.net' },
};
