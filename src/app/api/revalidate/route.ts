// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const authHeader = req.headers.get('authorization');
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const raw = await req.json();
    const type = typeof raw._type === 'string' ? raw._type : undefined;
    const slug = typeof raw.slug === 'string' ? raw.slug : undefined;

    if (type === 'blogPost') {
      if (slug) revalidatePath(`/blog/${slug}`);
      revalidatePath('/blog');
    }

    if (type === 'author' && slug) {
      revalidatePath(`/blog/authors/${slug}`);
    }

    return Response.json({ revalidated: true, timestamp: new Date().toISOString() });
  } catch {
    return Response.json(
      { revalidated: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
