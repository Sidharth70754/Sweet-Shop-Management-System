-- =====================================================
-- VERIFY AND FIX DELETE PURCHASE PERMISSIONS
-- Run this to ensure delete functionality works
-- =====================================================

-- First, check if the policy exists
-- If it doesn't exist, create it
-- If it exists, drop and recreate to ensure it's correct

-- Drop existing policy if any
DROP POLICY IF EXISTS "Users can delete their own purchases" ON public.purchases;

-- Create/Recreate the delete policy
CREATE POLICY "Users can delete their own purchases"
  ON public.purchases FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Verify RLS is enabled on purchases table
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ✅ Done! Delete should now work properly
-- =====================================================
-- Test by deleting a purchase from the UI
-- =====================================================

