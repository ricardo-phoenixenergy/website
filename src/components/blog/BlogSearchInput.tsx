'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BlogSearchInputProps {
  defaultValue?: string;
}

export function BlogSearchInput({ defaultValue = '' }: BlogSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(searchParams.get('q') ?? '');
  }, [searchParams]);

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
      router.push(qs ? `/blog?${qs}` : '/blog');
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
    <div className="relative w-full lg:w-1/3 shrink-0">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
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
        type="search"
        placeholder="Search articles..."
        value={value}
        onChange={handleChange}
        className="w-full font-body text-sm text-[#1A1A1A] rounded-full outline-none"
        style={{
          border: '1px solid #E5E7EB',
          background: '#fff',
          padding: '10px 16px 10px 38px',
        }}
      />
    </div>
  );
}
