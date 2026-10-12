// src/app/solutions/ci-solar-storage/[area]/page.tsx
// The commercial solar location pages: Gauteng, and Pretoria and Centurion
// (docs/superpowers/specs/2026-10-12-location-pages-design.md). One template;
// the words, municipal facts, projects and FAQs come from src/config/locations.ts.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { SupplierAccordion } from '@/components/sections/SupplierAccordion';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { ServiceAreaList } from '@/components/sections/ServiceAreaList';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { StrategyFinder } from '@/components/sections/StrategyFinder';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageFooter } from '@/components/layout/PageFooter';
import { getHeroImages } from '@/lib/getHeroImages';
import { getProjectsByArea } from '@/lib/projectData';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { SERVICE_CTA } from '@/config/ctas';
import { LIFECYCLE, LOCATION_CONTENT, SUPPLIER_HELP } from '@/config/locations';
import { LOCATION_AREAS, LOCATION_AREA_LABEL, isLocationArea, locationPath } from '@/lib/locationAreas';
import { pageMetadata } from '@/lib/seo';
import { serviceJsonLd, breadcrumbJsonLd, HOME_CRUMB } from '@/lib/structuredData';

const vertical = 'ci-solar-storage' as const;
const meta = SOLUTION_META[vertical];
const cta = SERVICE_CTA[vertical];

type PageProps = { params: Promise<{ area: string }> };

export const revalidate = 3600;
// Only the listed areas exist; any other slug, in any case, is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATION_AREAS.map((area) => ({ area }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params;
  if (!isLocationArea(area)) return {};
  const content = LOCATION_CONTENT[area];
  return pageMetadata({
    title: content.seoTitle,
    absoluteTitle: true,
    description: content.seoDescription,
    path: locationPath(area),
    image: VERTICAL_CONFIG[vertical].shareImage,
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { area } = await params;
  if (!isLocationArea(area)) notFound();
  const content = LOCATION_CONTENT[area];
  const path = locationPath(area);
  const hero = (await getHeroImages())[vertical];
  // Backgrounds alternate white and grey. Without projects (a white section),
  // the grey municipality cards meet the grey funding band, so the band sits
  // flush. Same query and arguments as FeaturedProjects, so the two always agree; at worst it costs one extra cached query.
  const hasProjects = (await getProjectsByArea(vertical, area).catch(() => [])).length > 0;

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: content.serviceName, description: content.seoDescription, path, areaServed: content.areaServed })} />
      <JsonLd
        data={breadcrumbJsonLd([
          HOME_CRUMB,
          { name: 'Solutions', path: '/solutions' },
          { name: meta.label, path: meta.slug },
          { name: LOCATION_AREA_LABEL[area], path },
        ])}
      />
      <SolutionHero
        title={content.h1}
        subtitle={content.subtitle}
        eyebrow={content.eyebrow}
        accent={meta.accent}
        badge={LOCATION_AREA_LABEL[area]}
        imageAlt={meta.label}
        trail={[{ label: meta.label, href: meta.slug }]}
        heroImage={hero?.url}
        heroBlur={hero?.lqip}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={cta}
        wideRight
      >
        <StrategyFinder vertical={vertical} />
      </SolutionHero>
      <ExplainerCards {...LIFECYCLE} accent={meta.accent} background="white" />
      <SupplierAccordion {...content.municipalities} help={SUPPLIER_HELP} accent={meta.accent} />
      <FeaturedProjects vertical={vertical} area={area} />
      <FinancingBand flushTop={!hasProjects} />
      <ServiceAreaList {...content.areas} accent={meta.accent} />
      <FaqAccordion id="faq" eyebrow="Questions" heading={content.faqHeading} items={content.faqs} accent={meta.accent} flushTop />
      <RelatedArticles vertical={vertical} />
      <PageFooter
        ctaVariant="centered"
        eyebrow="Start today"
        heading="Find your optimal energy strategy"
        body="Work with our engineers to identify the best energy strategy for your business. You'll receive a clear, data-driven roadmap to reduce costs and improve energy performance."
        primaryCta={cta}
      />
    </>
  );
}
