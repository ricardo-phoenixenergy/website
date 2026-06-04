import 'server-only';
import { createClient } from 'next-sanity';

/**
 * Server-only Sanity client for data fetching (GROQ queries).
 *
 * Uses an API token and reads from the live API (useCdn: false) so freshly
 * published content is visible immediately — the anonymous/CDN read path lags
 * behind the authenticated API for newly-written documents, which previously
 * caused new content (partners, How It Works, etc.) not to appear on the site.
 *
 * `perspective: 'published'` ensures only published content is returned, never
 * unpublished drafts. The `import 'server-only'` guard makes the build fail if
 * this module is ever pulled into a client bundle (it carries the token).
 *
 * `urlFor` and the public, token-less client stay in `@/lib/sanity` for image
 * URLs and any client-side use.
 */
export const sanityServerClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
});
