'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TeamMember } from '@/types/sanity';
import type { TeamCategory } from '@/types/sanity';

interface AboutTeamProps {
  members: TeamMember[];
}

const ALL_CATS: { value: 'all' | TeamCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'founders', label: 'Founders' },
  { value: 'business', label: 'Business' },
  { value: 'technical', label: 'Technical' },
];

export function AboutTeam({ members }: AboutTeamProps) {
  const [activeCat, setActiveCat] = useState<'all' | TeamCategory>('all');

  // Only show tabs for categories that have members
  const availableCats = ALL_CATS.filter(
    (c) => c.value === 'all' || members.some((m) => m.category === c.value),
  );

  const visible =
    activeCat === 'all' ? members : members.filter((m) => m.category === activeCat);

  return (
    <section className="bg-[#F5F5F5] px-6 py-[52px]">
      <div className="max-w-[960px] mx-auto">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          The team
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-6">
          Meet the people{' '}
          <em style={{ color: '#709DA9', fontStyle: 'normal' }}>behind Phoenix Energy</em>
        </h2>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-1" style={{ WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
          {availableCats.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCat(cat.value)}
              className="rounded-full font-body font-medium text-sm px-4 py-1.5 transition-all duration-200 flex-shrink-0"
              style={{
                background: activeCat === cat.value ? '#39575C' : '#ffffff',
                color: activeCat === cat.value ? '#ffffff' : '#6B7280',
                border: activeCat === cat.value ? '1px solid #39575C' : '1px solid #E5E7EB',
                fontWeight: activeCat === cat.value ? 600 : 500,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visible.map((member) => (
            <div
              key={member._id}
              className="rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
              style={{ background: '#0d1f22' }}
            >
              {/* Photo */}
              <div className="relative" style={{ height: 150 }}>
                {member.photo ? (
                  <Image
                    src={member.photo.asset.url}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                    placeholder="blur"
                    blurDataURL={member.photo.asset.metadata?.lqip ?? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: 'linear-gradient(135deg, #162630, #0d1f22)' }}
                  />
                )}
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center font-body text-xs font-bold transition-colors duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    in
                  </Link>
                )}
              </div>

              {/* Body */}
              <div className="px-3.5 py-3">
                <p className="font-display font-bold text-base text-white mb-0.5">{member.name}</p>
                {member.archetype && (
                  <p className="font-body font-semibold text-sm mb-0.5" style={{ color: '#709DA9' }}>
                    {member.archetype}
                  </p>
                )}
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {member.role}
                </p>
              </div>
            </div>
          ))}

          {/* Join the journey card */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between gap-4 md:col-span-3"
            style={{ background: '#0d1f22' }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-base text-white mb-1">
                Become a part of our journey
              </p>
              <p className="font-body text-sm leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                We're always looking for passionate, ambitious individuals who share our vision for a prosperous Africa.
              </p>
            </div>
            <Link
              href="https://linkedin.com/company/105465145"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-full px-4 py-2 font-body font-semibold text-sm text-[#0d1f22] bg-[#F5F5F5] hover:bg-white transition-colors duration-200"
            >
              See career opportunities →
            </Link>
          </div>
        </div>

        {members.length === 0 && (
          <p className="font-body text-base text-[#6B7280] text-center py-12">
            Team members coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
