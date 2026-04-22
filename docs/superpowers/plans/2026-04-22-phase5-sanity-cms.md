# Sanity CMS Setup — Phase 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the fully-built Phoenix Energy website to a live Sanity project so dynamic content (blog posts, projects, and team members) appears on the site.

**Architecture:** Schemas, GROQ queries, TypeScript types, and the Sanity client are all pre-built — no changes needed. Phase 5 has three workstreams: (1) manual Sanity project creation by the developer (Tasks 1 and 5); (2) three code tasks that complete the integration (Tasks 2–4); and (3) content seeding to verify the full data flow (Task 6). Tasks 2–4 can be executed in any order but Task 1 must happen first so the dev server has a real project ID.

**Tech Stack:** Sanity v5, next-sanity v12, @sanity/image-url v2, @sanity/vision v5, Next.js 14 App Router ISR (`revalidate: 3600` + on-demand via webhook), TypeScript strict.

---

### Task 1: Create the Sanity project and fill environment variables (manual)

**Files:**
- Modify: `.env.local`

This task has no code — it must be completed before Tasks 2–4 will produce a working integration.

- [ ] **Step 1: Create a Sanity account and project**

Go to https://www.sanity.io/manage → sign up or log in → "Create new project" → name: `Phoenix Energy` → dataset name: `production` → free plan → confirm.

- [ ] **Step 2: Copy the Project ID**

Sanity dashboard → your Phoenix Energy project → Settings → API. Copy the **Project ID** (8-character string, e.g. `abc123de`).

- [ ] **Step 3: Create an API token**

Same page → Tokens section → "Add API token" → name: `Next.js Server` → permissions: `Viewer` → Save → copy the token immediately (shown only once).

- [ ] **Step 4: Generate a REVALIDATE_SECRET**

Run in a terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the 64-character hex string output.

- [ ] **Step 5: Fill in .env.local**

Open `.env.local` at the project root. Add/update these four lines:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<paste Project ID here>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<paste API token here>
REVALIDATE_SECRET=<paste generated secret here>
```

- [ ] **Step 6: Configure CORS origins**

Sanity dashboard → Settings → API → CORS Origins → "Add CORS origin" twice:
- `http://localhost:3000` — allow credentials: no
- `https://phoenixenergy.solutions` — allow credentials: no

- [ ] **Step 7: Restart dev server**

Stop `npm run dev`, then restart it to pick up the new env vars.

- [ ] **Verify**

Visit `http://localhost:3000/studio` — the Sanity Studio interface should load without an error banner. (It will show empty document lists — that's expected before content is seeded.)

---

### Task 2: Fix and extend the revalidation webhook route

**Files:**
- Modify: `src/app/api/revalidate/route.ts`

The existing route has two problems:
1. It only handles `blogPost` and `author` — changes to `project` and `teamMember` documents never trigger revalidation.
2. The slug is parsed with `typeof raw.slug === 'string'`, but Sanity webhook payloads send slug as an object `{ _type: "slug", current: "the-value" }`, so this check always fails and per-slug revalidation never fires.

This task fixes both issues.

- [ ] **Step 1: Replace the revalidate route**

Open `src/app/api/revalidate/route.ts` and replace its entire contents with:

```typescript
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output (exit 0).

- [ ] **Step 3: Smoke-test auth rejection**

With the dev server running:

```bash
curl -s -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrongsecret" \
  -d '{"_type":"blogPost","slug":{"current":"test"}}'
```

Expected: `{"error":"Unauthorized"}` and HTTP 401.

- [ ] **Step 4: Smoke-test project revalidation**

Read REVALIDATE_SECRET from .env.local and run:

```bash
SECRET=$(grep REVALIDATE_SECRET .env.local | cut -d= -f2)
curl -s -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SECRET" \
  -d '{"_type":"project","slug":{"current":"shoprite-dc"}}'
```

Expected: `{"revalidated":true,"type":"project","slug":"shoprite-dc","timestamp":"..."}`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/revalidate/route.ts
git commit -m "fix: extend revalidate webhook for project/teamMember; fix Sanity slug object parsing"
```

---

### Task 3: Sanity Studio custom structure

**Files:**
- Modify: `sanity.config.ts`

Without a custom structure the Studio shows all document types in an unsorted flat list. This task organises it into three logical sections — Blog, Portfolio, Team — so the client can navigate intuitively.

- [ ] **Step 1: Replace sanity.config.ts**

Replace the entire contents of `sanity.config.ts` with:

```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'phoenix-energy',
  title: 'Phoenix Energy',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.documentTypeListItem('blogPost').title('Blog Posts'),
                    S.documentTypeListItem('author').title('Authors'),
                  ]),
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.divider(),
            S.documentTypeListItem('teamMember').title('Team Members'),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 2: Verify Studio structure**

Visit `http://localhost:3000/studio`. The left sidebar should show:
- Blog (expandable → Blog Posts, Authors)
- — divider —
- Projects
- — divider —
- Team Members

- [ ] **Step 3: Commit**

```bash
git add sanity.config.ts
git commit -m "feat: add custom Sanity Studio structure (Blog / Projects / Team Members)"
```

---

### Task 4: Dynamic sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

Next.js 14 App Router generates `/sitemap.xml` and `/robots.txt` from these files. The sitemap includes all static routes plus dynamic blog post and project URLs fetched from Sanity. If Sanity is unavailable (e.g. project ID not yet set), dynamic routes are skipped gracefully so the build doesn't fail.

- [ ] **Step 1: Create src/app/sitemap.ts**

```typescript
// src/app/sitemap.ts
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
```

- [ ] **Step 2: Create src/app/robots.ts**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    ],
    sitemap: 'https://phoenixenergy.solutions/sitemap.xml',
  };
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output (exit 0).

- [ ] **Step 4: Verify sitemap and robots**

With the dev server running:

```
http://localhost:3000/sitemap.xml
```

Expected: valid XML containing at minimum the 14 static URLs. Dynamic routes appear only after Sanity is connected and content is seeded.

```
http://localhost:3000/robots.txt
```

Expected:
```
User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/

Sitemap: https://phoenixenergy.solutions/sitemap.xml
```

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add dynamic sitemap.ts and robots.ts"
```

---

### Task 5: Configure the Sanity webhook (manual)

**Files:** none (Sanity dashboard configuration only)

This task must be completed after Task 1 (you need a live project) and after deploying to Vercel (you need a public URL for the webhook). For local testing, use a tunnelling tool like ngrok.

- [ ] **Step 1: Open Sanity webhook settings**

Go to https://www.sanity.io/manage → Phoenix Energy project → API → Webhooks → "Create webhook".

- [ ] **Step 2: Fill in the webhook form**

| Field | Value |
|---|---|
| Name | `Next.js ISR Revalidation` |
| URL | `https://phoenixenergy.solutions/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | *(leave blank — fires on all document types)* |
| Projection | *(leave blank — sends full document)* |
| HTTP method | POST |
| HTTP headers | Add header: `Authorization` = `Bearer <your REVALIDATE_SECRET>` |

Click "Save".

- [ ] **Step 3: Test delivery**

In Sanity Studio, open any document → make a trivial change → Publish. Then in the Sanity dashboard → Webhooks → click the webhook → "Recent deliveries". You should see a `200 OK` response with `{"revalidated":true,...}`.

---

### Task 6: Seed initial content (manual)

**Files:** none (content entry in Sanity Studio at `http://localhost:3000/studio`)

Create the minimum documents needed to verify the full data flow: CMS → GROQ query → Next.js page render.

- [ ] **Step 1: Create an Author document**

Studio → Blog → Authors → "+" → Create new:
- **Name:** `Phoenix Energy`
- **Slug:** click "Generate" → `phoenix-energy`
- **Role:** `Phoenix Energy Team`
- **Photo:** upload any placeholder image; alt text: `Phoenix Energy team`

Click Publish.

- [ ] **Step 2: Create a Blog Post document**

Studio → Blog → Blog Posts → "+" → Create new:
- **Title:** `Welcome to Phoenix Energy`
- **Slug:** Generate → `welcome-to-phoenix-energy`
- **Author:** select `Phoenix Energy` (from Step 1)
- **Published at:** today's datetime
- **Category:** `Company News`
- **Hero image:** upload a placeholder; alt text: `Phoenix Energy solar installation`
- **Excerpt:** `Phoenix Energy is a leading commercial energy solutions provider in South Africa, delivering measurable savings across solar, wheeling, carbon credits, and more.`
- **Read time:** `2`
- **Body:** add one Normal paragraph block: `Phoenix Energy helps commercial and industrial clients reduce energy costs and carbon footprint across Southern Africa.`

Click Publish.

- [ ] **Step 3: Create a Team Member document**

Studio → Team Members → "+" → Create new:
- **Name:** `Ricardo De Sousa`
- **Role:** `Co-Founder`
- **Category:** `Founders`
- **Archetype:** `The Innovator`
- **Display order:** `2`
- **Active:** checked
- **Photo:** upload a placeholder portrait; alt text: `Ricardo De Sousa, Co-Founder`

Click Publish.

- [ ] **Step 4: Create a Project document**

Studio → Projects → "+" → Create new:
- **Project title:** `Shoprite DC Rooftop Solar`
- **Slug:** Generate → `shoprite-dc-rooftop-solar`
- **Solution vertical:** `C&I Solar & Storage`
- **Featured on homepage:** checked
- **Location:** `Centurion, Gauteng`
- **Client name:** `Shoprite Holdings`
- **System size:** `4.8 MW`
- **Completion date:** `Q3 2024`
- **Project value:** `R42M`
- **Status:** `completed`
- **Hero image:** upload a placeholder; alt text: `Shoprite rooftop solar array, Centurion`
- **Project summary:** `Phoenix Energy designed and installed a 4.8 MW rooftop solar system at Shoprite's Centurion distribution centre, delivering significant savings on grid consumption.`
- **Stats strip metrics:** add 2 items:
  - `{ value: "4.8 MW", label: "System Size" }`
  - `{ value: "R8.4M", label: "Annual Saving" }`

Click Publish.

- [ ] **Step 5: Verify data appears on the site**

Restart the dev server (ISR cache needs clearing on first run), then check:

| URL | What you should see |
|---|---|
| `http://localhost:3000/blog` | "Welcome to Phoenix Energy" article card |
| `http://localhost:3000/blog/welcome-to-phoenix-energy` | Full post renders with author card |
| `http://localhost:3000/about` | "Ricardo De Sousa" card in the team grid |
| `http://localhost:3000/projects` | "Shoprite DC Rooftop Solar" project card |
| `http://localhost:3000/sitemap.xml` | Includes `/blog/welcome-to-phoenix-energy` and `/projects/shoprite-dc-rooftop-solar` |

If any page shows an error instead of content, check the browser console and the terminal running `npm run dev` for the GROQ query error message. The most common cause is a missing or incorrect `NEXT_PUBLIC_SANITY_PROJECT_ID`.
