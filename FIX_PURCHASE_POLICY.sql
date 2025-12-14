
-- Ensure users can create purchases
DROP POLICY IF EXISTS "Users can create their own purchases" ON public.purchases;
CREATE POLICY "Users can create their own purchases"
  ON public.purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure users can delete their own purchases
DROP POLICY IF EXISTS "Users can delete their own purchases" ON public.purchases;
CREATE POLICY "Users can delete their own purchases"
  ON public.purchases FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);




