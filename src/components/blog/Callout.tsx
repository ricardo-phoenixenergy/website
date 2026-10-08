// src/components/blog/Callout.tsx
// A note inside the article, at 16px so it reads at the prose's pace:
//   info     a Dusty Blue tint
//   warning  a Soft Amber tint
//   stat     Night Teal, with the text in on-dark-muted
// Colours come from the tokens; the icon is the editor's emoji, decorative.
interface CalloutProps {
  type: 'info' | 'warning' | 'stat';
  icon?: string;
  title: string;
  text: string;
}

const CALLOUT_STYLES = {
  info: { box: 'border-pe-secondary/25 bg-pe-secondary/8', title: 'text-pe-text', text: 'text-pe-text-soft' },
  warning: { box: 'border-accent-solar/35 bg-accent-solar/12', title: 'text-pe-text', text: 'text-pe-text-soft' },
  stat: { box: 'border-white/10 bg-pe-nav-dark', title: 'text-white', text: 'text-on-dark-muted' },
} as const;

export function Callout({ type, icon, title, text }: CalloutProps) {
  const s = CALLOUT_STYLES[type] ?? CALLOUT_STYLES.info;
  return (
    <div className={`my-6 flex gap-3 rounded-xl border px-5 py-4 ${s.box}`}>
      {icon && (
        <span className="shrink-0 text-lg leading-6" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        <p className={`font-display text-base font-bold leading-6 ${s.title}`}>{title}</p>
        <p className={`mt-1 font-body text-base leading-[1.65] ${s.text}`}>{text}</p>
      </div>
    </div>
  );
}
