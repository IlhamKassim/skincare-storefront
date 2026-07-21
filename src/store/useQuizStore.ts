import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizState, QuizActions } from '@/types/quiz';

const initialState: QuizState = {
  skinType: null,
  concerns: [],
  environment: null,
  sensitivity: null,
  currentStep: 0,
  hasConsented: false,
  consentedAt: null,
};

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSkinType: (skinType) => set({ skinType }),
      
      setConcerns: (concerns) => set({ concerns }),
      
      toggleConcern: (concern) => set((state) => {
        const isSelected = state.concerns.includes(concern);
        if (isSelected) {
          return { concerns: state.concerns.filter((c) => c !== concern) };
        } else {
          return { concerns: [...state.concerns, concern] };
        }
      }),

      setEnvironment: (environment) => set({ environment }),

      setSensitivity: (sensitivity) => set({ sensitivity }),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

      giveConsent: () => set({ hasConsented: true, consentedAt: new Date().toISOString() }),

      resetQuiz: () => set((state) => ({
        ...initialState,
        hasConsented: state.hasConsented,
        consentedAt: state.consentedAt,
      })),
    }),
    {
      name: 'skinsync-quiz-storage',
    }
  )
);
