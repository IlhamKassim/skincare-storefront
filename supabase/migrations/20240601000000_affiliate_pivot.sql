-- Pivot: drop direct-sales/checkout fields, add affiliate outbound + climate-fit fields

ALTER TABLE public.products
    DROP COLUMN IF EXISTS price,
    DROP COLUMN IF EXISTS stock_count,
    DROP COLUMN IF EXISTS stripe_price_id,
    DROP COLUMN IF EXISTS subscription_discount_percent;

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS affiliate_platform TEXT NOT NULL DEFAULT 'Shopee'
        CHECK (affiliate_platform IN ('Shopee', 'Lazada', 'TikTok Shop')),
    ADD COLUMN IF NOT EXISTS affiliate_url TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS fallback_url TEXT,
    ADD COLUMN IF NOT EXISTS texture TEXT NOT NULL DEFAULT 'lotion'
        CHECK (texture IN ('gel', 'liquid', 'lotion', 'cream', 'balm', 'stick')),
    ADD COLUMN IF NOT EXISTS is_occlusive BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS key_actives TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS climate_target TEXT[] NOT NULL DEFAULT '{humid,dry,air-conditioned,tropical}';

ALTER TABLE public.products ALTER COLUMN affiliate_platform DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN affiliate_url DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN texture DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN climate_target DROP DEFAULT;

-- Track outbound affiliate click-through for CTR monitoring
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id),
    user_id UUID REFERENCES auth.users(id),
    affiliate_platform TEXT NOT NULL,
    quiz_result_id UUID REFERENCES public.quiz_results(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous quiz-takers) can log an outbound click
CREATE POLICY "Allow public insert of affiliate clicks"
ON public.affiliate_clicks FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can review their own click history
CREATE POLICY "Allow users to view their own affiliate clicks"
ON public.affiliate_clicks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
