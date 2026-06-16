'use client';

import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/store/useQuizStore';
import { SkinType } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const types: SkinType[] = ['oily', 'dry', 'combination', 'normal'];

export default function SkinTypeStep() {
  const t = useTranslations('Quiz');
  const { skinType, setSkinType, nextStep } = useQuizStore();

  const handleSelect = (type: SkinType) => {
    setSkinType(type);
    setTimeout(nextStep, 300); // Small delay for visual feedback
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
        {t('skinType.question')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type) => (
          <Card
            key={type}
            className={cn(
              'cursor-pointer transition-all hover:border-black border-2',
              skinType === type ? 'border-black bg-gray-50' : 'border-transparent'
            )}
            onClick={() => handleSelect(type)}
          >
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-1">{t(`skinType.${type}`)}</h3>
              <p className="text-sm text-gray-500">{t(`skinType.${type}Desc`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
