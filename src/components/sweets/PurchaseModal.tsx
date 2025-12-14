import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { usePurchases } from '@/hooks/usePurchases';
import { toast } from 'sonner';
import { Loader2, Minus, Plus, CheckCircle, ShoppingBag } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'] & {
  image_url?: string | null;
};

interface PurchaseModalProps {
  sweet: Sweet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseComplete?: () => void;
}

// Helper function to get image URL
const getSweetImage = (sweet: Sweet): string => {
  if (sweet.image_url) {
    return sweet.image_url;
  }
  const sweetName = encodeURIComponent(sweet.name);
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${sweetName}&backgroundColor=ffd5dc,ffe0e5,ffebef&size=400`;
};

export function PurchaseModal({ sweet, open, onOpenChange, onPurchaseComplete }: PurchaseModalProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useAuth();
  const { createPurchase, fetchPurchases } = usePurchases();

  const totalPrice = Number(sweet.price) * quantity;
  const maxQuantity = sweet.quantity;
  const imageUrl = getSweetImage(sweet);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please sign in to make a purchase');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} items available`);
      return;
    }

    setIsLoading(true);

    const { data, error } = await createPurchase(sweet.id, quantity, user.id);

    setIsLoading(false);

    if (error) {
      console.error('Purchase error:', error);
      toast.error(error || 'Failed to create purchase. Please try again.');
      return;
    }

    if (!data) {
      toast.error('Purchase failed. Please try again.');
      return;
    }

    setShowSuccess(true);
    
    toast.success(`Successfully purchased ${quantity}x ${sweet.name}!`, {
      duration: 3000,
    });
    
    // Call completion callback first to refresh sweets list
    onPurchaseComplete?.();
    
    // Refresh purchases list to ensure it's up to date
    try {
      await fetchPurchases();
      console.log('Purchases refreshed after purchase');
    } catch (err) {
      console.error('Error refreshing purchases:', err);
    }
    
    // Wait a moment for purchase to be saved, then redirect
    setTimeout(() => {
      setShowSuccess(false);
      setQuantity(1);
      onOpenChange(false);
      // Navigate to purchases page to show the new purchase
      console.log('Redirecting to purchases page');
      navigate('/purchases');
    }, 2000);
  };

  const handleClose = () => {
    if (!isLoading && !showSuccess) {
      setQuantity(1);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500 animate-in zoom-in duration-500" />
              <div className="absolute inset-0 h-20 w-20 rounded-full bg-green-500/20 animate-ping" />
            </div>
            <h3 className="mt-6 font-heading text-2xl font-bold text-foreground">Purchase Complete! 🎉</h3>
            <p className="mt-2 text-muted-foreground text-center">
              You've successfully purchased {quantity}x {sweet.name}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Redirecting to your purchases...</p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                  onOpenChange(false);
                }}
              >
                Stay Here
              </Button>
              <Button
                onClick={() => {
                  navigate('/purchases');
                  onOpenChange(false);
                }}
                className="gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                View Purchases
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <DialogTitle className="font-heading text-xl">
                    Purchase {sweet.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    ₹{Number(sweet.price).toFixed(2)} per piece • {sweet.quantity} in stock
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold text-primary">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{quantity} × ₹{Number(sweet.price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handlePurchase} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Confirm Purchase • ₹{totalPrice.toFixed(2)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
