// src/components/project/ProjectBreadcrumb.tsx
// The row above a project's hero: the breadcrumb (Home / Projects / the project;
// phones drop Home, and a long title ends in an ellipsis) and Copy link. The
// row itself is the shared PageBreadcrumb.
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { PageBreadcrumb } from '@/components/ui/PageBreadcrumb';

interface ProjectBreadcrumbProps {
  title: string;
  /** The page's canonical URL, for Copy link. */
  url: string;
}

export function ProjectBreadcrumb({ title, url }: ProjectBreadcrumbProps) {
  return (
    <PageBreadcrumb
      trail={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: title }]}
      action={<CopyLinkButton url={url} />}
    />
  );
}
