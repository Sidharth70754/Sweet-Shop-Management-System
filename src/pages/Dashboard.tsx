import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
// Assuming SweetCard implements professional hover/shadow effects
import { SweetCard } from "@/components/sweets/SweetCard"; 
import { AddSweetModal } from "@/components/sweets/AddSweetModal";
import { SearchFilters } from "@/components/sweets/SearchFilters";
import { useSweets } from "@/hooks/useSweets";
import { useAuth } from "@/hooks/useAuth";
import {
  Loader2,
  Package,
  Plus,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Filters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Component for a Skeletal Loading Card
const SweetCardSkeleton = () => (
  <div className="rounded-xl border overflow-hidden shadow-lg animate-pulse">
    <div className="aspect-square bg-gradient-to-br from-muted/70 to-muted/50" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-muted/70 rounded w-3/4" />
      <div className="h-4 bg-muted/70 rounded w-1/2" />
      <div className="h-10 bg-muted/70 rounded w-full mt-4" />
    </div>
  </div>
);

export default function Dashboard() {
  const location = useLocation();
  const { sweets, totalCount, isLoading, error, categories, fetchSweets } =
    useSweets();
  const { isAdmin } = useAuth();

  const [page, setPage] = useState(1);
  const [showAddSweet, setShowAddSweet] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  // NEW STATE for sticky shadow effect
  const [isFilterBarScrolled, setIsFilterBarScrolled] = useState(false); 
  const currentFiltersRef = useRef<Filters>({});
  const filterBarRef = useRef<HTMLDivElement>(null); // Ref for the sticky bar

  const pageSize = 12;

  /* ---------- STICKY SHADOW EFFECT ---------- */
  useEffect(() => {
    const handleScroll = () => {
      // Check if the scroll position is past the hero section
      const offset = filterBarRef.current?.offsetTop || 100;
      setIsFilterBarScrolled(window.scrollY > offset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    setPage(1);
    currentFiltersRef.current = {};
    setHasActiveFilters(false);
    fetchSweets({}, { page: 1, pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* ---------- FILTER HANDLING ---------- */
  const handleFiltersChange = useCallback(
    (filters: Filters) => {
      const clean = { ...filters };
      if (!clean.category || clean.category === "all") delete clean.category;

      const active = Object.values(clean).some(Boolean);
      setHasActiveFilters(active);
      setPage(1);
      currentFiltersRef.current = clean;

      fetchSweets(clean, { page: 1, pageSize });
    },
    [fetchSweets]
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchSweets(currentFiltersRef.current, { page: newPage, pageSize });
  };

  const handleRefresh = () => {
    setPage(1);
    fetchSweets(currentFiltersRef.current, { page: 1, pageSize });
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const skeletonCount = pageSize;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ================= HERO: ENHANCED VISUALS ================= */}
      <section className="relative overflow-hidden border-b bg-background">
        {/* Subtle Radial Gradient and Overlay Pattern */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at top, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
             }}
        />
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--muted)) 0, hsl(var(--muted)) 1px, transparent 1px, transparent 50px)' }}
        />

        <div className="mx-auto max-w-7xl px-4 py-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tighter">
                {/* Enhanced Gradient Text */}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Artisan Sweet Collection
                </span>{" "}
              </h1>
              {/* Using a larger, stylized icon or visual element */}
              <div className="mt-2 text-6xl">🍭</div> 
              <p className="mt-4 text-xl text-muted-foreground max-w-lg">
                Hand-crafted delights made with passion. Explore unique flavors and exceptional quality.
              </p>

              {totalCount > 0 && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-base font-semibold text-primary shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                  <Sparkles className="h-5 w-5" />
                  {totalCount} premium items available
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh Data
              </Button>

              {isAdmin && (
                <Button
                  onClick={() => setShowAddSweet(true)}
                  className="shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Sweet
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTER BAR: STICKY WITH SCROLL EFFECT ================= */}
      <div 
        ref={filterBarRef}
        className={`sticky top-[64px] z-20 border-b bg-background/95 backdrop-blur-md transition-shadow duration-300 ${
            isFilterBarScrolled ? "shadow-xl" : "shadow-sm" 
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <SearchFilters
            categories={categories}
            onFiltersChange={handleFiltersChange}
          />
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-accent-foreground">
              <AlertCircle className="h-4 w-4 text-accent" />
              <span>Filters applied. Showing refined results.</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-12">
        {error && (
          <Alert variant="destructive" className="mb-8 border-l-4 border-l-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Operation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* LOADING STATE WITH SKELETONS */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <SweetCardSkeleton key={index} />
            ))}
          </div>
        ) : sweets.length === 0 ? (
          <div className="py-24 text-center border rounded-xl bg-muted/20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2 text-primary">
              {hasActiveFilters
                ? "No Matches Found"
                : "No Sweets Available Yet"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
              {hasActiveFilters
                ? "Your current filter combination returned no results. Try broadening your search criteria."
                : isAdmin
                ? "As an Admin, start the collection by adding your first sweet now!"
                : "We are preparing our exquisite collection. Please check back soon!"}
            </p>

            {isAdmin && !hasActiveFilters && (
              <Button onClick={() => setShowAddSweet(true)} className="shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add First Sweet
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* RESULT SUMMARY */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Showing {sweets.length} results on this page 
                    <span className="text-sm font-normal text-muted-foreground">
                        (Total: {totalCount} {hasActiveFilters ? "filtered" : "items"})
                    </span>
                </div>
            </div>

            {/* GRID */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sweets.map((sweet) => (
                // Assuming SweetCard has professional hover and shadow effects
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onPurchaseComplete={() =>
                    fetchSweets(currentFiltersRef.current, {
                      page,
                      pageSize,
                    })
                  }
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  variant="outline"
                  disabled={page === 1 || isLoading}
                  onClick={() => handlePageChange(page - 1)}
                  className="w-32 transition-colors duration-200"
                >
                  Previous
                </Button>

                <span className="text-base font-bold text-primary border px-4 py-2 rounded-lg bg-primary/5">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages || isLoading}
                  onClick={() => handlePageChange(page + 1)}
                  className="w-32 transition-colors duration-200"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ADD SWEET MODAL */}
      <AddSweetModal
        open={showAddSweet}
        onClose={() => {
          setShowAddSweet(false);
          setPage(1);
          fetchSweets(currentFiltersRef.current, {
            page: 1,
            pageSize,
          });
        }}
      />
    </div>
  );
}