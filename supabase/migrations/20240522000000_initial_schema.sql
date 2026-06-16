-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen')),
    skin_type_target TEXT[] NOT NULL DEFAULT '{}',
    concern_target TEXT[] NOT NULL DEFAULT '{}',
    sensitivity_safe BOOLEAN DEFAULT true,
    stripe_price_id TEXT,
    subscription_discount_percent INTEGER DEFAULT 15,
    image_url TEXT,
    stock_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    answers JSONB NOT NULL,
    recommended_routine JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read
CREATE POLICY "Allow public read access to products"
ON public.products FOR SELECT
TO public
USING (true);

-- Quiz Results: Users can only see their own results
CREATE POLICY "Allow users to view their own quiz results"
ON public.quiz_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own quiz results"
ON public.quiz_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
