'use client';

import { useTranslations } from 'next-intl';
import { useQuizStore } from '@/store/useQuizStore';
import { Environment } from '@/types/quiz';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const environments: Environment[] = ['humid', 'dry', 'air-conditioned', 'tropical'];

export default function EnvironmentStep() {
  const t = useTranslations('Quiz');
  const { environment, setEnvironment, nextStep } = useQuizStore();

  const handleSelect = (env: Environment) => {
    setEnvironment(env);
    setTimeout(nextStep, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
        {t('environment.question')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {environments.map((env) => (
          <Card
            key={env}
            className={cn(
              'cursor-pointer transition-all hover:border-black border-2',
              environment === env ? 'border-black bg-gray-50' : 'border-transparent'
            )}
            onClick={() => handleSelect(env)}
          >
            <CardContent className="p-6 flex items-center justify-center min-h-[80px]">
              <h3 className="font-bold text-lg text-center">{t(`environment.${env}`)}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
