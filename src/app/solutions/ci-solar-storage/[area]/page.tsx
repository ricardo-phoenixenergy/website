// src/app/solutions/ci-solar-storage/[area]/page.tsx
// The commercial solar location pages: Gauteng, and Pretoria and Centurion
// (docs/superpowers/specs/2026-10-12-location-pages-design.md). One template;
// the words, municipal facts, projects and FAQs come from src/config/locations.ts.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionHero } from '@/components/sections/SolutionHero';
import { ExplainerCards } from '@/components/sections/ExplainerCards';
import { SupplierAccordion } from '@/components/sections/SupplierAccordion';
import { AreaProjects } from '@/components/sections/AreaProjects';
import { PartnerBand } from '@/components/sections/PartnerBand';
import { FinancingBand } from '@/components/sections/FinancingBand';
import { ServiceAreaList } from '@/components/sections/ServiceAreaList';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { RelatedArticles } from '@/components/sections/RelatedArticles';
import { StrategyFinder } from '@/components/sections/StrategyFinder';
import { JsonLd } from '@/components/layout/JsonLd';
import { PageFooter } from '@/components/layout/PageFooter';
import { getHeroImages } from '@/lib/getHeroImages';
import { getProjectsByArea } from '@/lib/projectData';
import { getPartnerLogo } from '@/lib/partnerData';
import { contactHref } from '@/lib/contactLink';
import { CONTACT } from '@/config/contact';
import { WEG_BAND } from '@/config/wegPartner';
import { VERTICAL_CONFIG } from '@/config/verticals';
import { SOLUTION_META } from '@/types/solutions';
import { SERVICE_CTA } from '@/config/ctas';
import { LIFECYCLE, LOCATION_CONTENT, LOCATION_FACTS_CHECKED, SUPPLIER_HELP } from '@/config/locations';
import { LOCATION_AREAS, LOCATION_AREA_LABEL, isLocationArea, locationPath } from '@/lib/locationAreas';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import { serviceJsonLd, breadcrumbJsonLd, webPageJsonLd, HOME_CRUMB } from '@/lib/structuredData';

const vertical = 'ci-solar-storage' as const;
const meta = SOLUTION_META[vertical];

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
  const own = await getProjectsByArea(vertical, area).catch(() => []);
  // A page without projects of its own shows the Gauteng ones, labelled as such (spec E8).
  const borrowed = own.length === 0 && area !== 'gauteng' ? await getProjectsByArea(vertical, 'gauteng').catch(() => []) : [];
  const projects = own.length > 0 ? own : borrowed;
  const lead = own[0];
  // The photo and its blur come from one source: the lead project's, else the C&I hero's.
  const leadUrl = lead?.heroImage?.asset?.url;
  const heroImage = leadUrl ?? hero?.url;
  const heroBlur = leadUrl ? lead?.heroImage?.asset?.metadata?.lqip : hero?.lqip;
  // The photo's own alt text, else the project and where it is, e.g. "St Andrews Office Park - Block A, Germiston".
  const heroAlt = lead?.heroImage?.asset?.url ? (lead.heroImage.alt || [lead.title, lead.location].filter(Boolean).join(', ')) : meta.label;
  const wegLogo = await getPartnerLogo(WEG_BAND.partnerName);
  const breadcrumbId = `${absoluteUrl(path)}#breadcrumb`;
  const cta = { label: SERVICE_CTA[vertical].label, href: contactHref(content.closing.ctaMessage) };

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: content.serviceName,
          description: content.seoDescription,
          path,
          areaServed: content.areaServed,
          serviceType: 'Commercial solar PV and battery storage installation',
          businessAudience: true,
          offers: ['Outright purchase', 'Power lease agreement', 'Power purchase agreement'],
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          HOME_CRUMB,
          { name: 'Solutions', path: '/solutions' },
          { name: meta.label, path: meta.slug },
          { name: LOCATION_AREA_LABEL[area], path },
        ], { id: breadcrumbId })}
      />
      <JsonLd
        data={webPageJsonLd({
          path,
          name: content.seoTitle,
          description: content.seoDescription,
          dateModified: LOCATION_FACTS_CHECKED,
          aboutId: absoluteUrl(path) + '#service',
          breadcrumbId,
          mentions: [{ name: 'WEG', url: 'https://www.weg.net' }],
        })}
      />
      <SolutionHero
        title={content.h1}
        subtitle={content.subtitle}
        eyebrow={content.eyebrow}
        accent={meta.accent}
        badge={LOCATION_AREA_LABEL[area]}
        imageAlt={heroAlt}
        trail={[{ label: meta.label, href: meta.slug }]}
        heroImage={heroImage}
        heroBlur={heroBlur}
        heroBg="linear-gradient(135deg, #0d1f22 0%, #1a3a3f 50%, #2d5c63 100%)"
        primaryCta={cta}
        wideRight
      >
        <StrategyFinder vertical={vertical} />
      </SolutionHero>
      <AreaProjects
        eyebrow={own.length > 0 ? content.projects.eyebrow : content.projects.fallbackEyebrow}
        heading={own.length > 0 ? content.projects.heading : content.projects.fallbackHeading}
        projects={projects}
        accent={meta.accent}
      />
      <ExplainerCards {...LIFECYCLE} subtitle={`${content.statement} ${LIFECYCLE.subtitle}`} accent={meta.accent} background="gray" />
      <SupplierAccordion {...content.municipalities} help={SUPPLIER_HELP} accent={meta.accent} />
      <PartnerBand content={WEG_BAND} logo={wegLogo} />
      <FinancingBand />
      <ServiceAreaList {...content.areas} accent={meta.accent} />
      <FaqAccordion id="faq" eyebrow="Questions" heading={content.faqHeading} items={content.faqs} accent={meta.accent} flushTop />
      <RelatedArticles vertical={vertical} slugs={content.articleSlugs} heading="Further reading" />
      <PageFooter
        ctaVariant="centered"
        eyebrow="Start today"
        heading={content.closing.heading}
        body={content.closing.body}
        primaryCta={cta}
        phone={{ label: CONTACT.phone, href: CONTACT.phoneHref }}
      />
    </>
  );
}
