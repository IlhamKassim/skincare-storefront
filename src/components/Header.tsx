import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          SkinSync
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/quiz" className="text-sm font-medium hover:text-black/60 transition-colors">
            {t('quiz')}
          </Link>
          <Link href="/login" className="text-sm font-medium hover:text-black/60 transition-colors">
            {t('login')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
