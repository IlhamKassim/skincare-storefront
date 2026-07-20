'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { getRecommendedRoutine, Product } from '@/app/actions/recommendation';
import { trackAffiliateClick } from '@/app/actions/tracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function RoutineResults() {
  const { skinType, concerns, environment, sensitivity } = useQuizStore();
  const [routine, setRoutine] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Results');

  useEffect(() => {
    async function fetchRoutine() {
      if (skinType) {
        const results = await getRecommendedRoutine({ skinType, concerns, environment, sensitivity, currentStep: 4 });
        setRoutine(results);
      }
      setLoading(false);
    }
    fetchRoutine();
  }, [skinType, concerns, environment, sensitivity]);

  const handleShopClick = (product: Product) => {
    const url = product.affiliate_url || product.fallback_url;
    if (!url) return;

    // Open immediately (synchronously) so browsers don't treat it as a blocked popup;
    // fire tracking without awaiting so it can't delay the outbound redirect.
    window.open(url, '_blank', 'noopener,noreferrer');
    trackAffiliateClick(product.id, product.affiliate_platform);
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading your routine...</div>;
  if (!routine) return <div className="text-center py-20 text-muted-foreground">No routine found. Please take the quiz again.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl font-bold mb-8 text-center text-foreground">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {routine.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="text-xs font-semibold uppercase text-accent mb-1">{product.category}</div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <div className="text-sm font-medium text-muted-foreground">{product.brand}</div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground mb-6">{product.description}</p>
              <Button
                className="mt-auto"
                onClick={() => handleShopClick(product)}
              >
                {t('shopOn', { platform: product.affiliate_platform })}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50 border-dashed border-2 border-border">
        <CardContent className="p-8 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">{t('checkoutTitle')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t('affiliateDisclaimer')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
