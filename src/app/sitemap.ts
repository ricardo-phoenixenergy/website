import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';
import { ALL_PROJECT_SLUGS_QUERY, ALL_BLOG_SLUGS_QUERY } from '@/lib/queries';

const BASE = 'https://phoenixenergy.solutions';

const STATIC_PAGES = [
  { url: '/', priority: 1.0, changeFrequency: 'monthly' as const },
  { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/projects', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/tools', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/tools/solar-asset-valuation', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/solutions', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/solutions/ci-solar-storage', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/solutions/wheeling', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/solutions/energy-optimisation', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/solutions/carbon-credits', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/solutions/webuysolar', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/solutions/ev-fleets', priority: 0.9, changeFrequency: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projectSlugs: { slug: string }[] = [];
  let blogSlugs: { slug: string }[] = [];

  try {
    [projectSlugs, blogSlugs] = await Promise.all([
      sanityClient.fetch<{ slug: string }[]>(ALL_PROJECT_SLUGS_QUERY),
      sanityClient.fetch<{ slug: string }[]>(ALL_BLOG_SLUGS_QUERY),
    ]);
  } catch {
    // Sanity not yet configured — return static pages only
  }

  return [
    ...STATIC_PAGES.map(({ url, priority, changeFrequency }) => ({
      url: `${BASE}${url}`,
      changeFrequency,
      priority,
    })),
    ...projectSlugs.map(({ slug }) => ({
      url: `${BASE}/projects/${slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...blogSlugs.map(({ slug }) => ({
      url: `${BASE}/blog/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
