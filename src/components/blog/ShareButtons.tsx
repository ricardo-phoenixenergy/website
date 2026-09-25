// src/components/blog/ShareButtons.tsx
'use client';

import { useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { IconCheck, IconLink, IconLinkedIn, IconXLogo } from '@/components/ui/Icons';

interface ShareButtonsProps {
  url: string;
  title: string;
}

// Three 44px outline icon buttons with drawn glyphs; after a copy the link
// glyph turns into a check for 2 seconds. The LinkedIn mark is a filled square,
// which reads larger and darker than the open X and link glyphs at the same
// size, so it is drawn at 16px beside their 20px: the same height as the X.
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-body text-xs text-pe-muted">Share:</span>

      <IconButton
        variant="outline"
        label="Share on LinkedIn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconLinkedIn className="size-4" />
      </IconButton>

      <IconButton
        variant="outline"
        label="Share on X"
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconXLogo />
      </IconButton>

      <IconButton
        variant="outline"
        label="Copy link"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? <IconCheck /> : <IconLink />}
      </IconButton>
    </div>
  );
}
