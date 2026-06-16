'use server'

import { createClient } from '@/lib/supabase/server';
import { QuizState, SkinConcern } from '@/types/quiz';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen';
  skin_type_target: string[];
  concern_target: string[];
  sensitivity_safe: boolean;
  stripe_price_id: string;
  subscription_discount_percent: number;
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

  for (const category of categories) {
    let filtered = products.filter(p => p.category === category);

    // Filter by skin type
    filtered = filtered.filter(p => p.skin_type_target.includes(quizPayload.skinType!));

    // Filter by sensitivity (if high, only sensitivity_safe)
    if (quizPayload.sensitivity === 'high') {
      filtered = filtered.filter(p => p.sensitivity_safe);
    }

    // Score products based on concerns
    const scored = filtered.map(p => {
      const matchCount = p.concern_target.filter(c => 
        quizPayload.concerns.includes(c as SkinConcern)
      ).length;
      return { product: p, score: matchCount };
    });

    // Sort by score and pick the best one
    scored.sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      routine.push(scored[0].product);
    } else {
      // Fallback: pick the first product in the category that matches skin type
      const fallback = products.find(p => p.category === category && p.skin_type_target.includes(quizPayload.skinType!));
      if (fallback) routine.push(fallback);
    }
  }

  return routine;
}
