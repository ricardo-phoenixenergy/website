'use client';

// "Copy link" as a text action with the link icon, on a 44px target. It copies
// the address it's given (a page's canonical URL) and reads "Link copied" for
// three seconds, announced through a polite live region. Where the browser
// refuses (no Clipboard API, or permission denied), a read-only field holding
// the address appears on its own line, focused and selected, so the visitor can
// copy it themselves. It renders a fragment: inside a wrapping flex row, that
// field falls onto a line under the row (PageBreadcrumb).
import { useEffect, useId, useRef, useState } from 'react';
import { IconCheck, IconLink } from './Icons';
import { arrowLinkClasses } from './buttonStyles';

type CopyState = 'idle' | 'copied' | 'failed';

const COPIED_MS = 3000;

export function CopyLinkButton({ url }: { url: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const fieldRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  useEffect(() => {
    if (state === 'copied') {
      const timer = window.setTimeout(() => setState('idle'), COPIED_MS);
      return () => window.clearTimeout(timer);
    }
    if (state === 'failed') {
      fieldRef.current?.focus();
      fieldRef.current?.select();
    }
  }, [state]);

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(url);
      setState('copied');
    } catch {
      setState('failed');
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className={arrowLinkClasses({ className: 'min-h-11 shrink-0' })}>
        {state === 'copied' ? <IconCheck size={16} className="size-4" /> : <IconLink size={16} className="size-4" />}
        {state === 'copied' ? 'Link copied' : 'Copy link'}
      </button>
      <span role="status" className="sr-only">
        {state === 'copied' ? 'Link copied' : ''}
      </span>
      {state === 'failed' && (
        <div className="basis-full">
          <label htmlFor={fieldId} className="block font-body text-xs text-pe-muted">
            Copy the link from this box.
          </label>
          <input
            id={fieldId}
            ref={fieldRef}
            type="text"
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1 w-full rounded-lg border border-pe-control-border bg-white px-3 py-2 font-body text-sm text-pe-text"
          />
        </div>
      )}
    </>
  );
}
