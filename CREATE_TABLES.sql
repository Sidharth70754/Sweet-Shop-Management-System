-- =====================================================
-- SWEET SUCCESS SUITE - DATABASE SETUP
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- =====================================================

-- Step 1: Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Step 4: Create sweets table (THIS IS THE ONE YOU'RE MISSING!)
CREATE TABLE IF NOT EXISTS public.sweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 5: Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sweet_id UUID REFERENCES public.sweets(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 6: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Step 7: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 8: Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Step 9: Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 10: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Step 11: Create trigger for sweets updated_at
DROP TRIGGER IF EXISTS update_sweets_updated_at ON public.sweets;
CREATE TRIGGER update_sweets_updated_at
  BEFORE UPDATE ON public.sweets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 12: RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Step 13: RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 14: RLS Policies for sweets (IMPORTANT - Allows viewing sweets for authenticated users)
-- This policy allows any authenticated user to view all sweets
DROP POLICY IF EXISTS "Anyone can view sweets" ON public.sweets;
CREATE POLICY "Anyone can view sweets"
  ON public.sweets FOR SELECT
  TO authenticated
  USING (true);
  
-- If you want to allow unauthenticated viewing, uncomment the following:
-- DROP POLICY IF EXISTS "Public can view sweets" ON public.sweets;
-- CREATE POLICY "Public can view sweets"
--   ON public.sweets FOR SELECT
--   TO anon, authenticated
--   USING (true);

-- Allow public to view sweets (optional - if you want unauthenticated viewing, uncomment this)
-- DROP POLICY IF EXISTS "Public can view sweets" ON public.sweets;
-- CREATE POLICY "Public can view sweets"
--   ON public.sweets FOR SELECT
--   TO anon, authenticated
--   USING (true);

DROP POLICY IF EXISTS "Admins can insert sweets" ON public.sweets;
CREATE POLICY "Admins can insert sweets"
  ON public.sweets FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update sweets" ON public.sweets;
CREATE POLICY "Admins can update sweets"
  ON public.sweets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete sweets" ON public.sweets;
CREATE POLICY "Admins can delete sweets"
  ON public.sweets FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 15: RLS Policies for purchases
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all purchases" ON public.purchases;
CREATE POLICY "Admins can view all purchases"
  ON public.purchases FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can create their own purchases" ON public.purchases;
CREATE POLICY "Users can create their own purchases"
  ON public.purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own purchases
DROP POLICY IF EXISTS "Users can delete their own purchases" ON public.purchases;
CREATE POLICY "Users can delete their own purchases"
  ON public.purchases FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 16: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sweets_category ON public.sweets(category);
CREATE INDEX IF NOT EXISTS idx_sweets_name ON public.sweets(name);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_sweet_id ON public.purchases(sweet_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- =====================================================
-- ✅ DONE! You should see "Success. No rows returned"
-- =====================================================
-- Now refresh your app and sweets should load!
-- =====================================================

