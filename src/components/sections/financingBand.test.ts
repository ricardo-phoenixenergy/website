import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FinancingBand } from './FinancingBand';

describe('FinancingBand', () => {
  it('carries the id that the project facts link to', () => {
    // The Financing row on a project page links to /solutions/{service}#financing (src/lib/projectFacts.ts).
    expect(renderToStaticMarkup(createElement(FinancingBand))).toMatch(/^<section id="financing" /);
  });
});
