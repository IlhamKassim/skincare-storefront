import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {buildPageMetadata} from '@/lib/seo';
import QuizFlow from '@/components/quiz/QuizFlow';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta.quiz'});
  return buildPageMetadata({locale, path: '/quiz', title: t('title'), description: t('description')});
}

export default function QuizPage() {
  return (
    <div className="container mx-auto">
      <QuizFlow />
    </div>
  );
}
