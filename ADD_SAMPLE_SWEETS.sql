-- =====================================================
-- ADD SAMPLE SWEETS TO YOUR DATABASE
-- Run this AFTER creating the tables
-- =====================================================

-- Insert sample sweets data with image URLs
INSERT INTO public.sweets (name, category, price, quantity, image_url) VALUES
('Kaju Katli', 'Mithai', 450.00, 50, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop'),
('Gulab Jamun', 'Mithai', 300.00, 75, 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=400&h=400&fit=crop'),
('Rasgulla', 'Mithai', 280.00, 60, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop'),
('Barfi', 'Mithai', 350.00, 40, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=400&h=400&fit=crop'),
('Ladoo', 'Mithai', 320.00, 55, 'https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=400&h=400&fit=crop'),
('Jalebi', 'Mithai', 250.00, 30, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop'),
('Rasmalai', 'Mithai', 380.00, 45, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop'),
('Peda', 'Mithai', 400.00, 50, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=400&h=400&fit=crop'),
('Soan Papdi', 'Mithai', 220.00, 65, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop'),
('Besan Ladoo', 'Mithai', 280.00, 50, 'https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=400&h=400&fit=crop'),
('Kheer', 'Dessert', 150.00, 25, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop'),
('Gajar Halwa', 'Dessert', 200.00, 20, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop'),
('Rabri', 'Dessert', 180.00, 15, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop'),
('Shrikhand', 'Dessert', 160.00, 30, 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop'),
('Chocolate Barfi', 'Mithai', 420.00, 35, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=400&h=400&fit=crop'),
('Coconut Barfi', 'Mithai', 300.00, 40, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=400&h=400&fit=crop'),
('Motichoor Ladoo', 'Mithai', 350.00, 45, 'https://images.unsplash.com/photo-1606756790138-26100a9fd0a1?w=400&h=400&fit=crop'),
('Kalakand', 'Mithai', 380.00, 30, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=400&h=400&fit=crop'),
('Mysore Pak', 'Mithai', 400.00, 25, 'https://images.unsplash.com/photo-1606312619070-d48b4d718a42?w=400&h=400&fit=crop'),
('Badam Halwa', 'Dessert', 450.00, 20, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ✅ Done! Check your Table Editor to see the sweets
-- =====================================================

