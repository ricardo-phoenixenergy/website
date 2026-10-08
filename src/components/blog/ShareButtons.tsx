// src/components/blog/ShareButtons.tsx
'use client';

// The post's share actions, in the breadcrumb row's action slot: LinkedIn and X
// as 44px outline icon buttons, then Copy link, which behaves as on project
// pages (CopyLinkButton: "Link copied" announced, a field to copy from when the
// browser refuses). The three sit in one named group. The live region and the
// fallback field come after the group, so in the wrapping row the field takes a
// full line under the breadcrumb, not a squeezed slot beside the buttons.
// The LinkedIn mark is a filled square, which reads larger and darker than the
// open X glyph at the same size, so it is drawn at 16px beside the X's 20px.
import { IconButton } from '@/components/ui/IconButton';
import { IconLinkedIn, IconXLogo } from '@/components/ui/Icons';
import { CopyLinkAction, CopyLinkField, CopyLinkStatus, useCopyLink, type CopyLink } from '@/components/ui/CopyLinkButton';

interface ShareButtonsProps {
  url: string;
  title: string;
}

/** The markup, given the copy state: ShareButtons supplies it. */
export function ShareButtonsView({ url, title, copy }: ShareButtonsProps & { copy: CopyLink }) {
  return (
    <>
      <div role="group" aria-label="Share this article" className="flex shrink-0 items-center gap-2">
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
        <CopyLinkAction state={copy.state} onCopy={copy.copy} />
      </div>
      <CopyLinkStatus state={copy.state} />
      <CopyLinkField url={url} state={copy.state} fieldId={copy.fieldId} fieldRef={copy.fieldRef} />
    </>
  );
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const copy = useCopyLink(url);
  return <ShareButtonsView url={url} title={title} copy={copy} />;
}
