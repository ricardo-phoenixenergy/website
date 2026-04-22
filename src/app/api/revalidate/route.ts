// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { slug?: string; _type?: string };

    if (body._type === 'blogPost' && body.slug) {
      revalidatePath(`/blog/${body.slug}`);
    }
    revalidatePath('/blog');

    return Response.json({ revalidated: true, timestamp: new Date().toISOString() });
  } catch {
    return Response.json(
      { revalidated: false, error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
