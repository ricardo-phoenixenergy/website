import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Script from 'next/script';
import { JsonLd } from '@/components/layout/JsonLd';
import { SiteShell } from '@/components/layout/SiteShell';
import { ScrollDepth } from '@/components/analytics/ScrollDepth';
import { WebVitals } from './_components/WebVitals';
import { sanityServerClient } from '@/lib/sanity.server';
import { PUBLISHED_POSTS_COUNT_QUERY } from '@/lib/queries';
import { organizationJsonLd } from '@/lib/structuredData';
import { DEFAULT_SHARE_IMAGE, SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/seo';
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

// The defaults every page starts from. Each page replaces them through
// pageMetadata() (src/lib/seo.ts); a page that sets nothing, such as the 404,
// keeps these.
export const metadata: Metadata = {
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: SITE_NAME, locale: SITE_LOCALE, type: 'website', images: [DEFAULT_SHARE_IMAGE] },
  twitter: { card: 'summary_large_image' },
  // max-image-preview:large lets Google show a large image preview, which Discover requires.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

// Hourly by default, so the navbar's blog link (below) appears on every page
// within an hour of the third post being published.
export const revalidate = 3600;

/** News & Insights joins the navbar only once there is something to read. */
const BLOG_NAV_MIN_POSTS = 3;

async function hasEnoughPosts(): Promise<boolean> {
  try {
    const count = await sanityServerClient.fetch<number>(PUBLISHED_POSTS_COUNT_QUERY);
    return count >= BLOG_NAV_MIN_POSTS;
  } catch {
    return false;
  }
}

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
        <JsonLd data={organizationJsonLd()} />
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
