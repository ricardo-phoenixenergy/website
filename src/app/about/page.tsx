import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FloatingOrbs } from '@/components/ui/FloatingOrbs';
import { IconArrowRight } from '@/components/ui/Icons';
import { sanityClient } from '@/lib/sanity';
import { TEAM_MEMBERS_QUERY, MILESTONE_TIMELINE_QUERY, PARTNERS_QUERY } from '@/lib/queries';
import { getCompanyStats } from '@/lib/getCompanyStats';
import { AboutStory } from '@/components/sections/AboutStory';
import { AboutMission } from '@/components/sections/AboutMission';
import { AboutValues } from '@/components/sections/AboutValues';
import { AboutTimeline } from '@/components/sections/AboutTimeline';
import { AboutTeam } from '@/components/sections/AboutTeam';
import { AboutTrust } from '@/components/sections/AboutTrust';
import { PageFooter } from '@/components/layout/PageFooter';
import type { TeamMember, MilestoneTimeline, Partner } from '@/types/sanity';

// Safety-net ISR: refresh hourly even if the Sanity revalidate webhook isn't
// wired up, so partner/team/timeline changes eventually appear without a redeploy.
export const revalidate = 3600;

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
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630 }],
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

async function getPartners(): Promise<Partner[]> {
  try {
    return await sanityClient.fetch<Partner[]>(PARTNERS_QUERY);
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const [teamMembers, milestones, partners, companyStats] = await Promise.all([
    getTeamMembers(),
    getMilestones(),
    getPartners(),
    getCompanyStats(),
  ]);

  return (
    <>
    <main>
      {/* Hero — matches Solutions page: FloatingOrbs + dark background */}
      <section className="relative overflow-hidden" style={{ background: '#0d1f22', minHeight: 480 }}>
        <FloatingOrbs showConstellation={false} />
        <div className="page-container relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 font-body text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-white">About</span>
          </nav>
          <AnimatedSection>
            <p
              className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              The rise of Phoenix Energy
            </p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-5 max-w-[860px]">
              Powering Africa&apos;s{' '}
              <em className="whitespace-nowrap" style={{ color: '#709DA9', fontStyle: 'normal' }}>energy transition</em>
            </h1>
            <p
              className="font-body text-base md:text-lg leading-[1.75] mb-8 max-w-[560px]"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              Meet the team, story and values behind a company on a mission to become Africa&apos;s most innovative energy service provider.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold rounded-full px-5 py-2.5 transition-colors duration-200 hover:bg-white"
                style={{ background: '#F5F5F5', color: '#0d1f22' }}
              >
                Get in touch <IconArrowRight size={13} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold rounded-full px-5 py-2.5"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                View our projects <IconArrowRight size={13} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sections */}
      <AboutStory stats={companyStats} />
      <AboutMission />
      <AboutValues />
      <AboutTimeline milestones={milestones} />
      <AboutTeam members={teamMembers} />
      <AboutTrust partners={partners} />

    </main>
    <PageFooter ctaVariant="centered" />
    </>
  );
}
