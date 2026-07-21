import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/siteConfig';

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  noIndex,
}: {
  locale: string;
  path: string;
  title: string;
  description?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
      ),
    },
    openGraph: description
      ? {
          title,
          description,
          url,
          siteName: 'SkinSync',
          locale: locale === 'ms' ? 'ms_MY' : 'en_MY',
          type: 'website',
        }
      : undefined,
    twitter: description
      ? {
          card: 'summary_large_image',
          title,
          description,
        }
      : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
