import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

// Standalone scripts don't get Next.js env loading — parse .env.local ourselves.
try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* vars may already be in the environment */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SUBTITLE = 'A simple, transparent process — from first conversation to ongoing savings.';

// Add Sanity _key to each step (required for array items).
const steps = (arr) => arr.map((s, i) => ({ _key: `s${i + 1}`, ...s }));

const docs = [
  {
    _id: 'howItWorks.home',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Your path to energy <em>independence</em>',
    subtitle: SUBTITLE,
    showCta: false,
    steps: steps([
      { label: 'Free assessment', description: 'We visit your site and model three solution scenarios at no cost, no obligation.', tag: 'No cost · No obligation' },
      { label: 'Proposal & financing', description: 'Full ROI model, payback period, and financing options delivered in 5 business days.', tag: 'Delivered in 5 days' },
      { label: 'Installation & beyond', description: 'Certified install in 8–12 weeks, then 24/7 monitoring with a 25-year warranty.', tag: '8–12 week commissioning' },
    ]),
  },
  {
    _id: 'howItWorks.ci-solar-storage',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'From assessment to <em>savings in weeks</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Free Assessment',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Site Assessment', description: 'We audit your consumption data, roof or ground area, and grid connection details.', tag: 'Free' },
      { label: 'System Design', description: 'Our engineers produce a yield simulation and NERSA-compliant single-line diagram.', tag: '5–7 days' },
      { label: 'Installation', description: 'SAPVIA-certified teams install and commission with zero business disruption.', tag: '1–3 weeks' },
      { label: 'Monitoring', description: '24/7 remote monitoring with monthly generation reports and annual preventive maintenance.', tag: 'Ongoing' },
    ]),
  },
  {
    _id: 'howItWorks.wheeling',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Wheeling made <em>straightforward</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Wheeling Quote',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Consumption Audit', description: 'We analyse 12 months of interval meter data to quantify your wheeling opportunity.', tag: 'Free' },
      { label: 'Generator Matching', description: 'Phoenix matches your load profile to available generators on our licensed platforms.', tag: '5–10 days' },
      { label: 'Agreement Sign-off', description: 'NERSA-compliant wheeling agreement executed between generator, Eskom, and consumer.', tag: '2–4 weeks' },
      { label: 'Live Settlement', description: 'T-day energy accounting with monthly consolidated invoicing and REC delivery.', tag: 'Ongoing' },
    ]),
  },
  {
    _id: 'howItWorks.energy-optimisation',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'From audit to savings <em>in two weeks</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Book a Free Audit',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Energy Audit', description: 'A certified energy auditor walks your facility and identifies top waste sources.', tag: 'Free' },
      { label: 'Sub-Meter Install', description: 'Circuit-level sub-meters and IoT sensors installed within 2–5 days.', tag: '2–5 days' },
      { label: 'Tuning & Automation', description: 'BMS integration and load-shift automations deployed — savings start immediately.', tag: '1–2 weeks' },
      { label: 'Continuous Reporting', description: 'Monthly savings reports with attributed ROI. We review and retune quarterly.', tag: 'Ongoing' },
    ]),
  },
  {
    _id: 'howItWorks.carbon-credits',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Credits in your account <em>within 90 days</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Check Eligibility',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Eligibility Check', description: 'We verify your solar system meets Verra VCS project criteria — takes 48 hours.', tag: 'Free' },
      { label: 'Project Registration', description: 'Phoenix submits your project to the registry. Third-party validation is arranged.', tag: '30–60 days' },
      { label: 'First Issuance', description: 'Credits issued for retrospective generation since system commissioning date.', tag: 'Once registered' },
      { label: 'Quarterly Payouts', description: 'Credits issued and sold quarterly. Revenue is deposited directly to your account.', tag: 'Every quarter' },
    ]),
  },
  {
    _id: 'howItWorks.webuysolar',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'From enquiry to cash <em>in 14 days</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Valuation',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Submit Details', description: 'Share your system specs and location — a 5-minute online form or a quick call.', tag: 'Online' },
      { label: 'Site Inspection', description: 'Our technician visits within 48 hours, assesses condition, and prepares an offer.', tag: '48 hours' },
      { label: 'Offer & Sign', description: 'You receive a written offer. No obligation — accept if it works for you.', tag: 'Your choice' },
      { label: 'Cash & Removal', description: 'Payment is transferred within 14 days. Our team handles all decommissioning.', tag: '14 days' },
    ]),
  },
  {
    _id: 'howItWorks.ev-fleets',
    _type: 'howItWorks',
    eyebrow: 'How it works',
    title: 'Your fleet electrified <em>in four steps</em>',
    subtitle: SUBTITLE,
    showCta: true,
    ctaLabel: 'Get a Fleet Assessment',
    ctaHref: '/contact',
    steps: steps([
      { label: 'Fleet Assessment', description: 'We analyse your fleet routes, duty cycles, and depot layout to design the right charging solution.', tag: 'Free' },
      { label: 'Depot Design', description: 'Load flow study, charger placement plan, and grid connection sizing delivered in 7 days.', tag: '7 days' },
      { label: 'Installation', description: 'SANS-certified electricians install chargers and connect fleet management software.', tag: '2–4 weeks' },
      { label: 'Fleet Dashboard', description: 'Dashboard onboarding and driver training. Live savings reporting from day one.', tag: 'Ongoing' },
    ]),
  },
];

const run = async () => {
  for (const doc of docs) {
    await client.createOrReplace(doc);
    console.log('seeded', doc._id);
  }
  console.log('Done.');
};

run().catch((err) => { console.error(err); process.exit(1); });
