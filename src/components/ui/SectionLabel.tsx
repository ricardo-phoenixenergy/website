import { cn } from '@/lib/utils';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function SectionLabel({ children, className, dark = false }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'font-body text-xs font-bold uppercase tracking-[0.14em]',
        dark ? 'text-white/35' : 'text-[#6B7280]',
        className,
      )}
    >
      {children}
    </p>
  );
}
