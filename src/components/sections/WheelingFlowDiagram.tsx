import type { WheelingFlow } from '@/config/wheelingFlows';

const MONEY = '#39575C';

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
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-1.5 font-body text-[0.7rem] text-[#6B7280]">
          <span className="inline-block w-4" style={{ borderTop: `2px solid ${accent}` }} />
          energy
        </span>
        <span className="flex items-center gap-1.5 font-body text-[0.7rem] text-[#6B7280]">
          <span className="inline-block w-4" style={{ borderTop: `2px dashed ${MONEY}` }} />
          money
        </span>
      </div>

      {/* Energy path */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        {flow.energy.map((node, i) => (
          <div key={node.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-1">
            <div
              className="w-full rounded-lg bg-white border border-[#E5E7EB] px-3 py-2"
              style={node.emphasis ? { borderLeft: `3px solid ${accent}` } : undefined}
            >
              <p className="font-display font-bold text-sm text-[#1A1A1A] leading-tight">{node.label}</p>
              {node.sub && (
                <p className="font-body text-xs text-[#6B7280] leading-tight mt-0.5">{node.sub}</p>
              )}
            </div>
            {i < flow.energy.length - 1 && (
              <span aria-hidden className="self-center font-bold leading-none" style={{ color: accent }}>
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">↓</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Money flow */}
      <p className="font-body text-xs font-bold uppercase tracking-[0.1em] text-[#6B7280] mb-2.5">
        {flow.moneyTitle}
      </p>
      <div className="space-y-3 mb-4">
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

      {/* Footer */}
      <div
        className="rounded-lg bg-white border border-[#E5E7EB] px-3 py-2"
        style={{ borderLeft: `3px solid ${accent}` }}
      >
        <p className="font-body text-xs text-[#374151] leading-snug">{flow.footer}</p>
      </div>
    </div>
  );
}
