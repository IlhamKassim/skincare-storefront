'use server';

import { createClient } from '@/lib/supabase/server';
import { AffiliatePlatform } from './recommendation';

export async function trackAffiliateClick(
  productId: string,
  platform: AffiliatePlatform,
  quizResultId?: string | null
) {
  // Demo Mode: nothing to record without a real Supabase project
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-url') {
    console.log(`[demo] affiliate click: ${platform} / ${productId}`);
    return;
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('affiliate_clicks').insert({
      product_id: productId,
      affiliate_platform: platform,
      user_id: user?.id ?? null,
      quiz_result_id: quizResultId ?? null,
    });
  } catch (error) {
    // Click tracking must never block the outbound redirect
    console.error('Failed to record affiliate click:', error);
  }
}
