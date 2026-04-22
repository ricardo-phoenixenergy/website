// src/components/blog/ShareButtons.tsx
'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnBase =
    'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 font-body font-bold text-[10px]';
  const btnStyle = { border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280' };

  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-[10px] text-[#9CA3AF]">Share:</span>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        style={btnStyle}
        aria-label="Share on LinkedIn"
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB';
          (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280';
        }}
      >
        in
      </a>

      {/* X (Twitter) */}
      <a
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        style={btnStyle}
        aria-label="Share on X"
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#39575C';
          (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB';
          (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280';
        }}
      >
        𝕏
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className={btnBase}
        style={
          copied
            ? { border: '1px solid #39575C', background: '#39575C', color: '#fff' }
            : btnStyle
        }
        aria-label="Copy link"
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? '✓' : '🔗'}
      </button>
    </div>
  );
}
