import {getTranslations, setRequestLocale} from 'next-intl/server';

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('About');

  const sections = ['missionTitle', 'howTitle', 'independenceTitle', 'contactTitle'] as const;
  const bodyKeyFor = {
    missionTitle: 'missionBody',
    howTitle: 'howBody',
    independenceTitle: 'independenceBody',
    contactTitle: 'contactBody',
  } as const;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
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
    </div>
  );
}
