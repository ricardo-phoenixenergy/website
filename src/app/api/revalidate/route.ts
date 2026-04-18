import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { type, slug } = body as { type?: string; slug?: string };

  switch (type) {
    case 'blogPost':
      revalidatePath('/blog');
      revalidatePath('/');
      if (slug) revalidatePath(`/blog/${slug}`);
      break;
    case 'project':
      revalidatePath('/');
      revalidatePath('/projects');
      if (slug) revalidatePath(`/projects/${slug}`);
      break;
    case 'teamMember':
      revalidatePath('/about');
      break;
    case 'author':
      revalidatePath('/blog');
      if (slug) revalidatePath(`/blog/authors/${slug}`);
      break;
    default:
      return NextResponse.json({ error: 'Unknown document type' }, { status: 400 });
  }

  return NextResponse.json({ revalidated: true, type, slug });
}
