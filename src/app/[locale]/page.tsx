import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
        {t('title')}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-10">
        {t('description')}
      </p>
      <Link
        href="/quiz"
        className="bg-black text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
      >
        {t('cta')}
      </Link>
    </div>
  );
}
