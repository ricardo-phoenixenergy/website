'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BlogSearchInputProps {
  defaultValue?: string;
}

export function BlogSearchInput({ defaultValue = '' }: BlogSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [value, setValue] = useState(defaultValue);
  // The URL's query as this input last saw it, and whether the visitor is in the field.
  const [seenQuery, setSeenQuery] = useState(urlQuery);
  const [typing, setTyping] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputId = useId();

  // A new query in the URL (Back, a filter, a link) replaces the text, except
  // while the visitor is typing: a navigation for an earlier pause that lands
  // late must never overwrite what they have typed since. Adjusted during
  // render when the URL changes, rather than copied in an effect.
  if (urlQuery !== seenQuery) {
    setSeenQuery(urlQuery);
    if (!typing) setValue(urlQuery);
  }

  // A search still waiting when the page changes is dropped, so it can't pull
  // the visitor back to the blog.
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const push = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set('q', q);
      } else {
        params.delete('q');
      }
      params.delete('page');
      const qs = params.toString();
      // replace, not push: each pause while typing shouldn't add a history entry.
      router.replace(qs ? `/blog?${qs}` : '/blog', { scroll: false });
    },
    [router, searchParams],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push(next), 400);
  };

  return (
    <div role="search" className="relative w-full lg:w-1/3 shrink-0">
      <label htmlFor={inputId} className="sr-only">Search articles</label>
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pe-muted"
        width={14}
        height={14}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <input
        id={inputId}
        type="search"
        placeholder="Search articles..."
        value={value}
        onChange={handleChange}
        onFocus={() => setTyping(true)}
        onBlur={() => setTyping(false)}
        className="w-full font-body text-sm text-pe-text rounded-full outline-none"
        style={{
          border: '1px solid var(--color-pe-control-border)',
          background: '#fff',
          padding: '10px 16px 10px 38px',
        }}
      />
    </div>
  );
}
