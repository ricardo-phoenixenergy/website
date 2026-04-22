// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

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

  const type = typeof raw._type === 'string' ? raw._type : undefined;
  const slug = extractSlug(raw.slug);

  if (type === 'blogPost') {
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath('/blog');
    revalidatePath('/');         // homepage shows latest posts
  }

  if (type === 'author' && slug) {
    revalidatePath(`/blog/authors/${slug}`);
  }

  if (type === 'project') {
    if (slug) revalidatePath(`/projects/${slug}`);
    revalidatePath('/projects');
    revalidatePath('/');         // homepage shows featured projects
  }

  if (type === 'teamMember') {
    revalidatePath('/about');
  }

  return Response.json({
    revalidated: true,
    type,
    slug,
    timestamp: new Date().toISOString(),
  });
}
