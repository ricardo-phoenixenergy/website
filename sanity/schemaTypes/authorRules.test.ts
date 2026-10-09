// The author's LinkedIn field accepts only a full profile address, because it
// feeds the profile link and the structured data's sameAs.
import { describe, expect, it } from 'vitest';
import { LINKEDIN_URL_MESSAGE, linkedinUrlError } from './authorRules';

describe('linkedinUrlError', () => {
  it('accepts a full profile address, with or without www and a closing slash', () => {
    expect(linkedinUrlError('https://www.linkedin.com/in/ricardo-de-sousa-za')).toBe(true);
    expect(linkedinUrlError('https://linkedin.com/in/ricardo_de_sousa/')).toBe(true);
  });

  it('accepts an empty field: the profile is optional', () => {
    expect(linkedinUrlError(undefined)).toBe(true);
    expect(linkedinUrlError('')).toBe(true);
  });

  it('rejects an address without /in/, a company page, plain http and query strings', () => {
    for (const bad of [
      'https://linkedIn.com/ricardo-de-sousa-za',
      'https://www.linkedin.com/ricardo-de-sousa-za',
      'https://www.linkedin.com/company/phoenix-energy-solutions',
      'http://www.linkedin.com/in/ricardo-de-sousa-za',
      'https://www.linkedin.com/in/ricardo-de-sousa-za?utm_source=share',
    ]) {
      expect(linkedinUrlError(bad)).toBe(LINKEDIN_URL_MESSAGE);
    }
  });
});
