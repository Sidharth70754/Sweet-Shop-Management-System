import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Image as ImageIcon } from 'lucide-react';
import { PurchaseModal } from './PurchaseModal';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'] & {
  image_url?: string | null;
};

interface SweetCardProps {
  sweet: Sweet;
  onPurchaseComplete?: () => void;
}

// Helper function to get image URL - uses placeholder if no image
const getSweetImage = (sweet: Sweet): string => {
  if (sweet.image_url) {
    return sweet.image_url;
  }
  // Generate a placeholder image based on sweet name using a placeholder service
  const sweetName = encodeURIComponent(sweet.name);
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${sweetName}&backgroundColor=ffd5dc,ffe0e5,ffebef&size=400`;
};

export function SweetCard({ sweet, onPurchaseComplete }: SweetCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 10;
  const imageUrl = getSweetImage(sweet);

  return (
    <>
      <Card className="group h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-2 border-border/50 hover:border-primary/60 shadow-lg hover:shadow-primary/20 bg-gradient-to-b from-card to-card/95">
        {/* Image Section with Overlay Effects */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {!imageError ? (
            <img
              src={imageUrl}
              alt={sweet.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:brightness-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20">
              <div className="text-center">
                <ImageIcon className="h-20 w-20 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/60">{sweet.name}</p>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3 z-20">
            <Badge variant="secondary" className="text-xs font-bold shadow-xl backdrop-blur-md bg-background/90 border border-primary/20 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all">
              {sweet.category}
            </Badge>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-3 left-3 z-20">
            <div className="rounded-full bg-primary/95 backdrop-blur-md px-3 py-1.5 shadow-xl border border-primary/30">
              <span className="text-xs font-bold text-primary-foreground">₹{Number(sweet.price).toFixed(0)}</span>
            </div>
          </div>
          
          {/* Stock Status Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/85 flex items-center justify-center backdrop-blur-sm z-30">
              <div className="text-center">
                <Badge variant="destructive" className="text-sm font-bold px-4 py-2 shadow-xl">
                  Out of Stock
                </Badge>
              </div>
            </div>
          )}
          
          {/* Low Stock Indicator */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-3 left-3 z-20">
              <Badge variant="outline" className="bg-warning/20 text-warning border-warning/50 backdrop-blur-md shadow-lg font-semibold">
                ⚠️ Low Stock
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2 pt-5 px-5">
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {sweet.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Package className={`h-4 w-4 ${
                  isOutOfStock 
                    ? 'text-destructive' 
                    : isLowStock 
                      ? 'text-warning' 
                      : 'text-primary'
                }`} />
                <span className={`font-semibold ${
                  isOutOfStock 
                    ? 'text-destructive' 
                    : isLowStock 
                      ? 'text-warning' 
                      : 'text-muted-foreground'
                }`}>
                  {isOutOfStock 
                    ? 'Out of Stock' 
                    : `${sweet.quantity} available`}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">
                  ₹{Number(sweet.price).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">per piece</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="pt-0 px-5 pb-5">
          <Button
            className="w-full font-bold text-base h-12 rounded-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            disabled={isOutOfStock}
            onClick={() => setShowPurchaseModal(true)}
            size="lg"
            variant={isOutOfStock ? "secondary" : "default"}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </Button>
        </CardFooter>
      </Card>

      <PurchaseModal
        sweet={sweet}
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        onPurchaseComplete={onPurchaseComplete}
      />
    </>
  );
}
