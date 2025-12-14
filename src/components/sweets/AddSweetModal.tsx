import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSweets } from "@/hooks/useSweets";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddSweetModal({ open, onClose }: Props) {
  const { createSweet } = useSweets();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
    image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        price: "",
        category: "",
        quantity: "",
        image_url: "",
      });
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = Number(form.price);
    const quantity = Number(form.quantity || 0);

    if (price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    if (quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    setIsSubmitting(true);

    const result = await createSweet({
      name: form.name.trim(),
      price: price,
      category: form.category.trim(),
      quantity: quantity,
      image_url: form.image_url.trim() || undefined,
    } as any);

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Sweet added successfully! 🍬");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Sweet 🍬</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new sweet to the collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Sweet Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Kaju Katli"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category"
              placeholder="e.g., Mithai, Dessert"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                disabled={isSubmitting}
                min="0"
                step="0.01"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                disabled={isSubmitting}
                min="0"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">
              Image URL (Optional)
            </Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.image_url}
              onChange={(e) =>
                setForm({ ...form, image_url: e.target.value })
              }
              disabled={isSubmitting}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use auto-generated placeholder image
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !form.name || !form.price || !form.category}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Sweet"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
