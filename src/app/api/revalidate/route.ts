// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { SOLUTION_VERTICALS } from '@/types/solutions';

function extractSlug(raw: unknown): string | undefined {
  if (typeof raw === 'string') return raw;
  if (raw !== null && typeof raw === 'object' && 'current' in raw) {
    const val = (raw as { current: unknown }).current;
    return typeof val === 'string' ? val : undefined;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const authHeader = req.headers.get('authorization');
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ revalidated: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return Response.json({ revalidated: false, error: 'Expected JSON object' }, { status: 400 });
  }

  const type = typeof raw._type === 'string' ? raw._type : undefined;
  const slug = extractSlug(raw.slug);
  const id = typeof raw._id === 'string' ? raw._id : undefined;

  if (type === 'blogPost') {
    // A post shows on its own page and beside related posts, on /blog, on home,
    // on its author's page and in its services' related articles, and the
    // sitemap lists it.
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/blog');
    revalidatePath('/');         // homepage shows latest posts
    revalidatePath('/blog/authors/[slug]', 'page');
    for (const vertical of SOLUTION_VERTICALS) revalidatePath(`/solutions/${vertical}`);
    revalidatePath('/sitemap.xml');
  }

  if (type === 'author') {
    // An author's name, role and photo show on their page and on each of their
    // posts, and the sitemap lists their page once they have a post.
    revalidatePath('/blog/authors/[slug]', 'page');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/sitemap.xml');
  }

  if (type === 'project') {
    // A project shows on its own page, on other projects' pages (the next
    // project cards), on /projects, on home and on its service's solution page,
    // and a change can move it to another service. Refreshing them all makes a
    // consent switch turned off take effect everywhere at once
    // (docs/superpowers/specs/2026-09-29-project-page-design.md, "Revalidation").
    // The sitemap is refreshed too.
    revalidatePath('/projects/[slug]', 'page');
    revalidatePath('/projects');
    revalidatePath('/');         // homepage shows featured projects
    for (const vertical of SOLUTION_VERTICALS) revalidatePath(`/solutions/${vertical}`);
    revalidatePath('/sitemap.xml');
  }

  if (type === 'teamMember') {
    revalidatePath('/about');
  }

  if (type === 'partner') {
    revalidatePath('/about');
    revalidatePath('/');         // homepage AboutTrust also lists partners
  }

  if (type === 'companyStats') {
    revalidatePath('/');         // home CTA footer stats
    revalidatePath('/about');    // About "at a glance" stats
  }

  if (type === 'howItWorks' && id) {
    const key = id.replace(/^drafts\./, '').replace(/^howItWorks\./, '');
    if (key === 'home') {
      revalidatePath('/');
    } else {
      revalidatePath(`/solutions/${key}`);
    }
  }

  if (type === 'heroImages') {
    revalidatePath('/');
    revalidatePath('/solutions');   // overview page cards also use the hero images
    for (const v of SOLUTION_VERTICALS) {
      revalidatePath(`/solutions/${v}`);
    }
  }

  if (type === 'energyPrices') {
    revalidatePath('/solutions/ev-fleets');   // EV Fleets cost-per-km comparator prices
  }

  return Response.json({
    revalidated: true,
    type,
    slug,
    timestamp: new Date().toISOString(),
  });
}
