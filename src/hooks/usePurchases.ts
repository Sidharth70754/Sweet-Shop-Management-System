import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Purchase = Database['public']['Tables']['purchases']['Row'];
type Sweet = Database['public']['Tables']['sweets']['Row'];

interface PurchaseWithSweet extends Purchase {
  sweets: Pick<Sweet, 'name' | 'category' | 'price' | 'image_url'> | null;
}

interface PurchaseResult {
  purchase: Purchase;
  sweet: Sweet;
}

export function usePurchases() {
  const [purchases, setPurchases] = useState<PurchaseWithSweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // No user logged in, set empty purchases
        setPurchases([]);
        setIsLoading(false);
        return;
      }

      // Fetch only current user's purchases
      const { data, error: queryError } = await supabase
        .from('purchases')
        .select(`
          *,
          sweets (name, category, price, image_url)
        `)
        .eq('user_id', session.user.id) // Explicitly filter by current user
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Error fetching purchases:', queryError);
        throw queryError;
      }

      // Set purchases (empty array if no data)
      setPurchases((data as PurchaseWithSweet[]) || []);
      console.log('Fetched purchases:', data?.length || 0);
    } catch (err) {
      console.error('Error in fetchPurchases:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch purchases');
      setPurchases([]); // Set empty on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPurchase = async (
    sweetId: string,
    quantity: number,
    userId: string
  ): Promise<{ data: PurchaseResult | null; error: string | null }> => {
    try {
      console.log('Creating purchase:', { sweetId, quantity, userId });
      
      // First, get the sweet and check stock
      const { data: sweet, error: sweetError } = await supabase
        .from('sweets')
        .select('*')
        .eq('id', sweetId)
        .single();

      if (sweetError) {
        console.error('Error fetching sweet:', sweetError);
        throw sweetError;
      }
      if (!sweet) {
        throw new Error('Sweet not found');
      }

      if (sweet.quantity < quantity) {
        throw new Error(`Insufficient stock. Only ${sweet.quantity} available.`);
      }

      const totalPrice = Number(sweet.price) * quantity;

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          sweet_id: sweetId,
          quantity,
          total_price: totalPrice,
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError);
        // Provide more specific error message
        if (purchaseError.code === '42501') {
          throw new Error('Permission denied. Please ensure you are signed in and have permission to make purchases.');
        } else if (purchaseError.code === '23505') {
          throw new Error('Purchase already exists.');
        } else {
          throw new Error(purchaseError.message || 'Failed to create purchase. Please try again.');
        }
      }

      if (!purchase) {
        throw new Error('Purchase was not created. Please try again.');
      }

      // Update sweet quantity
      const newQuantity = sweet.quantity - quantity;
      const { data: updatedSweet, error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: newQuantity })
        .eq('id', sweetId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating sweet quantity:', updateError);
        throw updateError;
      }

      // Refresh purchases list
      await fetchPurchases();

      return {
        data: {
          purchase,
          sweet: updatedSweet || sweet,
        },
        error: null,
      };
    } catch (err) {
      console.error('Purchase creation error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create purchase';
      return { data: null, error: message };
    }
  };

  const deletePurchase = async (purchaseId: string): Promise<{ error: string | null }> => {
    try {
      console.log('Deleting purchase:', purchaseId);
      
      // Get current session to verify user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('You must be signed in to delete purchases');
      }
      
      // Optimistically update UI first for instant feedback
      const previousPurchases = purchases;
      setPurchases(prev => {
        const updated = prev.filter(p => p.id !== purchaseId);
        console.log('Optimistically updated purchases count:', updated.length, 'from', prev.length);
        return updated;
      });
      
      // Then delete from database
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error deleting purchase:', error);
        // Revert optimistic update on error
        setPurchases(previousPurchases);
        
        if (error.code === '42501') {
          throw new Error('Permission denied. You can only delete your own purchases.');
        }
        throw error;
      }

      console.log('Purchase deleted successfully from database');
      
      // Refresh purchases list to ensure full consistency with database
      // This will also refresh any related data
      await fetchPurchases();

      return { error: null };
    } catch (err) {
      console.error('Delete purchase error:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete purchase';
      return { error: message };
    }
  };

  return {
    purchases,
    isLoading,
    error,
    fetchPurchases,
    createPurchase,
    deletePurchase,
  };
}
