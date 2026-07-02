// src/components/sections/IndustryProofCard.tsx
// Right-column proof example shown in an EV Fleets industry tab panel.

interface IndustryProofCardProps {
  client: string;
  stat: string;
  detail: string;
  accent: string;
  accentText: string;
}

export function IndustryProofCard({ client, stat, detail, accent, accentText }: IndustryProofCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#F5F5F5] border border-[#E5E7EB]">
      <div className="h-[3px]" style={{ background: accent }} />
      <div className="p-6">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          Proven in South Africa
        </p>
        <p className="font-display font-extrabold text-2xl text-[#1A1A1A] leading-tight mb-1">
          {stat}
        </p>
        <p className="font-body text-sm font-semibold mb-3" style={{ color: accentText }}>
          {client}
        </p>
        <p className="font-body text-sm text-[#374151] leading-[1.7]">
          {detail}
        </p>
      </div>
    </div>
  );
}
