import type { Metadata } from "next";
import { Rubik, Nunito_Sans, Geist_Mono } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {routing} from '@/i18n/routing';
import {SITE_URL} from '@/lib/siteConfig';

const rubik = Rubik({
  variable: "--font-heading",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SkinSync | Curated Skincare Routine",
  description: "Personalized skincare routines for the Malaysian market.",
  verification: {
    google: "uasgejZ33_WcX1uXn8TthQayfIgG4IfLuvVV0b4pTUA",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Enable static rendering support
  setRequestLocale(locale);
  
  const messages = await getMessages();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SkinSync',
    url: SITE_URL,
    description: 'Independent, climate-aware skincare diagnostic quiz for the Malaysian market.',
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SkinSync',
    url: SITE_URL,
  };

  return (
    <html lang={locale}>
      <body
        className={`${rubik.variable} ${nunitoSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(organizationJsonLd)}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(websiteJsonLd)}}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
