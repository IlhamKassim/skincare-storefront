'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/useQuizStore';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SkinTypeStep from './steps/SkinTypeStep';
import ConcernsStep from './steps/ConcernsStep';
import EnvironmentStep from './steps/EnvironmentStep';
import SensitivityStep from './steps/SensitivityStep';
import { ChevronLeft } from 'lucide-react';

const steps = [
  { id: 'skinType', component: SkinTypeStep },
  { id: 'concerns', component: ConcernsStep },
  { id: 'environment', component: EnvironmentStep },
  { id: 'sensitivity', component: SensitivityStep },
];

export default function QuizFlow() {
  const t = useTranslations('Quiz');
  const router = useRouter();
  const { currentStep, prevStep } = useQuizStore();

  const CurrentStepComponent = steps[currentStep]?.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (!CurrentStepComponent) {
      router.push('/results');
    }
  }, [CurrentStepComponent, router]);

  if (!CurrentStepComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Calculating your routine...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('buttons.back')}
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <CurrentStepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
