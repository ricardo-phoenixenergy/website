import type { Metadata } from 'next';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { TEAM_MEMBERS_QUERY, MILESTONE_TIMELINE_QUERY } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import { AboutStory } from '@/components/sections/AboutStory';
import { AboutMission } from '@/components/sections/AboutMission';
import { AboutValues } from '@/components/sections/AboutValues';
import { AboutTimeline } from '@/components/sections/AboutTimeline';
import { AboutTeam } from '@/components/sections/AboutTeam';
import { AboutTrust } from '@/components/sections/AboutTrust';
import type { TeamMember, MilestoneTimeline } from '@/types/sanity';

export const metadata: Metadata = {
  title: 'About Phoenix Energy — Our Story, Mission & Team',
  description:
    "Learn about Phoenix Energy's founding story, mission to drive Net Zero across Africa, our values, and the team behind Southern Africa's leading clean energy company.",
  alternates: { canonical: 'https://phoenixenergy.solutions/about' },
  openGraph: {
    title: 'About Phoenix Energy — Our Story, Mission & Team',
    description:
      "The story, mission and team behind Southern Africa's leading integrated clean energy company.",
    url: 'https://phoenixenergy.solutions/about',
    images: [{ url: 'https://phoenixenergy.solutions/og-about.jpg', width: 1200, height: 630 }],
  },
};

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return await sanityClient.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY);
  } catch {
    return [];
  }
}

async function getMilestones(): Promise<MilestoneTimeline[]> {
  try {
    return await sanityClient.fetch<MilestoneTimeline[]>(MILESTONE_TIMELINE_QUERY);
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const [teamMembers, milestones] = await Promise.all([
    getTeamMembers(),
    getMilestones(),
  ]);

  return (
    <main>
      {/* Hero — background stretches to top of screen */}
      <div
        className="relative overflow-hidden"
        style={{ height: 448 }}
      >
        {/* Background gradient (replace with next/image when photo available) */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1a3a3e 0%, #0d1f22 100%)' }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(13,31,34,0.2) 0%, rgba(13,31,34,0.9) 100%)',
          }}
        />
        {/* Breadcrumb — same visual position, colours adapted for dark bg */}
        <div className="page-container absolute inset-x-0 top-0 pt-[88px]">
          <nav className="flex items-center gap-1.5 font-body text-sm pt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-white">About</span>
          </nav>
        </div>
        {/* Content */}
        <div className="page-container absolute inset-x-0 bottom-0 pb-8">
          <p
            className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-2.5"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            The rise of Phoenix Energy
          </p>
          <h1
            className="font-display font-extrabold text-4xl text-white leading-[1.2]"
            style={{ maxWidth: 560 }}
          >
            Save, earn & grow with renewable energy across{' '}
            <em style={{ color: '#709DA9', fontStyle: 'normal' }}>Africa</em>
          </h1>
        </div>
      </div>

      {/* Sections */}
      <AboutStory />
      <AboutMission />
      <AboutValues />
      <AboutTimeline milestones={milestones} />
      <AboutTeam members={teamMembers} />
      <AboutTrust />

      {/* CTA Banner — teal variant */}
      <section className="bg-[#39575C] px-6 py-[52px] text-center">
        <div className="max-w-[520px] mx-auto">
          <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-3">
            Work with us
          </h2>
          <p
            className="font-body text-sm leading-[1.75] mb-6"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Whether you're a prospective client or a future partner — we'd love to hear from you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="light" href="/contact">Get in Touch</Button>
            <Button variant="ghost" href="/projects">View our projects</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
