// src/components/ui/Card.tsx
import Image from 'next/image';
import { IconArrowRight } from './Icons';

const DEFAULT_LQIP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// ── Card ─────────────────────────────────────────────────────────────
export interface CardProps {
  variant?: 'light' | 'dark';
  /**
   * 1 = full-card link: lift + shadow on hover. Card has `group` class.
   * 2 = button inside: shadow-only hover, card is NOT a link wrapper.
   * 3 = static display: no hover of any kind.
   */
  pattern?: 1 | 2 | 3;
  /** Set false to suppress the teal gradient overlay on dark Pattern 1 cards. Default: true. */
  overlay?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ variant = 'light', pattern = 1, overlay = true, className = '', children }: CardProps) {
  const base = 'relative flex flex-col overflow-hidden rounded-2xl transition-all duration-200';

  const variantClass =
    variant === 'light' ? 'bg-white border border-[#E5E7EB]' : 'bg-[#0d1f22]';

  const patternClass =
    pattern === 1
      ? variant === 'light'
        ? 'group cursor-pointer [will-change:transform] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(57,87,92,0.10)] hover:border-[#cccccc]'
        : 'group cursor-pointer [will-change:transform] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(13,31,34,0.25)]'
      : pattern === 2
      ? 'cursor-default hover:shadow-[0_4px_16px_rgba(57,87,92,0.07)]'
      : 'cursor-default';

  return (
    <div className={`${base} ${variantClass} ${patternClass} ${className}`}>
      {/* Dark gradient overlay — z-index:-1 keeps it behind all content without needing z-index on siblings */}
      {variant === 'dark' && pattern === 1 && overlay && (
        <>
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ background: 'linear-gradient(140deg, #1a4a52 0%, #0f2d33 100%)', zIndex: -1 }}
          />
          <span
            aria-hidden
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              zIndex: -1,
              top: -24,
              right: -24,
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(112,157,169,0.25) 0%, transparent 70%)',
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}

// ── CardImage ─────────────────────────────────────────────────────────
export interface CardImageProps {
  /** When omitted, renders placeholderStyle div instead of an image. */
  src?: string;
  alt?: string;
  height?: number;
  blurDataURL?: string;
  sizes?: string;
  priority?: boolean;
  /** CSS background for the placeholder div shown when src is absent. */
  placeholderStyle?: React.CSSProperties;
  /** Badge overlays — use absolute positioning classes on children. */
  children?: React.ReactNode;
}

export function CardImage({
  src,
  alt = '',
  height = 168,
  blurDataURL,
  sizes = '400px',
  priority = false,
  placeholderStyle,
  children,
}: CardImageProps) {
  return (
    <div className="relative flex-shrink-0 overflow-hidden" style={{ height }}>
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            sizes={sizes}
            placeholder="blur"
            blurDataURL={blurDataURL ?? DEFAULT_LQIP}
          />
          {/* Gradient scrim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(13,31,34,0.92) 0%, rgba(13,31,34,0.55) 30%, rgba(13,31,34,0.08) 65%, transparent 100%)',
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={placeholderStyle ?? { background: '#E5E7EB' }}
        />
      )}
      {/* Badge slots — outside zoom wrapper so badges don't scale with the image */}
      {children && (
        <div className="absolute inset-0 pointer-events-none">{children}</div>
      )}
    </div>
  );
}

// ── CardBody ─────────────────────────────────────────────────────────
export interface CardBodyProps {
  /** 'sm' = p-4 (16px). 'lg' = p-6 (24px) for content-heavy cards. */
  padding?: 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export function CardBody({ padding = 'sm', className = '', children }: CardBodyProps) {
  return (
    <div
      className={`${padding === 'sm' ? 'p-4' : 'p-6'} flex flex-col flex-1 ${className}`}
    >
      {children}
    </div>
  );
}

// ── CardFooter ───────────────────────────────────────────────────────
export interface CardFooterProps {
  variant?: 'light' | 'dark';
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ variant = 'light', className = '', children }: CardFooterProps) {
  return (
    <div
      className={`px-4 py-3 flex items-center justify-between ${
        variant === 'light'
          ? 'border-t border-[#E5E7EB]'
          : 'border-t border-[rgba(255,255,255,0.08)]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── CardArrow ─────────────────────────────────────────────────────────
export interface CardArrowProps {
  variant?: 'light' | 'dark';
}

export function CardArrow({ variant = 'light' }: CardArrowProps) {
  if (variant === 'dark') {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.4)] group-hover:bg-[#709DA9] group-hover:border-[#709DA9] group-hover:text-white">
        <IconArrowRight size={12} />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#39575C] group-hover:border-[#39575C] group-hover:text-white">
      <IconArrowRight size={12} />
    </div>
  );
}
