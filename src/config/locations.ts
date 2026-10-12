// src/config/locations.ts
// The words on the commercial solar location page (src/app/solutions/
// ci-solar-storage/[area]/page.tsx), per the spec in
// docs/superpowers/specs/2026-10-12-location-pages-design.md. Pretoria and
// Centurion had their own page until 12 October 2026; their Tshwane facts and
// places now sit on the Gauteng page.
//
// The municipal facts were checked on 12 October 2026. Official sources
// (municipality, Eskom, NERSA) are stated plainly; news reports are named as
// such. Where sources conflict or nothing official was found, the copy says
// Phoenix confirms the position for the site. Tariffs change every July (Eskom
// direct: April): recheck each card then and move its asOf.
//
// The pages never say what Phoenix is not. Figures come from the claims register.
import type { ExplainerCardsProps } from '@/components/sections/ExplainerCards';
import type { FaqItem } from '@/components/sections/FaqAccordion';
import type { PlaceServed } from '@/lib/structuredData';
import type { LocationArea } from '@/lib/locationAreas';
import type { MunicipalityCard, PlaceGroup, SupplierHelp } from '@/types/locations';
import { claimValue } from '@/config/claims';
import { contactHref } from '@/lib/contactLink';

export interface LocationContent {
  seoTitle: string;
  seoDescription: string;
  /** The Service block's name in structured data. */
  serviceName: string;
  /** The line above the H1: carries the search keyword. */
  eyebrow: string;
  /** Supports one <em> for the accent phrase. */
  h1: string;
  subtitle: string;
  /** One quotable sentence, shown before the lifecycle cards. */
  statement: string;
  projects: { eyebrow: string; heading: string };
  /** Blog post slugs shown as further reading. */
  articleSlugs: readonly string[];
  closing: { heading: string; body: string; ctaMessage: string };
  areaServed: PlaceServed[];
  municipalities: { eyebrow: string; heading: string; subtitle: string; cards: MunicipalityCard[]; defaultOpen?: string[] };
  areas: { eyebrow: string; heading: string; groups: PlaceGroup[] };
  faqHeading: string;
  faqs: FaqItem[];
}

/** The date the municipal facts on the location pages were last checked. */
export const LOCATION_FACTS_CHECKED = '2026-10-12';
const UPFRONT = claimValue('ci-ppa-upfront');

/**
 * The Operate card. Until Ricardo confirms which after-care services Phoenix
 * provides (spec section 7, item 2), it says only what the claims register's
 * PPA basis already states: Phoenix maintains the system.
 */
export const OPERATE_BODY =
  'Handover is where our longest job starts. We look after the system for its working life and keep it producing at its best.';

export const LIFECYCLE: Omit<ExplainerCardsProps, 'accent' | 'background'> = {
  eyebrow: 'One team, start to finish',
  heading: 'From your first bill review to <em>every year after</em>',
  subtitle:
    'One team carries your project from the first look at your electricity bill to running the system day to day, so the people who designed it answer for how it performs.',
  cards: [
    { icon: 'ClipboardCheck', title: 'Design', body: 'We start with your electricity bills and meter data, then size the solar and any battery to how your site uses power through the day and the year.' },
    { icon: 'Sliders', title: 'Engineer', body: 'Our engineers produce the layout, structural checks and electrical design, and prepare the application your municipality or Eskom needs to approve the connection.' },
    { icon: 'DollarSign', title: 'Fund', body: `Buy the system, rent it, or sign a power purchase agreement and pay ${UPFRONT} upfront: we fund the system and you pay for the power it produces.` },
    { icon: 'Building', title: 'Build', body: 'We install, test and certify the system, then commission it with you before handover.' },
    { icon: 'Activity', title: 'Operate', body: OPERATE_BODY, wide: true },
  ],
};

/* ─── Shared answers ────────────────────────────────────────────────────── */

/** How to choose a solar company, opening with the page's own search phrase. */
const choosingAnswer = (opening: string) =>
  `${opening} can show who designs the system, who signs off the electrical work and who looks after it once it runs. A registered professional should sign off the design, the installer should issue a certificate of compliance, and the company should be able to show commercial projects of a similar size. Ask too how the system is monitored after handover and who you call when output drops.`;

const UPFRONT_ANSWER = `Yes. Under a power purchase agreement we fund, install and maintain the system on your site. You pay ${UPFRONT} upfront and pay for the power the system produces.`;

const aftercareFaq = (where: string): FaqItem => ({
  question: `Who looks after a commercial solar system in ${where} after it is installed?`,
  answer: `We do. ${OPERATE_BODY}`,
});

/* ─── Sources ───────────────────────────────────────────────────────────── */

const SRC = {
  eskomBooklet: { label: 'Eskom Tariffs and Charges Booklet 2026/27', url: 'https://www.eskom.co.za/distribution/wp-content/uploads/2026/07/Eskom-Tariff-booklet_Final.pdf' },
  eskomSseg: { label: 'Eskom SSEG application process', url: 'https://www.eskom.co.za/distribution/wp-content/uploads/2025/04/20240703-SSEG-Application-process.docx.pdf' },
  eskomRegistration: { label: 'Eskom, 21 October 2025', url: 'https://www.eskom.co.za/eskom-simplifies-solar-system-compliance-after-working-with-industry-stakeholders-extends-cost-relief-for-small-scale-embedded-generation-sseg-customers/' },
  eskomWaiver: { label: 'Engineering News, 1 October 2026 (news report)', url: 'https://www.engineeringnews.co.za/article/eskom-extends-assistance-timeframe-for-grid-tied-solar-installation-registrations-amid-regulatory-cost-concerns-2026-10-01' },
  eskomBulk: { label: 'Eskom 2026/27 tariff increase', url: 'https://www.eskom.co.za/distribution/2026-2027-tariff-increase/' },
};

/** Eskom's direct customers. */
function eskomCard(servesWhere: string): MunicipalityCard {
  return {
    id: 'eskom',
    name: 'Eskom (direct supply)',
    servesWhere,
    keyFact: 'Up 8.76% from 1 April 2026',
    weHandle: 'We apply to Eskom, including any move to a time-of-use tariff.',
    tariff:
      'Businesses up to 100 kVA are usually on Businessrate: one energy charge per kWh plus daily capacity, service and administration charges. Miniflex and Megaflex are time-of-use tariffs with peak, standard and off-peak rates by season, and capacity and demand charges per kVA. Eskom’s increase for direct customers was 8.76% from 1 April 2026.',
    solar: [
      'Businessrate is only for supplies without grid-tied generation, so a business adding grid-tied solar moves to a time-of-use tariff such as Miniflex. The two applications can run together.',
      'Eskom runs a capacity study and issues a quotation before connection, and systems over 100 kW also register with NERSA.',
      'Before the system is switched on, Eskom needs a compliance test report, a certificate of compliance, the inverter’s NRS 097 certificate and the safety labels.',
      'Power exported on a time-of-use tariff is credited under Gen-offset, up to the energy you bought in the same period each month.',
    ],
    recent:
      'Eskom has waived registration and connection fees for small systems until further notice. Reports describe the waiver as covering homes, so we confirm whether it applies to your site.',
    sources: [SRC.eskomBooklet, SRC.eskomSseg, SRC.eskomWaiver],
    asOf: LOCATION_FACTS_CHECKED,
  };
}

/* ─── Gauteng ───────────────────────────────────────────────────────────── */

const CITY_POWER: MunicipalityCard = {
  id: 'city-power',
  name: 'City Power',
  servesWhere: 'Most of Johannesburg',
  keyFact: 'Up 8.63% on average from 1 July 2026',
  weHandle: 'We handle your solar installation in Johannesburg, from City Power’s design approval to final sign-off.',
  tariff:
    'Smaller businesses pay a seasonal energy charge per kWh plus a fixed monthly service charge and a capacity charge. Larger users are on industrial tariffs with a demand charge per kVA, or on time-of-use tariffs with peak, standard and off-peak rates. The City set an average increase of 8.63% from 1 July 2026, and some customers pay more than the average.',
  solar: [
    'Grid-tied and hybrid systems up to 1 MVA must be registered, at businesses and homes alike, and registration is free.',
    'City Power approves the design before installation, then gives final approval once the certificate of compliance and commissioning report are in.',
    'Inverters need an NRS 097-2-1 certificate, and systems of 350 kVA or more need a grid impact study.',
    'To export power you need a post-paid, bi-directional smart meter, which City Power installs at your cost.',
  ],
  recent:
    'In January 2026, reports that City Power would move prepaid solar users to post-paid billing caused an outcry. City Power said there is no blanket policy, and that only customers who export need a bi-directional post-paid meter.',
  sources: [
    { label: 'City Power (citypower.co.za)', url: 'https://www.citypower.co.za/' },
    { label: 'City of Johannesburg 2026/27 budget report', url: 'https://joburg.org.za/documents_/Documents/2026-27-Final-Medium-Budget-Reports/2026-27-to-2028-29-Medium-Term-Operating-Budget-Report.pdf' },
    { label: 'Energize, 13 January 2026 (news report)', url: 'https://www.energize.co.za/article/no-solar-penalty-city-power-says-amid-prepaid-meter-claims' },
  ],
  asOf: LOCATION_FACTS_CHECKED,
};

const EKURHULENI: MunicipalityCard = {
  id: 'ekurhuleni',
  name: 'City of Ekurhuleni',
  servesWhere: 'Germiston, Kempton Park, Boksburg, Benoni, Brakpan, Alberton and surrounds',
  keyFact: 'Export credit in the 2026/27 tariffs',
  weHandle: 'We apply for the City’s consent and handle commissioning sign-off.',
  tariff:
    'Smaller business supplies up to 100 kVA pay a monthly basic charge, a capacity charge per ampere and a seasonal energy charge, higher from June to August. Larger supplies add a demand charge and a network access charge per kVA, with time-of-use energy rates and a reactive energy charge.',
  solar: [
    'You need the City’s written consent before connecting any generator, and that applies to commercial and industrial sites.',
    'The City issues a first approval before construction and a final approval after commissioning.',
    'Designs above 18 kVA are signed off at commissioning by a registered professional engineer or technologist, and inverters need NRS 097-2-1 type-test certificates.',
    'The site must stay a net consumer each month, and the City fits a four-quadrant import and export meter at your cost.',
    'Sites inside Ekurhuleni that Eskom supplies apply to Eskom, not the City.',
  ],
  recent:
    'The 2026/27 tariffs include an export credit for registered systems, which the City will pay once its billing system can bill it. In January 2026 the High Court set aside the City’s 2024/25 tariffs after a challenge by industrial users.',
  sources: [
    { label: 'Ekurhuleni electricity tariffs 2026/27', url: 'https://www.ekurhuleni.gov.za/wp-content/uploads/2026/07/Schedule-2-of-Electricity-Tariffs-2026-27-aligned-with-NERSA-rates-approved-on-23-May-2026-v.26.07.30-signed.pdf' },
    { label: 'Ekurhuleni embedded generation guideline', url: 'https://www.ekurhuleni.gov.za/wp-content/uploads/2026/07/Annexure-E25-Guideline-for-Embedded-Generation.pdf' },
    { label: 'Ekurhuleni electricity tariff policy', url: 'https://www.ekurhuleni.gov.za/wp-content/uploads/2026/07/Annexure-E16-Electricity-Tariff-Policy-Revised.pdf' },
    { label: 'Ekurhuleni registration process', url: 'https://www.ekurhuleni.gov.za/wp-content/uploads/2023/02/City-of-Ekurhuleni-embedded-generation-registration-process-summary.pdf' },
    { label: 'EWN, 15 January 2026 (news report)', url: 'https://www.ewn.co.za/2026/01/15/another-nersa-blunder-as-court-orders-do-over-of-electricity-tariffs-for-4-municipalities' },
  ],
  readMore: { label: 'Tariff C or Tariff E: what Ekurhuleni’s 2026/27 tariffs mean for your business', href: '/blog/ekurhuleni-tariff-c-2026-27-switch-to-tariff-e' },
  asOf: LOCATION_FACTS_CHECKED,
};

const EMFULENI: MunicipalityCard = {
  id: 'emfuleni',
  name: 'Emfuleni',
  servesWhere: 'Vereeniging and Vanderbijlpark',
  keyFact: 'Council approved 13.5%, subject to NERSA',
  weHandle: 'We confirm the current rules and any levy with Emfuleni and Eskom.',
  tariff:
    'Small businesses are on prepaid or conventional commercial tariffs with seasonal energy rates. Larger supplies pay a basic charge, a demand charge per kVA and summer and winter energy rates, and Miniflex, Megaflex and Nightsave time-of-use tariffs are offered. The council approved a 13.5% increase for 2026/27, subject to NERSA.',
  solar: [
    'Eskom runs billing, queries and new connections as the municipality’s agent.',
    'The 2025/26 business tariffs carry no charge specific to solar.',
    'The municipality publishes no registration process for solar, so we confirm the requirements with Emfuleni and Eskom for your site.',
  ],
  recent:
    'In June 2026 the council approved in principle a once-off application fee and a monthly levy on solar users. Reports describe it as aimed at households, and it is being contested. We check where it stands before we design.',
  sources: [
    { label: 'Emfuleni tariff booklet 2025/26', url: 'https://emfuleni.gov.za/wp-content/uploads/2025/07/ELM-tariff-booklet-2025-2026-latest.pdf' },
    { label: 'Emfuleni council resolution, 10 June 2026', url: 'https://emfuleni.gov.za/wp-content/uploads/2026/07/Council-Resolution-26_27.pdf' },
    { label: 'EWN, 4 October 2024 (news report)', url: 'https://www.ewn.co.za/2024/10/04/to-enhance-revenue-collection-emfuleni-municipality-signs-distribution-agreement-with-eskom' },
    { label: 'Sedibeng Ster, 15 June 2026 (news report)', url: 'https://www.citizen.co.za/sedibeng-ster/news/news-news/2026/06/15/emfuleni-plans-to-penalise-solar-power-users/' },
  ],
  asOf: LOCATION_FACTS_CHECKED,
};

/* ─── Pretoria and Centurion (City of Tshwane) ──────────────────────────── */

const TSHWANE: MunicipalityCard = {
  id: 'tshwane',
  name: 'City of Tshwane',
  servesWhere: 'Pretoria, Centurion and surrounds',
  keyFact: 'Up 8.8% from 1 July 2026',
  weHandle: 'We prepare the application for your solar installation in Pretoria or Centurion and follow it up with the City.',
  tariff:
    'Larger businesses on bulk low-voltage or 11 kV supplies pay a fixed monthly charge, a demand charge per kVA of their highest half-hourly demand, and an energy charge per kWh. New bulk connections go onto time-of-use tariffs, where a kWh costs most in winter (June to August) peak hours. Smaller businesses pay a monthly fixed charge set by their circuit-breaker size plus a flat rate per kWh. The City raised its electricity tariffs by 8.8% from 1 July 2026.',
  solar: [
    'Apply to the City and get written approval before installing, and buy no equipment until then.',
    'The application needs the inverter’s NRS 097-2-1 certificate and a circuit diagram of the system.',
    'A registered professional engineer or technologist signs off commissioning, and the City fits a bidirectional meter at your cost.',
    'Once the City approves the system, exported power is credited per kWh, as long as the site stays a net consumer over the year.',
  ],
  recent:
    'The City’s 2025/26 tariffs added a credit for exported solar power, and its draft 2026/27 tariffs keep it. SAPVIA, the solar industry body, has raised slow approvals with the City, which is reviewing its process.',
  sources: [
    { label: 'City of Tshwane, 2 July 2026', url: 'https://www.tshwane.gov.za/?p=102188' },
    { label: 'City of Tshwane tariff schedule 2025/26', url: 'https://www.tshwane.gov.za/?page_id=6924' },
    { label: 'City of Tshwane draft 2026/27 budget', url: 'https://www.tshwane.gov.za/wp-content/uploads/2026/03/19.-Draft-2026-2027-MTREF-for-CoT-1.pdf' },
    { label: 'City of Tshwane embedded generation requirements, republished with its proposed policy (August 2025)', url: 'https://www.tshwane.gov.za/wp-content/uploads/2025/08/Proposed-Embedded-Generation-Policy-to-support-and-formalise-procedure.pdf' },
    { label: 'City of Tshwane, 19 March 2024', url: 'https://www.tshwane.gov.za/?p=70218' },
    { label: 'SAPVIA (industry body)', url: 'https://sapvia.co.za/?p=107000' },
  ],
  asOf: LOCATION_FACTS_CHECKED,
};

const TSHWANE_INDUSTRIAL: MunicipalityCard = {
  id: 'tshwane-industrial',
  name: 'Rosslyn and Silverton',
  servesWhere: 'Tshwane’s automotive and manufacturing areas',
  keyFact: 'Supplied by the City of Tshwane',
  weHandle: 'We size the system around your load and demand charges, and handle the City’s studies and sign-off.',
  tariff:
    'The City supplies both areas: its Rosslyn substation serves the industrial north, including the automotive zone, and its Waltloo substation serves Silverton and Waltloo. Rosslyn is home to BMW Group Plant Rosslyn and the Automotive Supplier Park; Silverton to Ford’s assembly plant and the Tshwane Automotive Special Economic Zone. Plants this size are billed on bulk tariffs with a demand charge per kVA, and the City moves customers using more than 1 000 kWh a month onto time-of-use rates.',
  solar: [
    'The City’s embedded generation requirements say low-voltage systems above 350 kVA, and medium-voltage connections, may need a grid impact study at your cost.',
    'The same requirements limit generation on a dedicated low-voltage feeder to 75% of the site’s notified maximum demand.',
    'Business customers with solar stay on their normal tariff, fixed and demand charges included, so we model the saving against your own half-hourly data.',
  ],
  recent:
    'Nissan agreed in January 2026 to sell its Rosslyn plant to Chery, which has chosen Tshwane as its new manufacturing base.',
  sources: [
    { label: 'City of Tshwane State of the Capital Address 2026', url: 'https://www.tshwane.gov.za/wp-content/uploads/2026/04/State-of-the-Capital-Address-2026.pdf' },
    { label: 'City of Tshwane tariff schedule 2025/26', url: 'https://www.tshwane.gov.za/?page_id=6924' },
    { label: 'City of Tshwane embedded generation requirements, republished with its proposed policy (August 2025)', url: 'https://www.tshwane.gov.za/wp-content/uploads/2025/08/Proposed-Embedded-Generation-Policy-to-support-and-formalise-procedure.pdf' },
    { label: 'BMW Group Plant Rosslyn', url: 'https://www.bmwgroup-werke.com/rosslyn/en.html' },
    { label: 'AIDC Automotive Supplier Park', url: 'https://aidc.co.za/the-automotive-supplier-park/' },
    { label: 'SAnews, 6 November 2020', url: 'https://www.sanews.gov.za/node/49693' },
    { label: 'Engineering News, 23 January 2026 (news report)', url: 'https://www.engineeringnews.co.za/article/nissan-south-africas-rosslyn-plant-to-be-sold-to-chery-2026-01-23' },
  ],
  asOf: LOCATION_FACTS_CHECKED,
};

/** The box beside the municipality accordion. */
export const SUPPLIER_HELP: SupplierHelp = {
  text: 'Not sure who supplies you? The name on your electricity bill tells you. Send us a recent bill and we’ll check.',
  linkLabel: 'Send us your bill',
  href: contactHref('I’d like you to check who supplies electricity to my business site, and what solar could do there.'),
};

/* ─── The page ──────────────────────────────────────────────────────────── */

export const LOCATION_CONTENT: Record<LocationArea, LocationContent> = {
  gauteng: {
    seoTitle: 'Commercial Solar Installers in Gauteng | Phoenix Energy',
    seoDescription:
      'Commercial solar installers in Gauteng. We design, fund, install and run solar and storage for businesses in Johannesburg, Pretoria, Centurion and Ekurhuleni.',
    serviceName: 'Commercial solar installation in Gauteng',
    eyebrow: 'Commercial solar installers · Gauteng',
    h1: 'Commercial solar in Gauteng, <em>designed, funded and built</em> by one team',
    subtitle:
      'Commercial solar installers for factories, warehouses, offices, farms, schools and estates across Johannesburg, Pretoria, Centurion, Ekurhuleni and the Vaal. We design and engineer the system, fund it if you prefer, install it and run it for its working life.',
    statement: 'Phoenix Energy designs, funds, installs and operates commercial solar and battery storage for businesses across Gauteng, from Johannesburg, Ekurhuleni and the West Rand to Pretoria, Centurion and the Vaal.',
    projects: { eyebrow: 'Our work in Gauteng', heading: 'Commercial solar projects in Gauteng' },
    articleSlugs: ['ekurhuleni-tariff-c-2026-27-switch-to-tariff-e'],
    closing: {
      heading: 'Talk to us about your site in Gauteng',
      body: 'Send us a recent electricity bill and our engineers will show you what solar, storage and funding could do for your site.',
      ctaMessage: 'I’d like to book a discovery meeting about commercial solar and storage for my business site in Gauteng.',
    },
    areaServed: [
      { '@type': 'City', name: 'Johannesburg' },
      { '@type': 'City', name: 'Pretoria' },
      { '@type': 'City', name: 'Centurion' },
      { '@type': 'AdministrativeArea', name: 'City of Tshwane' },
      { '@type': 'AdministrativeArea', name: 'City of Ekurhuleni' },
      { '@type': 'AdministrativeArea', name: 'Emfuleni Local Municipality' },
      { '@type': 'AdministrativeArea', name: 'Mogale City Local Municipality' },
      { '@type': 'AdministrativeArea', name: 'Rand West City Local Municipality' },
      { '@type': 'AdministrativeArea', name: 'Gauteng' },
    ],
    municipalities: {
      eyebrow: 'Your municipality, your numbers',
      heading: 'Johannesburg, Pretoria, Ekurhuleni and Vaal tariffs and solar rules',
      subtitle:
        'City Power, Tshwane, Eskom, Ekurhuleni and Emfuleni each set their own tariffs and rules for connecting solar. This is what applies to businesses, as checked in October 2026.',
      cards: [CITY_POWER, TSHWANE, TSHWANE_INDUSTRIAL, eskomCard('Parts of Soweto, Sandton, Diepsloot, Ivory Park and Orange Farm, and any site Eskom bills directly'), EKURHULENI, EMFULENI],
    },
    areas: {
      eyebrow: 'Where we work',
      heading: 'Commercial solar installation across Gauteng',
      groups: [
        { name: 'Johannesburg', places: ['Sandton', 'Midrand', 'Randburg', 'Rosebank', 'Roodepoort', 'the Johannesburg CBD', 'City Deep', 'Soweto'] },
        { name: 'Pretoria', places: ['the Pretoria CBD', 'Pretoria East', 'Hatfield', 'Menlyn', 'Silverton', 'Rosslyn', 'Pretoria West'] },
        { name: 'Centurion', places: ['Centurion', 'Irene', 'Highveld', 'Samrand', 'Lyttelton'] },
        { name: 'Ekurhuleni', places: ['Germiston', 'Kempton Park', 'Isando', 'Jet Park', 'Boksburg', 'Benoni', 'Brakpan', 'Alberton'] },
        { name: 'West Rand', places: ['Krugersdorp', 'Randfontein', 'Westonaria'] },
        { name: 'The Vaal', places: ['Vereeniging', 'Vanderbijlpark'] },
      ],
    },
    faqHeading: 'Commercial solar installers in Gauteng: your questions',
    faqs: [
      { question: 'How do I choose between commercial solar installers in Gauteng?', answer: choosingAnswer('The best solar companies in Johannesburg or Pretoria for a business') },
      {
        question: 'What do solar installers in Gauteng need from my business to give a proposal?',
        answer:
          'A recent electricity bill is enough to start, whether your site is in Johannesburg, Pretoria, Centurion or Ekurhuleni. We size every commercial system from how the site uses power, so we ask for your bills and any meter data you have, then show you what solar, storage and funding could do for your site.',
      },
      {
        question: 'Do I need City Power’s approval for a solar installation in Johannesburg?',
        answer:
          'Yes. City Power requires grid-tied and hybrid systems up to 1 MVA to be registered, at businesses and homes, and approves the design before installation. If Eskom bills your site directly, Eskom approves it instead, and you move to a time-of-use tariff such as Miniflex first. We prepare and submit the application as part of the project.',
      },
      {
        question: 'Do I need the City of Tshwane’s approval for a solar installation in Pretoria or Centurion?',
        answer:
          'Yes. The City’s embedded generation requirements ask you to apply and get written approval before installing, and to buy no equipment until then. The application needs the inverter’s NRS 097-2-1 certificate and a circuit diagram, and a registered professional engineer or technologist signs off commissioning. We prepare and submit the application and follow it up with the City.',
      },
      { question: 'Can a business in Gauteng install solar with no upfront cost?', answer: UPFRONT_ANSWER },
      {
        question: 'Do City Power’s solar billing changes affect businesses?',
        answer:
          'The reports in early 2026 were about prepaid customers being moved to post-paid billing. City Power said there is no blanket policy, and that a bi-directional post-paid meter is needed only by customers who export. A business that wants to export needs that meter in any case, and we include it in the plan and the payback figures.',
      },
      {
        question: 'Can I sell solar power back to the grid in Ekurhuleni or Tshwane?',
        answer:
          'Both cities credit exported power from registered systems on sites that stay net consumers. Under Ekurhuleni’s 2026/27 tariffs, the site needs a four-quadrant import and export meter and must stay a net consumer each month, and the City says credits start once its billing system can bill them. The City of Tshwane credits exported power per kWh once it has approved the system, for sites with a bidirectional meter that stay net consumers over the year, and its draft 2026/27 tariffs keep the credit. We size systems mainly for your own use and treat export as a bonus.',
      },
      {
        question: 'Do you install commercial solar in the Vaal?',
        answer:
          'Yes. We work across Emfuleni, including Vereeniging and Vanderbijlpark. Eskom runs billing and connections there as the municipality’s agent, and we confirm the current solar rules and any levy for your site before we design.',
      },
      aftercareFaq('Gauteng'),
    ],
  },
};
