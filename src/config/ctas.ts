// src/config/ctas.ts
// Every call to action that opens the contact form or the valuation request,
// in one place, plus the one link to the portfolio (PROJECTS_CTA). Labels are
// sentence case and say what happens next. There are five kinds:
//
// 1. "Get in touch": the navbar only. Any audience (clients, partners,
//    investors), so it opens step 1 of the form, where the visitor chooses.
// 2. "Book a discovery meeting": company-level pages (home, About, Projects,
//    Blog, Tools, /solutions) and C&I Solar & Storage, whose process starts
//    with a discovery meeting.
// 3. "Book a free {service} assessment" or "Book a free {service} audit": a
//    solution page whose process starts with an assessment or an audit, using
//    the page's own word for that first step. "Free" appears only because each
//    of these pages already says that step is free.
// 4. Two named actions: "Check my eligibility" (Carbon Credits, where
//    eligibility is unknown until we check) and "Request a valuation"
//    (WeBuySolar's valuation request tool).
// 5. Two audience routes, "Partner with us" and "Talk to us about investing":
//    About only, beside the partners and financiers it lists. They open step 2
//    as a partner or an investor, so neither is handed the client form.
//
// Page CTAs open step 2 of the form as a client, with a message that names the
// service already written, so the visitor never has to explain where they came
// from. Tool results (Strategy Finder, Wheeling eligibility, the Carbon and
// Fleet estimators) keep their own labels and build their message from the
// visitor's answers.
//
// A few links open the form without being CTAs from this file: the navbar's
// "Contact" link, the C&I strategy tabs (which pass `?strategy=`, as the
// Strategy Finder's result does), and the blog's Inline CTA block, whose label
// comes from Sanity (default "Learn more").
import { REPLY_PROMISE } from '@/config/contact';
import { contactHref } from '@/lib/contactLink';
import type { SolutionVertical } from '@/types/solutions';

export interface Cta {
  label: string;
  href: string;
}

/** The first step's name in a "Book a free {service} …" label. */
type FirstStep = 'assessment' | 'audit';

/** The service pattern, e.g. "Book a free wheeling assessment". */
export function serviceCtaLabel(service: string, firstStep: FirstStep): string {
  return `Book a free ${service} ${firstStep}`;
}

/** Navbar contact entry: any audience, step 1 of the form. */
export const CONTACT_CTA: Cta = { label: 'Get in touch', href: '/contact' };

export const DISCOVERY_LABEL = 'Book a discovery meeting';

/** Company-level CTA, and the default for the shared footer and How It Works. */
export const DISCOVERY_CTA: Cta = {
  label: DISCOVERY_LABEL,
  href: contactHref('I’d like to book a discovery meeting to find the right energy strategy for my business.'),
};

/** The company-level footer band that goes with DISCOVERY_CTA (the shared footer's default). */
export const DISCOVERY_BAND = {
  eyebrow: 'Start your energy transition',
  heading: 'Find the right energy strategy for your business.',
  body: `Meet with our engineers to identify the solutions that will reduce costs, generate new revenue and strengthen your energy resilience, at no cost or obligation. ${REPLY_PROMISE.sentence}`,
} as const;

/** WeBuySolar's valuation request (the tool, not the form). */
export const VALUATION_CTA: Cta = { label: 'Request a valuation', href: '/tools/solar-valuation' };

/** About's route for partners: the form's partner step, not the client one. */
export const PARTNER_CTA: Cta = {
  label: 'Partner with us',
  href: contactHref('I’d like to talk about partnering with Phoenix Energy.', 'partner'),
};

/** About's route for investors: the form's investor step, not the client one. */
export const INVESTOR_CTA: Cta = {
  label: 'Talk to us about investing',
  href: contactHref('I’d like to talk about investing in Phoenix Energy.', 'investor'),
};

/**
 * The link to the portfolio. /projects holds the projects published so far, a
 * subset of the company's track record, so the label names what the page holds
 * rather than promising all of them.
 */
export const PROJECTS_CTA: Cta = { label: 'View published projects', href: '/projects' };

/** The opening line each solution page's CTA writes into the form, in the visitor's words. */
const SERVICE_MESSAGE: Record<SolutionVertical, string> = {
  'ci-solar-storage': 'I’d like to book a discovery meeting about C&I solar and storage for my business.',
  wheeling: 'I’d like to book a free wheeling assessment for my business.',
  'energy-optimisation': 'I’d like to book a free energy audit of my facility.',
  'carbon-credits': 'I’d like to check whether our solar system is eligible for carbon credits.',
  webuysolar: 'I’d like to book a free WeBuySolar audit of my existing solar / battery system.',
  'ev-fleets': 'I’d like to book a free fleet assessment for our vehicles.',
};

const SERVICE_LABEL: Record<SolutionVertical, string> = {
  // The C&I process starts with a discovery meeting (How It Works, step 1).
  'ci-solar-storage': DISCOVERY_LABEL,
  // Starts with a consumption audit, tagged "Free assessment".
  wheeling: serviceCtaLabel('wheeling', 'assessment'),
  // Starts with an energy audit, tagged "Free"; the page calls it an energy audit throughout.
  'energy-optimisation': serviceCtaLabel('energy', 'audit'),
  // Starts with an eligibility check: the credits don't exist until we've checked.
  'carbon-credits': 'Check my eligibility',
  // Starts with the free expert audit (src/config/webuysolarOffer.ts).
  webuysolar: serviceCtaLabel('WeBuySolar', 'audit'),
  // Starts with a fleet assessment, tagged "Free".
  'ev-fleets': serviceCtaLabel('fleet', 'assessment'),
};

/** The CTA for each solution page: hero, tabs, How It Works and the footer band. */
export const SERVICE_CTA: Record<SolutionVertical, Cta> = Object.fromEntries(
  (Object.keys(SERVICE_LABEL) as SolutionVertical[]).map((v) => [
    v,
    { label: SERVICE_LABEL[v], href: contactHref(SERVICE_MESSAGE[v]) },
  ]),
) as Record<SolutionVertical, Cta>;

/** A case study's CTA: its service's label, with the project named in the message. */
export function projectCta(vertical: SolutionVertical, projectTitle: string): Cta {
  return {
    label: SERVICE_LABEL[vertical],
    href: contactHref(`${SERVICE_MESSAGE[vertical]} I read about your ${projectTitle} project.`),
  };
}
