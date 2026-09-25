// src/lib/wheeling/enquiry.ts
// What the eligibility check writes into the contact form: the visitor's
// situation in their own words, then what the check told them.
import { supplyPointById } from '@/config/wheelingSupplyPoints';
import type { WheelingOutcome, WheelingTou } from './types';

/** The wheeling models each eligible result offers, in order. */
export const ELIGIBLE_MODELS: Record<'eskom' | 'virtual', { anchor: string; label: string }[]> = {
  eskom: [
    { anchor: 'model-direct', label: 'Direct Wheeling' },
    { anchor: 'model-micro', label: 'Micro-Wheeling' },
  ],
  virtual: [{ anchor: 'model-virtual', label: 'Virtual Wheeling' }],
};

const TOU_PHRASE: Record<WheelingTou, string> = {
  yes: 'on a Time-of-Use tariff',
  no: 'not on a Time-of-Use tariff',
  unsure: 'not sure whether we are on a Time-of-Use tariff',
};

/**
 * "We're billed by Eskom (direct) and are …". An unlisted supplier has no name
 * to put in that sentence, so it gets one of its own.
 */
export function wheelingSituation(supplyPointId: string, tou: WheelingTou | null): string {
  const sp = supplyPointById(supplyPointId);
  if (!sp || sp.model === 'unlisted') return "Our supplier isn't on your list, or we're not sure who it is.";
  return `We're billed by ${sp.label}${tou ? ` and are ${TOU_PHRASE[tou]}` : ''}.`;
}

/** The contact form message for a result: only what the visitor said, and what the check said. */
export function wheelingEnquiry(outcome: WheelingOutcome, supplyPointId: string, tou: WheelingTou | null): string {
  const intro = `I checked wheeling eligibility on your site. ${wheelingSituation(supplyPointId, tou)}`;
  switch (outcome.status) {
    case 'eskom':
    case 'virtual':
      return `${intro} It said we're eligible for ${ELIGIBLE_MODELS[outcome.status].map((m) => m.label).join(' or ')}. I'd like to book a free wheeling assessment.`;
    case 'needs-check':
      return `${intro} It said one of our electricity bills will show whether we can wheel. I'd like to book a free wheeling assessment.`;
    case 'not-eligible-tou':
    case 'not-available':
      return `${intro} It said wheeling isn't an option for us yet. I'd like to talk about what we can do instead.`;
  }
}
