import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Script from 'next/script';
import { SiteShell } from '@/components/layout/SiteShell';
import { ScrollDepth } from '@/components/analytics/ScrollDepth';
import { WebVitals } from './_components/WebVitals';
import { sanityServerClient } from '@/lib/sanity.server';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Phoenix Energy: Integrated Clean Energy Solutions for SA Businesses',
    template: '%s | Phoenix Energy',
  },
  description:
    'C&I solar, wheeling, carbon credits, EV fleets and more. Get a free energy assessment from Phoenix Energy today.',
  metadataBase: new URL('https://phoenixenergy.solutions'),
  openGraph: {
    siteName: 'Phoenix Energy',
    locale: 'en_ZA',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

// Hourly by default, so the navbar's blog link (below) appears on every page
// within an hour of the third post being published.
export const revalidate = 3600;

/** News & Insights joins the navbar only once there is something to read. */
const BLOG_NAV_MIN_POSTS = 3;

async function hasEnoughPosts(): Promise<boolean> {
  try {
    const count = await sanityServerClient.fetch<number>(
      'count(*[_type == "blogPost" && defined(slug.current)])',
    );
    return count >= BLOG_NAV_MIN_POSTS;
  } catch {
    return false;
  }
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Phoenix Energy',
  url: 'https://phoenixenergy.solutions',
  logo: 'https://phoenixenergy.solutions/logo.png',
  email: 'info@phoenixenergy.solutions',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+27-79-892-8197',
    contactType: 'sales',
    areaServed: 'ZA',
  },
  sameAs: ['https://www.linkedin.com/company/105465145'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showBlog = await hasEnoughPosts();

  return (
    <html
      lang="en-ZA"
      className={`${jakarta.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="font-body antialiased" style={{ background: '#F5F5F5', color: '#1A1A1A' }}>
        <WebVitals />
        <ScrollDepth />

        {/* Google Tag Manager — body noscript */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <SiteShell showBlog={showBlog}>{children}</SiteShell>

        {/* GTM script */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
          </Script>
        )}

      </body>
    </html>
  );
}
