import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildPageMetadata} from '@/lib/seo';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta.privacy'});
  return buildPageMetadata({locale, path: '/privacy', title: t('title'), description: t('description')});
}

export default async function PrivacyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Privacy');

  const sections = [
    'whatSection',
    'whySection',
    'storageSection',
    'retentionSection',
    'rightsSection',
    'contactSection',
  ] as const;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-1">{t('title')}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t('updated')}</p>

      <p className="text-foreground mb-8">{t('intro')}</p>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section}>
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">
              {t(`${section}.title`)}
            </h2>
            <p className="text-muted-foreground">{t(`${section}.body`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
