// src/components/sections/AboutTeam.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TeamMember } from '@/types/sanity';
import type { TeamCategory } from '@/types/sanity';
import { IconArrowRight } from '../ui/Icons';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { revealFocusedChip } from '../ui/FilterPills';
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
    <section className="bg-pe-bg py-16 md:py-24">
      <div className="page-container">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-3">
          The team
        </p>
        <h2 className="font-display font-extrabold text-3xl text-pe-text leading-[1.2] mb-6">
          Meet the people{' '}
          <em className="not-italic text-pe-secondary-ink">behind Phoenix Energy</em>
        </h2>

        {/* Filters: toggle chips that narrow the grid below, so each says
            whether it is on. The strip scrolls sideways, which clips anything
            outside it; the ring reaches 4px out and a chip's touch target 4px
            above and below, so 6px of padding (offset by negative margins, the
            gap below kept at 36px) keeps both whole. A chip that takes keyboard
            focus scrolls fully into view (revealFocusedChip), 6px inside the
            edge (the scroll padding), so its ring shows whole. */}
        <div
          role="group"
          aria-label="Filter the team"
          className="flex gap-2 mb-[30px] overflow-x-auto scrollbar-none p-1.5 -mx-1.5 -mt-1.5 scroll-px-1.5"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onFocus={revealFocusedChip}
        >
          {availableCats.map((cat) => (
            <Chip
              key={cat.value}
              selected={activeCat === cat.value}
              onClick={() => setActiveCat(cat.value)}
            >
              {cat.label}
            </Chip>
          ))}
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((member) => (
            <Card key={member._id} variant="dark" pattern={3} className="focus-on-dark">
              <CardImage
                src={member.photo?.asset.url}
                alt={member.name}
                aspectRatio="3 / 4"
                blurDataURL={member.photo?.asset.metadata?.lqip}
                sizes="(max-width: 768px) 100vw, 320px"
                placeholderStyle={{ background: 'linear-gradient(135deg, #162630, #0d1f22)' }}
              >
                {/* LinkedIn badge, pointer-events-auto so it stays clickable. The
                    visible "in" alone names nothing, so the link says whose profile
                    it opens, and where. */}
                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile of ${member.name} (opens in a new tab)`}
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
                  <p className="font-body font-semibold text-sm mb-0.5 text-pe-secondary-ink">
                    {member.archetype}
                  </p>
                )}
                <p className="font-body text-xs" style={{ color: 'var(--color-on-dark-subtle)' }}>
                  {member.role}
                </p>
              </CardBody>
            </Card>
          ))}

          {/* Join the journey — Pattern 2: has button inside, shadow-only hover */}
          <Card variant="dark" pattern={2} className="focus-on-dark md:col-span-3">
            <CardBody padding="lg" className="md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display font-bold text-base text-white mb-1">
                  Become a part of our journey
                </p>
                <p className="font-body text-sm leading-[1.7]" style={{ color: 'var(--color-on-dark-subtle)' }}>
                  We&apos;re always looking for passionate, ambitious individuals who share our vision
                  for a prosperous Africa.
                </p>
              </div>
              <Button
                href="https://linkedin.com/company/105465145"
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                size="compact"
                className="self-start md:self-auto shrink-0"
              >
                See career opportunities <IconArrowRight />
              </Button>
            </CardBody>
          </Card>
        </div>

        {members.length === 0 && (
          <p className="font-body text-base text-pe-muted text-center py-12">
            Team members coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
