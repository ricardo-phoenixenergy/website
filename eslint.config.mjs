import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The project queries in src/lib/queries.ts. Only src/lib/projectData.ts may
// import them, so every read gets the same tidying (incomplete figure rows
// dropped) and the same order (docs/superpowers/specs/2026-09-29-project-page-design.md,
// "One module for every read"). The two test files that check the queries and
// the reads are the only other exceptions.
const PROJECT_QUERIES = [
  "ALL_PROJECTS_QUERY",
  "FEATURED_PROJECTS_QUERY",
  "PROJECTS_BY_VERTICAL_QUERY",
  "PROJECT_BY_SLUG_QUERY",
  "ALL_PROJECT_SLUGS_QUERY",
  "PROJECT_SITEMAP_QUERY",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}", "sanity/**/*.ts"],
    ignores: ["src/lib/projectData.ts", "src/lib/projectData.test.ts", "src/lib/queries.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "(^|/)queries$",
              importNames: PROJECT_QUERIES,
              message: "Read projects through src/lib/projectData.ts, which tidies and orders every read.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
