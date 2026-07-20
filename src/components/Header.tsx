import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
          SkinSync
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/quiz" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            {t('quiz')}
          </Link>
          <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            {t('login')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
