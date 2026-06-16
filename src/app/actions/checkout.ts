'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { redirect } from 'next/navigation';
import { Product } from './recommendation';

export async function createCheckoutSession(products: Product[], mode: 'payment' | 'subscription' = 'payment') {
  // Demo Mode check
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your-stripe-secret-key') {
    console.log('Running in Demo Mode: Checkout session bypassed');
    // In a real demo, you might redirect to a "Coming Soon" or success page
    redirect('/dashboard?demo=true');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const line_items = products.map((product) => ({
    price: product.stripe_price_id, // Ensure this exists in your DB
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items,
    mode,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?canceled=true`,
    subscription_data: mode === 'subscription' ? {
      description: 'Monthly Skincare Routine Replenishment',
    } : undefined,
  });

  if (session.url) {
    redirect(session.url);
  }
}
