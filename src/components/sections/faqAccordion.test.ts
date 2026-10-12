// FaqAccordion keeps every answer in the page: search engines and AI answers
// read them, and the FAQPage JSON-LD must describe text that is really there.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FaqAccordion } from './FaqAccordion';

const items = [
  { question: 'First?', answer: 'Answer one.' },
  { question: 'Second?', answer: 'Answer two.' },
  { question: 'Third?', answer: 'Answer three.' },
];
const markup = renderToStaticMarkup(createElement(FaqAccordion, { items }));
const dds = markup.match(/<dd[^>]*>[^<]*<\/dd>/g) ?? [];

describe('FaqAccordion', () => {
  it('puts every answer in the HTML, not only the open one', () => {
    expect(dds).toHaveLength(3);
    for (const a of ['Answer one.', 'Answer two.', 'Answer three.']) expect(markup).toContain(a);
  });

  it('opens the first answer and collapses the rest so find-in-page can still reveal them', () => {
    expect(dds[0]).not.toMatch(/hidden=/);
    // React 19.2 server markup is hidden=""; FaqAnswer sets until-found after hydration.
    expect(dds[1]).toMatch(/hidden=""/);
    expect(dds[2]).toMatch(/hidden=""/);
  });

  it('ties each question button to its answer', () => {
    const controls = [...markup.matchAll(/aria-controls="([^"]+)"/g)].map((m) => m[1]);
    expect(controls).toHaveLength(3);
    for (const id of controls) expect(markup).toContain(`id="${id}"`);
  });

  it('still describes every answer in FAQPage JSON-LD', () => {
    expect(markup).toContain('"@type":"FAQPage"');
    expect(markup).toContain('Answer three.');
  });
});
