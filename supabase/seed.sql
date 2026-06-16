INSERT INTO public.products (name, brand, description, price, category, skin_type_target, concern_target, sensitivity_safe, subscription_discount_percent)
VALUES
-- Cleansers
('Low pH Good Morning Gel Cleanser', 'COSRX', 'A gentle gel cleanser that maintains skin''s optimal pH level.', 45.00, 'cleanser', '{oily, combination, normal}', '{acne, texture}', true, 10),
('CoalFace Soap', 'Kayman Beauty', 'A deep cleansing soap with activated charcoal and honey.', 35.00, 'cleanser', '{oily, combination}', '{acne, pores}', false, 15),
('Gentle Skin Cleanser', 'Cetaphil', 'A mild, non-irritating formulation that soothes skin as it cleans.', 65.00, 'cleanser', '{dry, normal}', '{}', true, 15),

-- Toners
('BHA Blackhead Power Liquid', 'COSRX', 'Helps to clear congested pores and prevent breakouts.', 85.00, 'toner', '{oily, combination}', '{acne, pores, texture}', false, 15),
('Cera-Mila Toner', 'Tatagaltier', 'Milky toner with ceramides to hydrate and strengthen skin barrier.', 79.00, 'toner', '{dry, normal, combination}', '{dullness, texture}', true, 20),
('Supple Preparation Unscented Toner', 'Klairs', 'Hydrating toner that balances the skin''s pH level.', 95.00, 'toner', '{dry, normal, oily, combination}', '{}', true, 15),

-- Serums
('The Ordinary Niacinamide 10% + Zinc 1%', 'The Ordinary', 'High-strength vitamin and mineral blemish formula.', 40.00, 'serum', '{oily, combination}', '{acne, pores}', false, 10),
('Skintific 5X Ceramide Barrier Repair Serum', 'Skintific', 'A serum that focuses on repairing and maintaining the skin barrier.', 69.00, 'serum', '{dry, combination, normal}', '{texture}', true, 15),
('Skintelligent Serum', 'Kayman Beauty', 'Brightening serum with Vitamin C and Alpha Arbutin.', 89.00, 'serum', '{normal, combination, dry}', '{pigmentation, dullness}', true, 15),

-- Moisturizers
('Oil-Free Ultra-Moisturizing Lotion', 'COSRX', 'Weightless moisturizer with birch sap to calm and treat sensitive skin.', 82.00, 'moisturizer', '{oily, combination}', '{}', true, 15),
('Self-Love Moisturizer', 'Chuck''s', 'Deeply hydrating moisturizer with oat extract and honey.', 98.00, 'moisturizer', '{dry, normal}', '{aging}', true, 15),
('Snail 92 All In One Cream', 'COSRX', 'Fast-absorbing cream that nourishes and hydrates skin without greasiness.', 75.00, 'moisturizer', '{combination, oily}', '{texture, aging}', true, 15),

-- Sunscreens
('Airy Sunscreen', 'Chuck''s', 'Lightweight, no white cast sunscreen suitable for humid climates.', 75.00, 'sunscreen', '{oily, combination, normal}', '{}', true, 20),
('Sunstick', 'Tatagaltier', 'Convenient sun protection with a matte finish.', 65.00, 'sunscreen', '{oily, combination}', '{}', true, 15),
('Relief Sun : Rice + Probiotics', 'Beauty of Joseon', 'Creamy sunscreen that hydrates while protecting.', 55.00, 'sunscreen', '{dry, normal}', '{aging}', true, 15);
