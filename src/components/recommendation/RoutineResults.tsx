'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/store/useQuizStore';
import { getRecommendedRoutine, Product } from '@/app/actions/recommendation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/app/actions/checkout';
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

  if (loading) return <div className="text-center py-20">Loading your routine...</div>;
  if (!routine) return <div className="text-center py-20">No routine found. Please take the quiz again.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {routine.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="text-xs font-semibold uppercase text-gray-500 mb-1">{product.category}</div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <div className="text-sm font-medium text-gray-600">{product.brand}</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              <div className="text-lg font-bold">RM {product.price}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50 border-dashed border-2">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('checkoutTitle')}</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('checkoutDesc')}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => createCheckoutSession(routine, 'payment')} variant="outline">
              {t('oneTime')}
            </Button>
            <Button size="lg" onClick={() => createCheckoutSession(routine, 'subscription')}>
              {t('subscribe')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
