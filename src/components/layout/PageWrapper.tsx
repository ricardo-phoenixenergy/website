import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Add top padding to clear the fixed nav (use on non-hero pages) */
  padTop?: boolean;
}

export function PageWrapper({ children, className, padTop = true }: PageWrapperProps) {
  return (
    <div className={cn(padTop ? 'pt-[88px]' : '', className)}>
      {children}
    </div>
  );
}
