import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SweetsTable } from '@/components/admin/SweetsTable';
import { SweetForm } from '@/components/admin/SweetForm';
import { RestockModal } from '@/components/admin/RestockModal';
import { useSweets } from '@/hooks/useSweets';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Package, Sparkles } from 'lucide-react';
import { sampleSweets } from '@/lib/sampleSweets';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

export default function Admin() {
  const { sweets, createSweet, updateSweet, deleteSweet, restockSweet, fetchSweets } = useSweets();
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockSweet_, setRestockSweet] = useState<Sweet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { name: string; category: string; price: number; quantity: number }) => {
    setIsSubmitting(true);
    let result;
    if (editingSweet) {
      result = await updateSweet(editingSweet.id, data);
      if (!result.error) {
        toast.success('Sweet updated');
        setShowForm(false);
        fetchSweets({}, { page: 1, pageSize: 1000 });
      }
    } else {
      result = await createSweet(data);
      if (!result.error) {
        toast.success('Sweet added');
        setShowForm(false);
        fetchSweets({}, { page: 1, pageSize: 1000 });
      }
    }
    if (result.error) toast.error(result.error);
    setIsSubmitting(false);
    setEditingSweet(null);
    return result;
  };

  const handleSeedSampleData = async () => {
    if (sweets.length > 0) {
      const confirmed = window.confirm('This will add sample sweets to your inventory. Continue?');
      if (!confirmed) return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('sweets')
        .insert(sampleSweets)
        .select();

      if (error) {
        toast.error(`Failed to add sample sweets: ${error.message}`);
      } else {
        toast.success(`Successfully added ${data?.length || 0} sample sweets!`);
        fetchSweets({}, { page: 1, pageSize: 1000 });
      }
    } catch (err) {
      toast.error('Failed to add sample sweets');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (sweet: Sweet) => { setEditingSweet(sweet); setShowForm(true); };
  const handleDelete = async (id: string) => {
    const { error } = await deleteSweet(id);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Sweet deleted');
      fetchSweets({}, { page: 1, pageSize: 1000 });
    }
  };
  const handleRestock = async (id: string, quantity: number) => {
    const { error } = await restockSweet(id, quantity);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Stock updated');
      fetchSweets({}, { page: 1, pageSize: 1000 });
    }
    return { error };
  };

  const totalItems = sweets.length;
  const lowStockItems = sweets.filter(s => s.quantity > 0 && s.quantity <= 10).length;
  const outOfStockItems = sweets.filter(s => s.quantity === 0).length;
  const totalValue = sweets.reduce((sum, s) => sum + (Number(s.price) * s.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full">
        {/* Header Section */}
        <div className="w-full bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1920px]">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">Admin Dashboard</h1>
                <p className="mt-3 text-lg text-muted-foreground">Manage your sweet inventory and track performance</p>
              </div>
              <div className="flex gap-3">
                {sweets.length === 0 && (
                  <Button 
                    onClick={handleSeedSampleData} 
                    size="lg" 
                    variant="outline"
                    disabled={isSubmitting}
                    className="shadow-card"
                  >
                    <Sparkles className="mr-2 h-5 w-5" /> 
                    Add Sample Sweets
                  </Button>
                )}
                <Button 
                  onClick={() => { setEditingSweet(null); setShowForm(true); }} 
                  size="lg" 
                  className="shadow-warm"
                >
                  <Plus className="mr-2 h-5 w-5" /> Add Sweet
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto w-full max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{totalItems}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-7 w-7" />
                </div>
              </div>
            </div>
            
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="mt-2 text-3xl font-bold text-warning">{lowStockItems}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <Package className="h-7 w-7" />
                </div>
              </div>
            </div>
            
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="mt-2 text-3xl font-bold text-destructive">{outOfStockItems}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <Package className="h-7 w-7" />
                </div>
              </div>
            </div>
            
            <div className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                  <p className="mt-2 text-3xl font-bold text-success">₹{totalValue.toFixed(0)}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Package className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>

          <SweetsTable sweets={sweets} onEdit={handleEdit} onRestock={setRestockSweet} onDelete={handleDelete} />
        </div>
      </main>

      <SweetForm open={showForm} onOpenChange={setShowForm} sweet={editingSweet} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <RestockModal open={!!restockSweet_} onOpenChange={() => setRestockSweet(null)} sweet={restockSweet_} onRestock={handleRestock} />
    </div>
  );
}
