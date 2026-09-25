import { describe, expect, it } from 'vitest';
import {
  CONTACT_CTA, DISCOVERY_BAND, DISCOVERY_CTA, INVESTOR_CTA, PARTNER_CTA, PROJECTS_CTA, SERVICE_CTA, VALUATION_CTA,
  projectCta, serviceCtaLabel,
} from '@/config/ctas';
import { REPLY_PROMISE } from '@/config/contact';
import { SOLUTION_VERTICALS, type SolutionVertical } from '@/types/solutions';

/** The only labels a CTA may carry, besides the service pattern. */
const FIXED = ['Get in touch', 'Book a discovery meeting', 'Check my eligibility', 'Request a valuation'];
const SERVICE_PATTERN = /^Book a free (?:[a-z]+|WeBuySolar) (?:assessment|audit)$/;

/** A word that names each service in its prefilled message. */
const NAMES: Record<SolutionVertical, RegExp> = {
  'ci-solar-storage': /C&I solar and storage/,
  wheeling: /wheeling/,
  'energy-optimisation': /energy audit/,
  'carbon-credits': /carbon credits/,
  webuysolar: /WeBuySolar/,
  'ev-fleets': /fleet assessment/,
};

function parse(href: string) {
  const url = new URL(href, 'https://phoenixenergy.solutions');
  return { path: url.pathname, intent: url.searchParams.get('intent'), message: url.searchParams.get('message') ?? '' };
}

describe('CTA set', () => {
  it('uses only the configured labels, in sentence case', () => {
    const labels = [CONTACT_CTA, DISCOVERY_CTA, VALUATION_CTA, ...Object.values(SERVICE_CTA)].map((c) => c.label);
    for (const label of labels) {
      expect(FIXED.includes(label) || SERVICE_PATTERN.test(label), label).toBe(true);
      // Sentence case: no capitalised word after the first, except the WeBuySolar name.
      const rest = label.split(' ').slice(1).filter((w) => w !== 'WeBuySolar');
      expect(rest.every((w) => w === w.toLowerCase()), label).toBe(true);
    }
  });

  it('builds the service pattern', () => {
    expect(serviceCtaLabel('wheeling', 'assessment')).toBe('Book a free wheeling assessment');
    expect(serviceCtaLabel('energy', 'audit')).toBe('Book a free energy audit');
  });

  it('opens step 2 of the form as a client, with a message naming the service', () => {
    for (const v of SOLUTION_VERTICALS) {
      const { path, intent, message } = parse(SERVICE_CTA[v].href);
      expect(path, v).toBe('/contact');
      expect(intent, v).toBe('client');
      expect(message, v).toMatch(NAMES[v]);
    }
    const discovery = parse(DISCOVERY_CTA.href);
    expect(discovery.intent).toBe('client');
    expect(discovery.message).toMatch(/discovery meeting/);
  });

  it('leaves the navbar entry open to every audience', () => {
    expect(CONTACT_CTA.href).toBe('/contact');
  });

  it('names the project and the service on a case study', () => {
    const cta = projectCta('ci-solar-storage', '31 Sacks Circle');
    expect(cta.label).toBe(SERVICE_CTA['ci-solar-storage'].label);
    const { message } = parse(cta.href);
    expect(message).toMatch(/31 Sacks Circle/);
    expect(message).toMatch(NAMES['ci-solar-storage']);
  });

  it('carries the reply promise in the company-level band', () => {
    expect(DISCOVERY_BAND.body).toContain(REPLY_PROMISE.sentence);
  });

  it('gives partners and investors their own step of the form, not the client one', () => {
    for (const [cta, want] of [[PARTNER_CTA, 'partner'], [INVESTOR_CTA, 'investor']] as const) {
      const { path, intent, message } = parse(cta.href);
      expect(path, cta.label).toBe('/contact');
      expect(intent, cta.label).toBe(want);
      expect(message, cta.label).not.toBe('');
      expect(message, cta.label).not.toMatch(/my business|discovery meeting/);
      const rest = cta.label.split(' ').slice(1);
      expect(rest.every((w) => w === w.toLowerCase()), cta.label).toBe(true);
    }
  });

  it('names what /projects holds rather than promising every project', () => {
    expect(PROJECTS_CTA).toEqual({ label: 'View published projects', href: '/projects' });
    expect(PROJECTS_CTA.label).not.toMatch(/\ball\b/i);
  });
});
