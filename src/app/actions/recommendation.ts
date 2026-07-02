'use server'

import { createClient } from '@/lib/supabase/server';
import { QuizState, SkinConcern } from '@/types/quiz';

// Environments where heat and moisture in the air demand lightweight, breathable formulas
const HIGH_HUMIDITY_ENVIRONMENTS = ['humid', 'tropical'];

// Actives that counter humid/tropical concerns (oil regulation, antioxidant UV defense)
const HUMID_CLIMATE_PRIORITY_ACTIVES = ['niacinamide', 'vitamin c'];

export type AffiliatePlatform = 'Shopee' | 'Lazada' | 'TikTok Shop';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen';
  skin_type_target: string[];
  concern_target: string[];
  sensitivity_safe: boolean;
  texture: 'gel' | 'liquid' | 'lotion' | 'cream' | 'balm' | 'stick';
  is_occlusive: boolean;
  key_actives: string[];
  climate_target: string[];
  affiliate_platform: AffiliatePlatform;
  affiliate_url: string;
  fallback_url: string | null;
  image_url: string;
}

import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function getRecommendedRoutine(quizPayload: QuizState) {
  let products: Product[] = [];

  // Demo Mode: Use mock data if Supabase keys are missing or invalid
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url') {
    console.log('Running in Demo Mode with mock data');
    products = MOCK_PRODUCTS;
  } else {
    const supabase = await createClient();
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data) {
      console.error('Error fetching products, falling back to mock data:', error);
      products = MOCK_PRODUCTS;
    } else {
      products = data as Product[];
    }
  }

  // 2. Logic to filter and select one product per category
  const categories: Product['category'][] = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'];
  const routine: Product[] = [];

  const isHumidProfile = Boolean(
    quizPayload.environment && HIGH_HUMIDITY_ENVIRONMENTS.includes(quizPayload.environment)
  );

  for (const category of categories) {
    let filtered = products.filter(p => p.category === category);

    // Filter by skin type
    filtered = filtered.filter(p => p.skin_type_target.includes(quizPayload.skinType!));

    // Filter by sensitivity (if high, only sensitivity_safe)
    if (quizPayload.sensitivity === 'high') {
      filtered = filtered.filter(p => p.sensitivity_safe);
    }

    // Climate-first: humid/tropical profiles exclude heavy, occlusive creams
    // that trap moisture and heat against the skin
    if (isHumidProfile) {
      filtered = filtered.filter(p => !p.is_occlusive);
    }

    // Score products, weighting climate fit above concern match and active ingredients
    const scored = filtered.map(p => {
      const climateScore = quizPayload.environment && p.climate_target.includes(quizPayload.environment) ? 3 : 0;

      const concernScore = p.concern_target.filter(c =>
        quizPayload.concerns.includes(c as SkinConcern)
      ).length;

      const activeScore = isHumidProfile && p.key_actives.some(a => HUMID_CLIMATE_PRIORITY_ACTIVES.includes(a))
        ? 2
        : 0;

      return { product: p, score: climateScore + concernScore + activeScore };
    });

    // Sort by score and pick the best one
    scored.sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      routine.push(scored[0].product);
    } else {
      // Fallback: relax climate/occlusive constraints but keep skin type match,
      // so a full routine is always returned
      const fallback = products.find(p => p.category === category && p.skin_type_target.includes(quizPayload.skinType!));
      if (fallback) routine.push(fallback);
    }
  }

  return routine;
}
