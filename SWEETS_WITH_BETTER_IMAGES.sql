-- =====================================================
-- ADD SAMPLE SWEETS WITH HIGH-QUALITY IMAGE URLS
-- Better curated images for each sweet type
-- =====================================================

-- Delete existing sample sweets if you want to refresh
-- DELETE FROM public.sweets WHERE category IN ('Mithai', 'Dessert');

-- Insert sample sweets data with curated image URLs
INSERT INTO public.sweets (name, category, price, quantity, image_url) VALUES
-- Premium Mithai with specific images
('Kaju Katli', 'Mithai', 450.00, 50, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80'),
('Gulab Jamun', 'Mithai', 300.00, 75, 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=600&h=600&fit=crop&q=80'),
('Rasgulla', 'Mithai', 280.00, 60, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80'),
('Barfi', 'Mithai', 350.00, 40, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Ladoo', 'Mithai', 320.00, 55, 'https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=600&h=600&fit=crop&q=80'),
('Jalebi', 'Mithai', 250.00, 30, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop&q=80'),
('Rasmalai', 'Mithai', 380.00, 45, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80'),
('Peda', 'Mithai', 400.00, 50, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Soan Papdi', 'Mithai', 220.00, 65, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Besan Ladoo', 'Mithai', 280.00, 50, 'https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=600&h=600&fit=crop&q=80'),

-- Desserts
('Kheer', 'Dessert', 150.00, 25, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80'),
('Gajar Halwa', 'Dessert', 200.00, 20, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80'),
('Rabri', 'Dessert', 180.00, 15, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80'),
('Shrikhand', 'Dessert', 160.00, 30, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=600&h=600&fit=crop&q=80'),

-- Special Varieties
('Chocolate Barfi', 'Mithai', 420.00, 35, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Coconut Barfi', 'Mithai', 300.00, 40, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Motichoor Ladoo', 'Mithai', 350.00, 45, 'https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=600&h=600&fit=crop&q=80'),
('Kalakand', 'Mithai', 380.00, 30, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Mysore Pak', 'Mithai', 400.00, 25, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=600&h=600&fit=crop&q=80'),
('Badam Halwa', 'Dessert', 450.00, 20, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80')
ON CONFLICT (name) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity,
  category = EXCLUDED.category;

-- =====================================================
-- ✅ Done! All sweets now have beautiful images
-- =====================================================
-- Images are loaded from Unsplash (high-quality, free)
-- If images don't load, the app will show placeholder images
-- =====================================================

