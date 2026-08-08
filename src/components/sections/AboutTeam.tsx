// src/components/sections/AboutTeam.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TeamMember } from '@/types/sanity';
import type { TeamCategory } from '@/types/sanity';
import { IconArrowRight } from '../ui/Icons';
import { Card, CardImage, CardBody } from '../ui/Card';

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

  const availableCats = ALL_CATS.filter(
    (c) => c.value === 'all' || members.some((m) => m.category === c.value),
  );

  const visible =
    activeCat === 'all' ? members : members.filter((m) => m.category === activeCat);

  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24">
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-3">
          The team
        </p>
        <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-6">
          Meet the people{' '}
          <em style={{ color: '#709DA9', fontStyle: 'normal' }}>behind Phoenix Energy</em>
        </h2>

        {/* Filter tabs */}
        <div
          className="flex gap-2 mb-8 overflow-x-auto scrollbar-none pb-1"
          style={{ WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}
        >
          {availableCats.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCat(cat.value)}
              className="cursor-pointer rounded-full font-body font-medium text-sm px-4 py-1.5 transition-all duration-200 flex-shrink-0"
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((member) => (
            <Card key={member._id} variant="dark" pattern={3}>
              <CardImage
                src={member.photo?.asset.url}
                alt={member.name}
                aspectRatio="3 / 4"
                blurDataURL={member.photo?.asset.metadata?.lqip}
                sizes="(max-width: 768px) 100vw, 320px"
                placeholderStyle={{ background: 'linear-gradient(135deg, #162630, #0d1f22)' }}
              >
                {/* LinkedIn badge — pointer-events-auto so it stays clickable */}
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center font-body text-xs font-bold transition-colors duration-150 pointer-events-auto"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    in
                  </Link>
                )}
              </CardImage>
              <CardBody padding="sm">
                <p className="font-display font-bold text-base text-white mb-0.5">{member.name}</p>
                {member.archetype && (
                  <p className="font-body font-semibold text-sm mb-0.5" style={{ color: '#709DA9' }}>
                    {member.archetype}
                  </p>
                )}
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {member.role}
                </p>
              </CardBody>
            </Card>
          ))}

          {/* Join the journey — Pattern 2: has button inside, shadow-only hover */}
          <Card variant="dark" pattern={2} className="md:col-span-3">
            <CardBody padding="lg" className="md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display font-bold text-base text-white mb-1">
                  Become a part of our journey
                </p>
                <p className="font-body text-sm leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  We&apos;re always looking for passionate, ambitious individuals who share our vision
                  for a prosperous Africa.
                </p>
              </div>
              <Link
                href="https://linkedin.com/company/105465145"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-2 items-center self-start md:self-auto flex-shrink-0 rounded-full px-5 py-2.5 font-body font-semibold text-sm text-[#0d1f22] bg-[#F5F5F5] hover:bg-white transition-colors duration-200"
              >
                See career opportunities <IconArrowRight size={14} />
              </Link>
            </CardBody>
          </Card>
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
