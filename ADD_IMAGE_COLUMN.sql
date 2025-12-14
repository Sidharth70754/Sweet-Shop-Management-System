

-- Add image_url column to sweets table 
ALTER TABLE public.sweets 
ADD COLUMN IF NOT EXISTS image_url TEXT;


