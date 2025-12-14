-- =====================================================
-- ADD IMAGE_URL COLUMN TO SWEETS TABLE
-- Run this if you already created the tables without image_url
-- =====================================================

-- Add image_url column to sweets table (if it doesn't exist)
ALTER TABLE public.sweets 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =====================================================
-- ✅ Done! Your sweets table now supports images
-- =====================================================

