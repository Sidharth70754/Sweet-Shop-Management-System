import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ShoppingBag, Package, TrendingUp, ArrowRight, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Helper to get image URL
const getSweetImage = (sweet: any): string => {
  if (sweet?.image_url) return sweet.image_url;
  const sweetName = encodeURIComponent(sweet?.name || 'sweet');
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${sweetName}&backgroundColor=ffd5dc,ffe0e5,ffebef&size=400`;
};

export default function Purchases() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { purchases, isLoading, fetchPurchases, deletePurchase } = usePurchases();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch purchases when component mounts or route changes
  useEffect(() => { 
    // Only fetch purchases if user is authenticated
    if (user) {
      console.log('Fetching purchases for user:', user.id);
    fetchPurchases(); 
    } else {
      // If no user, set empty purchases
      console.log('No user authenticated, purchases will be empty');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname]);

  // Refresh purchases when navigating to this page
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchPurchases();
      }
    };
    
    // Refresh on page focus (when returning from another page)
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Calculate totals - recalculate whenever purchases change
  const totalSpent = useMemo(() => {
    if (purchases.length === 0) return 0;
    return purchases.reduce((sum, p) => sum + Number(p.total_price || 0), 0);
  }, [purchases]);

  const totalItems = useMemo(() => {
    if (purchases.length === 0) return 0;
    return purchases.reduce((sum, p) => sum + (p.quantity || 0), 0);
  }, [purchases]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b bg-background">
          <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at top, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
               }}
          />
          <div className="w-full bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8">
                <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    My Purchases
                  </span>
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">View your complete purchase history and order details</p>
            </div>

            {purchases.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="group rounded-xl border bg-card p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{purchases.length}</p>
                </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShoppingBag className="h-7 w-7" />
                      </div>
                    </div>
                  </div>
                  <div className="group rounded-xl border bg-card p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <p className="mt-2 text-3xl font-bold text-primary">{totalItems}</p>
                </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Package className="h-7 w-7" />
                      </div>
                    </div>
                  </div>
                  <div className="group rounded-xl border bg-card p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                        <p className="mt-2 text-3xl font-bold text-green-600">₹{totalSpent.toFixed(2)}</p>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                        <TrendingUp className="h-7 w-7" />
                      </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </section>

        {/* Purchases List */}
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="max-w-lg mx-auto">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <ShoppingBag className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  No Purchases Yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg leading-relaxed">
                  Your purchase history will appear here once you make your first order. 
                  Start exploring our delicious collection of premium sweets!
                </p>
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 h-auto">
                    <ArrowRight className="h-5 w-5" />
                    Browse All Sweets
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {purchases.map((purchase) => {
                const sweetImage = getSweetImage(purchase.sweets || { name: purchase.sweets?.name || 'sweet' });
                return (
                  <div key={purchase.id} className="group relative rounded-2xl border-2 bg-gradient-to-br from-card via-card to-card/95 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 border-border/50 hover:border-primary/60">
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-destructive/95 hover:bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
                      onClick={() => setDeletingId(purchase.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {/* Image */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
                      <img
                        src={sweetImage}
                        alt={purchase.sweets?.name || 'Sweet'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:brightness-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.image-fallback') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }
                        }}
                      />
                      <div className="image-fallback w-full h-full hidden items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10">
                        <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
                      </div>
                      {/* Price Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className="rounded-full bg-primary/95 backdrop-blur-md px-3 py-1.5 shadow-xl border border-primary/30">
                          <span className="text-xs font-bold text-primary-foreground">
                            ₹{Number(purchase.total_price).toFixed(0)}
                          </span>
                        </div>
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-3 right-12 z-10">
                        <div className="rounded-full bg-background/90 backdrop-blur-md px-3 py-1.5 shadow-lg border border-border/50">
                          <span className="text-xs font-semibold text-foreground">
                            {purchase.sweets?.category || 'Sweet'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-b from-card to-card/50">
                      <div className="mb-4">
                        <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {purchase.sweets?.name || 'Unknown Sweet'}
                      </h3>
                        <div className="inline-flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 px-3 py-1">
                            <p className="text-xs font-semibold text-primary">{purchase.sweets?.category || 'Sweet'}</p>
                          </div>
                    </div>
                  </div>
                  
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                    <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity</p>
                            <p className="mt-1 text-2xl font-extrabold text-foreground">{purchase.quantity}</p>
                    </div>
                    <div className="text-right">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</p>
                            <p className="mt-1 font-heading text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ₹{Number(purchase.total_price).toFixed(2)}
                      </p>
                          </div>
                    </div>
                  </div>
                  
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <span>📅</span>
                    {format(new Date(purchase.created_at), 'PPp')}
                  </p>
                </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Purchase?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this purchase? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (!deletingId || isDeleting) return;
                    const currentId = deletingId;
                    
                    setIsDeleting(true);
                    console.log('Attempting to delete purchase:', currentId);
                    
                    try {
                      const { error } = await deletePurchase(currentId);
                      
                      if (error) {
                        console.error('Delete error:', error);
                        toast.error(error);
                        setIsDeleting(false);
                        // Keep dialog open on error so user can try again
                      } else {
                        console.log('Delete successful, closing dialog and refreshing...');
                        toast.success('Purchase deleted successfully');
                        setDeletingId(null);
                        setIsDeleting(false);
                        
                        // Force immediate refresh to update all statistics and UI
                        await fetchPurchases();
                        
                        // Log for debugging
                        console.log('Purchases refreshed after delete');
                      }
                    } catch (err) {
                      console.error('Unexpected delete error:', err);
                      toast.error('An unexpected error occurred while deleting');
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
