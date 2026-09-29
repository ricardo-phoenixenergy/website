// The lint rule that keeps every project read in src/lib/projectData.ts, where
// the consent rules apply. It lints made-up files with the repo's own
// eslint.config.mjs, so it tests the rule as `npx eslint` runs it.
import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';

const eslint = new ESLint({ cwd: process.cwd() });

async function restrictedImports(filePath: string, code: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.filter((message) => message.ruleId === 'no-restricted-imports').map((message) => message.message);
}

describe('the project queries lint rule', () => {
  it('stops a component importing a project query', async () => {
    const messages = await restrictedImports(
      'src/components/project/Example.tsx',
      "import { PROJECT_BY_SLUG_QUERY } from '@/lib/queries';\nexport const query = PROJECT_BY_SLUG_QUERY;\n",
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('src/lib/projectData.ts');
  }, 60_000);

  it('catches a relative path and a namespace import too', async () => {
    expect(await restrictedImports('src/lib/example.ts', "import { ALL_PROJECTS_QUERY } from './queries';\nexport const query = ALL_PROJECTS_QUERY;\n")).toHaveLength(1);
    expect(await restrictedImports('src/app/example.ts', "import * as queries from '@/lib/queries';\nexport const all = queries;\n")).toHaveLength(1);
    expect(await restrictedImports('sanity/schemaTypes/example.ts', "import { PROJECT_SITEMAP_QUERY } from '../../src/lib/queries';\nexport const query = PROJECT_SITEMAP_QUERY;\n")).toHaveLength(1);
  }, 60_000);

  it('lets any file import the other queries, and projectData.ts import the project ones', async () => {
    expect(await restrictedImports('src/app/about/page.tsx', "import { TEAM_MEMBERS_QUERY } from '@/lib/queries';\nexport const query = TEAM_MEMBERS_QUERY;\n")).toEqual([]);
    expect(await restrictedImports('src/lib/projectData.ts', "import { PROJECT_BY_SLUG_QUERY } from '@/lib/queries';\nexport const query = PROJECT_BY_SLUG_QUERY;\n")).toEqual([]);
  }, 60_000);
});
