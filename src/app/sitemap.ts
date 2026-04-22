import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity';

const SITE = 'https://phoenixenergy.solutions';

export const revalidate = 3600;

const STATIC: MetadataRoute.Sitemap = [
  { url: SITE,                                          priority: 1.0, changeFrequency: 'weekly' },
  { url: `${SITE}/about`,                               priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/contact`,                             priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions`,                           priority: 0.9, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions/ci-solar-storage`,          priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions/wheeling`,                  priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions/energy-optimisation`,       priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions/carbon-credits`,            priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions/webuysolar`,                priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/solutions/ev-fleets`,                 priority: 0.8, changeFrequency: 'monthly' },
  { url: `${SITE}/projects`,                            priority: 0.8, changeFrequency: 'weekly' },
  { url: `${SITE}/blog`,                                priority: 0.8, changeFrequency: 'weekly' },
  { url: `${SITE}/tools`,                               priority: 0.7, changeFrequency: 'monthly' },
  { url: `${SITE}/tools/solar-valuation`,               priority: 0.7, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: { slug: string; publishedAt?: string }[] = [];
  let projectEntries: { slug: string }[] = [];

  try {
    blogEntries = await sanityClient.fetch<{ slug: string; publishedAt?: string }[]>(
      `*[_type == "blogPost"]{ "slug": slug.current, publishedAt }`,
    );
  } catch {
    // Sanity not yet configured — skip dynamic blog routes
  }

  try {
    projectEntries = await sanityClient.fetch<{ slug: string }[]>(
      `*[_type == "project"]{ "slug": slug.current }`,
    );
  } catch {
    // Sanity not yet configured — skip dynamic project routes
  }

  const blogRoutes: MetadataRoute.Sitemap = blogEntries.map(({ slug, publishedAt }) => ({
    url: `${SITE}/blog/${slug}`,
    lastModified: publishedAt ? new Date(publishedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectEntries.map(({ slug }) => ({
    url: `${SITE}/projects/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...STATIC, ...blogRoutes, ...projectRoutes];
}
