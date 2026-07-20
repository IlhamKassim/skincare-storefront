import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('HomePage');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 bg-gradient-to-b from-background to-secondary/20">
      <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
        {t('title')}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-10">
        {t('description')}
      </p>
      <Link
        href="/quiz"
        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium shadow-sm hover:bg-primary/90 hover:shadow-md transition-all"
      >
        {t('cta')}
      </Link>
    </div>
  );
}
