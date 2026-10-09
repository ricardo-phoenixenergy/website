// The checks behind the author form. The LinkedIn address feeds the author
// card's profile link and the structured data's sameAs, so it must be a full
// profile address: an address without /in/ opens a LinkedIn error page.

const LINKEDIN_PROFILE = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/;

export const LINKEDIN_URL_MESSAGE = 'Use your full profile URL, e.g. https://www.linkedin.com/in/your-name';

/** True when the field is empty or holds a full profile address; otherwise the message. */
export function linkedinUrlError(value: string | undefined): true | string {
  if (!value) return true;
  return LINKEDIN_PROFILE.test(value) ? true : LINKEDIN_URL_MESSAGE;
}
