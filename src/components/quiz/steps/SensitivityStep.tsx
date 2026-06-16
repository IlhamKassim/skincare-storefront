'use client';

import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/store/useQuizStore';
import { SensitivityLevel } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const levels: SensitivityLevel[] = ['low', 'medium', 'high'];

export default function SensitivityStep() {
  const t = useTranslations('Quiz');
  const { sensitivity, setSensitivity, nextStep } = useQuizStore();

  const handleSelect = (level: SensitivityLevel) => {
    setSensitivity(level);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
        {t('sensitivity.question')}
      </h2>
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {levels.map((level) => (
          <Card
            key={level}
            className={cn(
              'cursor-pointer transition-all hover:border-black border-2',
              sensitivity === level ? 'border-black bg-gray-50' : 'border-transparent'
            )}
            onClick={() => handleSelect(level)}
          >
            <CardContent className="p-6 flex items-center justify-center min-h-[60px]">
              <h3 className="font-bold text-lg text-center">{t(`sensitivity.${level}`)}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Button
          size="lg"
          onClick={nextStep}
          disabled={!sensitivity}
          className="w-full md:w-auto px-12"
        >
          {t('buttons.results')}
        </Button>
      </div>
    </div>
  );
}
