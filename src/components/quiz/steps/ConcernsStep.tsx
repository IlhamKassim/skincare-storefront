'use client';

import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/store/useQuizStore';
import { SkinConcern } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const concerns: SkinConcern[] = ['acne', 'aging', 'pigmentation', 'texture', 'dullness', 'pores'];

export default function ConcernsStep() {
  const t = useTranslations('Quiz');
  const { concerns: selectedConcerns, toggleConcern, nextStep } = useQuizStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-center mb-2">
        {t('concerns.question')}
      </h2>
      <p className="text-center text-gray-500 mb-8">
        {selectedConcerns.length} / 3 selected
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concerns.map((concern) => {
          const isSelected = selectedConcerns.includes(concern);
          const isDisabled = !isSelected && selectedConcerns.length >= 3;

          return (
            <Card
              key={concern}
              className={cn(
                'cursor-pointer transition-all border-2',
                isSelected ? 'border-black bg-gray-50' : 'border-transparent',
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'
              )}
              onClick={() => !isDisabled && toggleConcern(concern)}
            >
              <CardContent className="p-6 flex items-center justify-center min-h-[80px]">
                <h3 className="font-bold text-lg text-center">{t(`concerns.${concern}`)}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-center mt-12">
        <Button
          size="lg"
          onClick={nextStep}
          disabled={selectedConcerns.length === 0}
          className="w-full md:w-auto px-12"
        >
          {t('buttons.next')}
        </Button>
      </div>
    </div>
  );
}
