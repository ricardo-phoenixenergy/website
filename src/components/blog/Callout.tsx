interface CalloutProps {
  type: 'info' | 'warning' | 'stat';
  icon?: string;
  title: string;
  text: string;
}

const CALLOUT_STYLES = {
  info: {
    bg: 'rgba(112,157,169,0.08)',
    border: '1px solid rgba(112,157,169,0.25)',
    titleColor: '#1A1A1A',
    textColor: '#6B7280',
  },
  warning: {
    bg: 'rgba(227,197,141,0.12)',
    border: '1px solid rgba(227,197,141,0.35)',
    titleColor: '#1A1A1A',
    textColor: '#6B7280',
  },
  stat: {
    bg: '#0d1f22',
    border: '1px solid rgba(255,255,255,0.08)',
    titleColor: '#ffffff',
    textColor: 'rgba(255,255,255,0.60)',
  },
} as const;

export function Callout({ type, icon, title, text }: CalloutProps) {
  const s = CALLOUT_STYLES[type];
  return (
    <div
      className="flex gap-3 my-5"
      style={{
        background: s.bg,
        border: s.border,
        borderRadius: 12,
        padding: '16px 18px',
      }}
    >
      {icon && (
        <span className="flex-shrink-0 text-lg leading-none" role="img" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        <p
          className="font-display font-bold text-xs leading-tight mb-1"
          style={{ color: s.titleColor }}
        >
          {title}
        </p>
        <p className="font-body text-[11px] leading-[1.7]" style={{ color: s.textColor }}>
          {text}
        </p>
      </div>
    </div>
  );
}
