import type { MetadataRoute } from 'next';
import { sanityServerClient } from '@/lib/sanity.server';
import { getProjectSitemapEntries, type ProjectSitemapEntry } from '@/lib/projectData';
import { AUTHOR_SITEMAP_QUERY, BLOG_SITEMAP_QUERY } from '@/lib/queries';
import { SITE_URL as SITE } from '@/lib/seo';

// Rebuilt at least hourly, and at once when the webhook (src/app/api/revalidate/route.ts) reports a post, author or project change.
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
  { url: `${SITE}/tools`,                               priority: 0.7, changeFrequency: 'monthly' },
  { url: `${SITE}/tools/solar-valuation`,               priority: 0.7, changeFrequency: 'monthly' },
  { url: `${SITE}/privacy-policy`,        priority: 0.3, changeFrequency: 'yearly' as const },
  { url: `${SITE}/terms-of-use`,          priority: 0.3, changeFrequency: 'yearly' as const },
  { url: `${SITE}/disclaimer`,            priority: 0.3, changeFrequency: 'yearly' as const },
];

interface DatedRow {
  slug: string | null;
  lastModified: string | null;
}

/** Rows from the CMS, or none when it can't be reached. */
async function datedRows(query: string): Promise<DatedRow[]> {
  try {
    return (await sanityServerClient.fetch<DatedRow[] | null>(query)) ?? [];
  } catch {
    return [];
  }
}

const dateOf = (value: string | null) => (value ? new Date(value) : undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projectEntries: ProjectSitemapEntry[] = [];

  try {
    // Every project page is indexed, so every project is listed.
    projectEntries = await getProjectSitemapEntries();
  } catch {
    // The CMS isn't reachable: leave out the project routes.
  }

  const [posts, authors] = await Promise.all([datedRows(BLOG_SITEMAP_QUERY), datedRows(AUTHOR_SITEMAP_QUERY)]);

  // The blog index and author pages are listed only once a post is live; until then they are noindex.
  const blogRoutes: MetadataRoute.Sitemap = posts.length === 0 ? [] : [
    { url: `${SITE}/blog`, priority: 0.8, changeFrequency: 'weekly' },
    ...posts.flatMap(({ slug, lastModified }) =>
      slug ? [{ url: `${SITE}/blog/${slug}`, lastModified: dateOf(lastModified), changeFrequency: 'weekly' as const, priority: 0.7 }] : [],
    ),
    ...authors.flatMap(({ slug, lastModified }) =>
      slug ? [{ url: `${SITE}/blog/authors/${slug}`, lastModified: dateOf(lastModified), changeFrequency: 'monthly' as const, priority: 0.5 }] : [],
    ),
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectEntries.map(({ slug, updatedAt }) => ({
    url: `${SITE}/projects/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...STATIC, ...blogRoutes, ...projectRoutes];
}
