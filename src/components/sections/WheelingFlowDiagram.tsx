import type { WheelingFlow, FlowIcon } from '@/config/wheelingFlows';
import { IconSolarPanel, IconPylon, IconBuilding } from '@/components/ui/Icons';

const MONEY = '#39575C';

const NODE_ICON: Record<FlowIcon, (size: number) => React.ReactNode> = {
  solar: (s) => <IconSolarPanel size={s} />,
  pylon: (s) => <IconPylon size={s} />,
  building: (s) => <IconBuilding size={s} />,
};

interface WheelingFlowDiagramProps {
  flow: WheelingFlow;
  accent: string;
}

export function WheelingFlowDiagram({ flow, accent }: WheelingFlowDiagramProps) {
  return (
    <div
      role="img"
      aria-label={flow.summary}
      className="rounded-2xl border border-[#E5E7EB] bg-[#F5F5F5] p-5 md:p-6"
    >
      {/* Energy path — icon nodes, vertical stack with dashed connectors */}
      <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-3">
        {flow.energyTitle}
      </p>
      <div className="mb-5">
        {flow.energy.map((node, i) => (
          <div key={node.label}>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: node.emphasis ? 'rgba(217,124,118,0.20)' : 'rgba(217,124,118,0.14)',
                  color: accent,
                  ...(node.emphasis ? { boxShadow: `inset 3px 0 0 ${accent}` } : {}),
                }}
              >
                {NODE_ICON[node.icon](20)}
              </div>
              <div className="pt-0.5">
                <p className="font-display font-bold text-sm text-[#1A1A1A] leading-tight">{node.label}</p>
                <p className="font-body text-xs text-[#6B7280] leading-snug mt-0.5">{node.desc}</p>
              </div>
            </div>
            {i < flow.energy.length - 1 && (
              <div aria-hidden className="ml-5 my-1" style={{ height: 16, borderLeft: `2px dashed ${accent}` }} />
            )}
          </div>
        ))}
      </div>

      {/* Money flow */}
      <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">
        {flow.moneyTitle}
      </p>
      <div className="space-y-3">
        {flow.money.map((step) => (
          <div key={`${step.from}->${step.to}: ${step.label}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-body text-xs font-semibold text-[#1A1A1A]">{step.from}</span>
              <span aria-hidden className="inline-flex items-center" style={{ color: MONEY }}>
                <span className="inline-block w-5" style={{ borderTop: `2px dashed ${MONEY}` }} />
                <span className="text-[9px] -ml-1 leading-none">▶</span>
              </span>
              <span className="font-body text-xs font-semibold text-[#1A1A1A]">{step.to}</span>
            </div>
            <p className="font-body text-sm text-[#374151] leading-snug">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
