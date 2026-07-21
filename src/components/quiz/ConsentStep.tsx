'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/store/useQuizStore';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export default function ConsentStep() {
  const t = useTranslations('Consent');
  const { giveConsent } = useQuizStore();
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="font-heading text-2xl font-bold text-center mb-2 text-foreground">
        {t('title')}
      </h1>
      <p className="text-center text-muted-foreground mb-8">{t('intro')}</p>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-accent mb-1">
              {t('whatTitle')}
            </h3>
            <p className="text-sm text-foreground">{t('what')}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-accent mb-1">
              {t('whyTitle')}
            </h3>
            <p className="text-sm text-foreground">{t('why')}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-accent mb-1">
              {t('storageTitle')}
            </h3>
            <p className="text-sm text-foreground">{t('storage')}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-accent mb-1">
              {t('retentionTitle')}
            </h3>
            <p className="text-sm text-foreground">{t('retention')}</p>
          </div>

          <label className="flex items-start gap-3 pt-2 cursor-pointer">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => setChecked(value === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground">
              {t.rich('checkboxLabel', {
                privacyLink: (chunks) => (
                  <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2 hover:no-underline">
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>

          <Button
            size="lg"
            className="w-full"
            disabled={!checked}
            onClick={giveConsent}
          >
            {t('continue')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
