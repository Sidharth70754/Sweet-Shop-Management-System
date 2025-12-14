import { useState } from 'react';
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
import { Loader2, Package } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
  onRestock: (id: string, quantity: number) => Promise<{ error: string | null }>;
}

export function RestockModal({ open, onOpenChange, sweet, onRestock }: RestockModalProps) {
  const [quantity, setQuantity] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleRestock = async () => {
    if (!sweet || quantity <= 0) return;

    setIsLoading(true);
    const { error } = await onRestock(sweet.id, quantity);
    setIsLoading(false);

    if (!error) {
      setQuantity(10);
      onOpenChange(false);
    }
  };

  if (!sweet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Restock {sweet.name}
          </DialogTitle>
          <DialogDescription>
            Current stock: {sweet.quantity} units
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Quantity to Add</Label>
            <Input
              id="restock-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder="Enter quantity"
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">New stock level</span>
              <span className="font-semibold text-foreground">
                {sweet.quantity + quantity} units
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRestock} disabled={isLoading || quantity <= 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Restocking...
              </>
            ) : (
              `Add ${quantity} Units`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
