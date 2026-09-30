import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const { revalidatePathMock } = vi.hoisted(() => ({ revalidatePathMock: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));

import { POST } from './route';

const SECRET = 'test-secret';
// The route reads only the headers and the JSON body, which a plain Request carries.
const webhook = (body: unknown, authorization = `Bearer ${SECRET}`) =>
  new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { authorization, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
const revalidated = () => revalidatePathMock.mock.calls.map((args: unknown[]) => args.join(' '));

const EVERY_PAGE_A_PROJECT_SHOWS_ON = [
  '/projects/[slug] page',
  '/projects',
  '/',
  '/solutions/ci-solar-storage',
  '/solutions/wheeling',
  '/solutions/energy-optimisation',
  '/solutions/carbon-credits',
  '/solutions/webuysolar',
  '/solutions/ev-fleets',
];

beforeEach(() => {
  vi.stubEnv('REVALIDATE_SECRET', SECRET);
  revalidatePathMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/revalidate', () => {
  it('refuses a request without the secret', async () => {
    const response = await POST(webhook({ _type: 'project' }, 'Bearer wrong'));
    expect(response.status).toBe(401);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it('refreshes every project page, /projects, home and the six solution pages when a project changes', async () => {
    const response = await POST(webhook({ _type: 'project', _id: 'abc', slug: { current: '31-sacks-circle' } }));
    expect(response.status).toBe(200);
    expect(revalidated()).toEqual(EVERY_PAGE_A_PROJECT_SHOWS_ON);
  });

  it('does the same for a project without a slug', async () => {
    await POST(webhook({ _type: 'project', _id: 'abc' }));
    expect(revalidated()).toEqual(EVERY_PAGE_A_PROJECT_SHOWS_ON);
  });

  it('leaves the project and solution pages alone when a blog post changes', async () => {
    await POST(webhook({ _type: 'blogPost', slug: { current: 'a-post' } }));
    expect(revalidated()).toEqual(['/blog/a-post', '/blog', '/']);
  });

  it('still refreshes every solution page when the hero images change', async () => {
    await POST(webhook({ _type: 'heroImages', _id: 'heroImages' }));
    expect(revalidated()).toEqual(['/', '/solutions', ...EVERY_PAGE_A_PROJECT_SHOWS_ON.slice(3)]);
  });
});
