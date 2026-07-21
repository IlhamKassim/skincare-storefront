import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('HomePage');

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-320px)] text-center px-4 bg-gradient-to-b from-background to-secondary/20">
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

      <div className="max-w-2xl mx-auto text-center px-4 py-16 border-t border-border">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
          {t('aboutTeaserTitle')}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t('aboutTeaserBody')}
        </p>
        <Link href="/about" className="text-primary font-medium underline underline-offset-2 hover:no-underline">
          {t('aboutTeaserLink')}
        </Link>
      </div>
    </div>
  );
}
