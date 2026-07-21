export type SkinType = 'oily' | 'dry' | 'combination' | 'normal';

export type SkinConcern = 'acne' | 'aging' | 'pigmentation' | 'texture' | 'dullness' | 'pores';

export type Environment = 'humid' | 'dry' | 'air-conditioned' | 'tropical';

export type SensitivityLevel = 'low' | 'medium' | 'high';

export interface QuizState {
  skinType: SkinType | null;
  concerns: SkinConcern[];
  environment: Environment | null;
  sensitivity: SensitivityLevel | null;
  currentStep: number;
  hasConsented: boolean;
  consentedAt: string | null;
}

export interface QuizActions {
  setSkinType: (type: SkinType) => void;
  setConcerns: (concerns: SkinConcern[]) => void;
  toggleConcern: (concern: SkinConcern) => void;
  setEnvironment: (env: Environment) => void;
  setSensitivity: (level: SensitivityLevel) => void;
  nextStep: () => void;
  prevStep: () => void;
  giveConsent: () => void;
  resetQuiz: () => void;
}
