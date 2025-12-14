import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreHorizontal, Pencil, Package, Trash2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

interface SweetsTableProps {
  sweets: Sweet[];
  onEdit: (sweet: Sweet) => void;
  onRestock: (sweet: Sweet) => void;
  onDelete: (id: string) => Promise<void>;
}

export function SweetsTable({ sweets, onEdit, onRestock, onDelete }: SweetsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sweetToDelete = sweets.find(s => s.id === deleteId);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    await onDelete(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="text-right font-semibold">Price</TableHead>
                <TableHead className="text-right font-semibold">Stock</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sweets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="font-medium">No sweets found</p>
                      <p className="text-sm mt-1">Add your first sweet to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sweets.map((sweet) => {
                  const isOutOfStock = sweet.quantity === 0;
                  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 10;

                  return (
                    <TableRow key={sweet.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{sweet.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sweet.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{Number(sweet.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-medium ${
                            isOutOfStock 
                              ? 'text-destructive' 
                              : isLowStock 
                                ? 'text-warning' 
                                : ''
                          }`}>
                            {sweet.quantity}
                          </span>
                          {isLowStock && !isOutOfStock && (
                            <Badge variant="outline" className="text-warning border-warning/30">
                              Low
                            </Badge>
                          )}
                          {isOutOfStock && (
                            <Badge variant="destructive">
                              Out
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(sweet)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRestock(sweet)}>
                              <Package className="mr-2 h-4 w-4" />
                              Restock
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteId(sweet.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {sweetToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this sweet
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
