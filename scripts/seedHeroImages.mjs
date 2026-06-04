import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* env may already be set */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// field name -> public file
const MAP = {
  ciSolarStorage: 'hero-solar.png',
  wheeling: 'hero-wheeling.png',
  energyOptimisation: 'hero-optimisation.png',
  carbonCredits: 'hero-carbon.png',
  webuysolar: 'hero-webuysolar.png',
  evFleets: 'hero-ev.png',
};

const run = async () => {
  const doc = { _id: 'heroImages', _type: 'heroImages' };
  for (const [field, file] of Object.entries(MAP)) {
    const buffer = readFileSync(new URL(`../public/${file}`, import.meta.url));
    const asset = await client.assets.upload('image', buffer, { filename: file });
    doc[field] = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    console.log('uploaded', file, '->', asset._id);
  }
  await client.createOrReplace(doc);
  console.log('created heroImages doc with', Object.keys(MAP).length, 'images.');
};

run().catch((e) => { console.error(e); process.exit(1); });
