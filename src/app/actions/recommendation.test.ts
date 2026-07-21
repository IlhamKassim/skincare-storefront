import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { Product } from './recommendation';

const FIXTURE_PRODUCTS: Product[] = [
  {
    id: 'oily-cleanser',
    name: 'Oily Cleanser A',
    brand: 'Test',
    description: '',
    category: 'cleanser',
    skin_type_target: ['oily'],
    concern_target: ['acne'],
    sensitivity_safe: true,
    texture: 'gel',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/1',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'dry-cleanser',
    name: 'Dry Cleanser B',
    brand: 'Test',
    description: '',
    category: 'cleanser',
    skin_type_target: ['dry'],
    concern_target: [],
    sensitivity_safe: true,
    texture: 'gel',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['dry'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/2',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'sensitive-safe-toner',
    name: 'Sensitive-safe Toner',
    brand: 'Test',
    description: '',
    category: 'toner',
    skin_type_target: ['oily'],
    concern_target: [],
    sensitivity_safe: true,
    texture: 'liquid',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/3',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'harsh-toner',
    name: 'Harsh Toner',
    brand: 'Test',
    description: '',
    category: 'toner',
    skin_type_target: ['oily'],
    concern_target: [],
    sensitivity_safe: false,
    texture: 'liquid',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/4',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'humid-safe-moisturizer',
    name: 'Humid-safe Moisturizer',
    brand: 'Test',
    description: '',
    category: 'moisturizer',
    skin_type_target: ['oily'],
    concern_target: [],
    sensitivity_safe: true,
    texture: 'gel',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/5',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'occlusive-moisturizer',
    name: 'Occlusive Moisturizer',
    brand: 'Test',
    description: '',
    category: 'moisturizer',
    skin_type_target: ['oily'],
    concern_target: [],
    sensitivity_safe: true,
    texture: 'cream',
    is_occlusive: true,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/6',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'serum-shopee',
    name: 'Serum Shopee',
    brand: 'Test',
    description: '',
    category: 'serum',
    skin_type_target: ['oily'],
    concern_target: ['acne'],
    sensitivity_safe: true,
    texture: 'liquid',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/7',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'serum-tiktok',
    name: 'Serum TikTok',
    brand: 'Test',
    description: '',
    category: 'serum',
    skin_type_target: ['oily'],
    concern_target: ['acne'],
    sensitivity_safe: true,
    texture: 'liquid',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'TikTok Shop',
    affiliate_url: 'https://example.com/8',
    fallback_url: null,
    image_url: '',
  },
  {
    id: 'sunscreen-a',
    name: 'Sunscreen A',
    brand: 'Test',
    description: '',
    category: 'sunscreen',
    skin_type_target: ['oily'],
    concern_target: [],
    sensitivity_safe: true,
    texture: 'liquid',
    is_occlusive: false,
    key_actives: [],
    climate_target: ['humid'],
    affiliate_platform: 'Shopee',
    affiliate_url: 'https://example.com/9',
    fallback_url: null,
    image_url: '',
  },
];

vi.mock('@/lib/mockData', () => ({ MOCK_PRODUCTS: FIXTURE_PRODUCTS }));

describe('getRecommendedRoutine', () => {
  beforeAll(() => {
    // Force Demo Mode so the function reads from the mocked MOCK_PRODUCTS
    // fixture above instead of attempting a real Supabase connection.
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  function findByCategory(routine: Product[], category: Product['category']) {
    return routine.find((p) => p.category === category);
  }

  it('filters out products that do not match the selected skin type', async () => {
    const { getRecommendedRoutine } = await import('./recommendation');
    const routine = await getRecommendedRoutine({
      skinType: 'oily',
      concerns: [],
      environment: null,
      sensitivity: null,
    });

    expect(findByCategory(routine, 'cleanser')?.name).toBe('Oily Cleanser A');
    expect(routine.some((p) => p.name === 'Dry Cleanser B')).toBe(false);
  });

  it('excludes non-sensitivity-safe products when sensitivity is high', async () => {
    const { getRecommendedRoutine } = await import('./recommendation');
    const routine = await getRecommendedRoutine({
      skinType: 'oily',
      concerns: [],
      environment: null,
      sensitivity: 'high',
    });

    expect(findByCategory(routine, 'toner')?.name).toBe('Sensitive-safe Toner');
  });

  it('excludes occlusive products in humid/tropical environments', async () => {
    const { getRecommendedRoutine } = await import('./recommendation');
    const routine = await getRecommendedRoutine({
      skinType: 'oily',
      concerns: [],
      environment: 'humid',
      sensitivity: null,
    });

    expect(findByCategory(routine, 'moisturizer')?.name).toBe('Humid-safe Moisturizer');
  });

  it('breaks ties in favor of TikTok Shop without overriding real scoring differences', async () => {
    const { getRecommendedRoutine } = await import('./recommendation');
    const routine = await getRecommendedRoutine({
      skinType: 'oily',
      concerns: ['acne'],
      environment: 'humid',
      sensitivity: null,
    });

    // Both serum fixtures match climate + concern identically; only the
    // platform differs, so the +0.5 TikTok Shop tiebreak should decide it.
    expect(findByCategory(routine, 'serum')?.affiliate_platform).toBe('TikTok Shop');
  });
});
