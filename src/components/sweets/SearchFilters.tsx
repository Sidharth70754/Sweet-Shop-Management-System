import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  categories: string[];
  onFiltersChange: (filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export function SearchFilters({ categories, onFiltersChange }: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange({
        search: search || undefined,
        category: category && category !== "all" ? category : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, category, minPrice, maxPrice, onFiltersChange]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters = search || (category && category !== 'all') || minPrice || maxPrice;

  return (
    <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sweets by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 border-border/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 border-border/50 focus:border-primary transition-colors">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Min Price</label>
          <Input
            type="number"
            placeholder="₹ Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
            step="0.01"
            className="h-11 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Max Price</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="₹ Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min={0}
              step="0.01"
              className="h-11 flex-1 border-border/50 focus:border-primary transition-colors"
            />
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="h-11 w-11 border-border/50 hover:bg-destructive/10 hover:border-destructive/50 transition-colors"
                title="Clear all filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
