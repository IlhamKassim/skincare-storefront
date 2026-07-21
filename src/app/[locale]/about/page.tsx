import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildPageMetadata} from '@/lib/seo';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta.about'});
  return buildPageMetadata({locale, path: '/about', title: t('title'), description: t('description')});
}

const FAQ_KEYS = ['marketplace', 'scoring', 'cost'] as const;

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('About');

  const sections = ['missionTitle', 'climateTitle', 'howTitle', 'independenceTitle', 'contactTitle'] as const;
  const bodyKeyFor = {
    missionTitle: 'missionBody',
    climateTitle: 'climateBody',
    howTitle: 'howBody',
    independenceTitle: 'independenceBody',
    contactTitle: 'contactBody',
  } as const;

  const faqEntries = FAQ_KEYS.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd)}}
      />

      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t('title')}</h1>

      <div className="space-y-6">
        {sections.map((titleKey) => (
          <div key={titleKey}>
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">
              {t(titleKey)}
            </h2>
            <p className="text-muted-foreground">{t(bodyKeyFor[titleKey])}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-border">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">{t('faqTitle')}</h2>
        <div className="space-y-4">
          {faqEntries.map((entry) => (
            <div key={entry.question}>
              <h3 className="font-medium text-foreground mb-1">{entry.question}</h3>
              <p className="text-muted-foreground text-sm">{entry.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
