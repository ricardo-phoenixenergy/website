// src/config/webuysolarOffer.ts
// The WeBuySolar offer in one place: who qualifies, how fast we respond, and the
// steps from audit to acquisition. The WeBuySolar page and the valuation request
// tool both render from here, so they can't promise different things.
//
// Source: the WeBuySolar page as reworked in June 2026 (EaaS redesign), which is
// newer than the tool's old "buyback" wording and its "formal written offer within
// 5 business days" (both carried over from the April 2026 tools spec).
// The deal is an acquisition (never "buyback"); the valuation arrives with the
// preliminary offer, after the free audit. Confirm with the WeBuySolar team.
// The reply window is the site-wide promise (src/config/contact.ts). The claims
// register (src/config/claims.ts) reads the audit report time from here.
import { REPLY_PROMISE } from '@/config/contact';

/** How long the written audit report takes (claims register: webuysolar-audit-report-time). */
export const AUDIT_REPORT_TIME = 'within 10 business days';

export interface WebuysolarStep {
  label: string;
  description: string;
  tag?: string;
}

interface WebuysolarOffer {
  /** Who qualifies. Shown beside the page's valuation CTA, in its FAQ and on the tool. */
  eligibility: string;
  /** How a valuation request is answered (the site-wide enquiry response time). */
  firstContact: string;
  /**
   * The process, audit to acquisition, as the page's How It Works shows it. The
   * tool lists the first two after `firstContact`. "Preliminary offer & valuation"
   * names the offer (the old "formal written offer" is retired).
   */
  steps: WebuysolarStep[];
}

export const WEBUYSOLAR_OFFER: WebuysolarOffer = {
  // A no-break space keeps "Tier 1" on one line.
  eligibility: 'We acquire systems built on BloombergNEF Tier 1 equipment, with or without battery storage.',
  firstContact: `A WeBuySolar specialist reviews your details and contacts you ${REPLY_PROMISE.window} to book your free audit.`,
  steps: [
    {
      label: 'Free expert audit',
      description: `On-site inspection: drone scan, string-level review, inverter config audit, opportunity mapping. Written report ${AUDIT_REPORT_TIME}.`,
      tag: 'Free · no obligation',
    },
    {
      label: 'Preliminary offer & valuation',
      description: 'Fair market valuation, indicative PPA or lease, and a forecasted savings model with an optimisation roadmap.',
      tag: 'Indicative',
    },
    {
      label: 'Due diligence',
      description: 'At our cost: financials, asset docs, contracts, operational data.',
      tag: 'At our cost',
    },
    {
      label: 'Final offer & contracting',
      description: 'Binding term sheet, PPA/lease and sale agreement. Either side can step back here, no obligation.',
      tag: 'No obligation',
    },
    {
      label: 'Acquisition & handover',
      description: 'Ownership transfers, the acquisition value is paid out, and we take operational responsibility from day one with monthly reporting. Settlement on the agreed date in the sale agreement.',
      tag: 'Settlement on agreed date',
    },
    {
      label: 'Ongoing optimisation',
      description: 'We operate and upgrade as economics evolve. Each upgrade is justified by its own ROI; none committed upfront.',
      tag: 'ROI-justified',
    },
  ],
};
