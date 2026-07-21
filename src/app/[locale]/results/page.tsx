import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {buildPageMetadata} from '@/lib/seo';
import RoutineResults from '@/components/recommendation/RoutineResults';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta.results'});
  return buildPageMetadata({locale, path: '/results', title: t('title'), noIndex: true});
}

export default function ResultsPage() {
  return (
    <div className="container mx-auto">
      <RoutineResults />
    </div>
  );
}
