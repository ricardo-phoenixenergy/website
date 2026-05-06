'use client';

import React from 'react';

export interface FilterPill {
  key: string;
  label: string;
  accent?: string;
  accentText?: string;
}

interface FilterPillsProps {
  pills: FilterPill[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function FilterPills({ pills, activeKey, onSelect }: FilterPillsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
    >
      {pills.map(pill => {
        const isActive = pill.key === activeKey;
        return (
          <button
            key={pill.key}
            onClick={() => onSelect(pill.key)}
            className="cursor-pointer flex-shrink-0 font-body font-medium text-sm rounded-full transition-all duration-200"
            style={{
              padding: '7px 16px',
              background: isActive ? (pill.accent ?? '#39575C') : '#ffffff',
              border: isActive ? 'none' : '1px solid #E5E7EB',
              color: isActive ? (pill.accentText ?? '#ffffff') : '#6B7280',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
            }}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
