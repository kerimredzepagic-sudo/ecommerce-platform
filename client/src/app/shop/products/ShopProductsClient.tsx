"use client";

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  AnimatedHero,
  AnimatedCategoryTabs,
  AnimatedFilterSidebar,
  AnimatedProductGrid,
  ShopPagination,
  MobileFilterDrawer,
} from "@/components/shop";
import { SlidersHorizontal } from "lucide-react";
import { useShopProducts, useShopCategories } from "@/hooks/useShopApi";
import { Loader2, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper to convert sort state to/from URL param
function sortToParam(
  sort: { sortBy: string; sortOrder: string } | undefined,
): string | undefined {
  if (!sort) return undefined;
  if (sort.sortBy === "createdAt" && sort.sortOrder === "desc") return "newest";
  if (sort.sortBy === "price" && sort.sortOrder === "asc") return "price-low";
  if (sort.sortBy === "price" && sort.sortOrder === "desc") return "price-high";
  return undefined;
}

function paramToSort(
  param: string | null,
):
  | { sortBy: "price" | "name" | "createdAt"; sortOrder: "asc" | "desc" }
  | undefined {
  if (param === "newest") return { sortBy: "createdAt", sortOrder: "desc" };
  if (param === "price-low") return { sortBy: "price", sortOrder: "asc" };
  if (param === "price-high") return { sortBy: "price", sortOrder: "desc" };
  return undefined;
}

// Line values that correspond to product line chips (matching navbar ?line= params)
const LINE_VALUES = new Set(["originals", "premium", "health", "energy"]);

// Human-readable labels for lines
const LINE_LABELS: Record<string, string> = {
  originals: "ShopKit Originals",
  premium: "ShopKit Premium",
  health: "ShopKit Health",
  energy: "ShopKit Energy",
};

// Human-readable labels for sort options
const SORT_LABELS: Record<string, string> = {
  newest: "Najnovije",
  "price-low": "Cijena: Niska → Visoka",
  "price-high": "Cijena: Visoka → Niska",
};

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ---- All filter state derived from URL (single source of truth) ----
  const activeTab = useMemo(() => {
    const line = searchParams.get("line");
    if (line && LINE_VALUES.has(line)) return line;
    const tab = searchParams.get("tab");
    if (tab) return tab;
    return "svi";
  }, [searchParams]);

  const selectedCategory = searchParams.get("category") || undefined;

  const selectedSort = useMemo(
    () => paramToSort(searchParams.get("sort")),
    [searchParams],
  );

  const page = useMemo(() => {
    const p = searchParams.get("page");
    return p ? parseInt(p, 10) || 1 : 1;
  }, [searchParams]);

  const urlSearch = searchParams.get("search") || "";

  // ---- Local state (UI only) ----
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<
    number | undefined
  >();
  const limit = 12;

  // Sync search input from URL when navigating externally (navbar, back/forward)
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = urlSearch;
    }
  }, [urlSearch]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Debounced search handler — no state, no re-render on keystroke
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (value === urlSearch) return;
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
        params.delete("page");
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }, 2000);
    },
    [urlSearch, searchParams, pathname, router],
  );

  // ---- URL update helper ----
  const updateUrl = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      if (resetPage) params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useShopCategories();
  const categories = (categoriesData?.data || []).filter((cat) => cat.isActive);

  // Map active tab to API filters
  const tabFilters = useMemo(() => {
    if (LINE_VALUES.has(activeTab)) {
      return { line: activeTab };
    }
    switch (activeTab) {
      case "na-popustu":
        return { isOnSale: true };
      case "api-terapija":
      case "poklon-paketi":
        return {};
      default:
        return {};
    }
  }, [activeTab]);

  // Build filters for API
  const filters = useMemo(() => {
    const baseFilters: Parameters<typeof useShopProducts>[0] = {
      page,
      limit,
      isActive: true,
      ...tabFilters,
    };

    if (selectedCategory) {
      baseFilters.category = selectedCategory;
    }

    if (selectedSort) {
      baseFilters.sortBy = selectedSort.sortBy;
      baseFilters.sortOrder = selectedSort.sortOrder;
    }

    if (urlSearch) {
      baseFilters.search = urlSearch;
    }

    return baseFilters;
  }, [page, limit, selectedCategory, selectedSort, urlSearch, tabFilters]);

  // Fetch products
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useShopProducts(filters);

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // ---- Handlers (update URL directly) ----
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("line");
    params.delete("tab");
    params.delete("page");

    if (LINE_VALUES.has(tabId)) {
      params.set("line", tabId);
    } else if (tabId !== "svi") {
      params.set("tab", tabId);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    updateUrl({ category: categoryId ?? null });
  };

  const handleSortChange = (
    sort:
      | { sortBy: "price" | "name" | "createdAt"; sortOrder: "asc" | "desc" }
      | undefined,
  ) => {
    updateUrl({ sort: sortToParam(sort) ?? null });
  };

  const handleDiscountChange = (discount: number | undefined) => {
    setSelectedDiscount(discount);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage > 1 ? String(newPage) : null }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    updateUrl({ search: null });
  };

  const clearAllFilters = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    router.replace(pathname, { scroll: false });
    setSelectedDiscount(undefined);
  };

  // Check if any filters are active
  const hasActiveFilters =
    activeTab !== "svi" ||
    selectedCategory ||
    selectedSort ||
    urlSearch ||
    selectedDiscount;

  // Get active filter count for display
  const activeFilterCount = [
    activeTab !== "svi" ? 1 : 0,
    selectedCategory ? 1 : 0,
    selectedSort ? 1 : 0,
    urlSearch ? 1 : 0,
    selectedDiscount ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Animated Hero Section */}
      <AnimatedHero activeLine={LINE_VALUES.has(activeTab) ? activeTab : undefined} />

      {/* Category Tabs */}
      <section className="pb-6 border-y border-gray-200">
        {/* Search Bar */}
        <div className="mb-4 w-full">
          <div className="relative">
            <Search className="absolute left-[calc(50%-7.5rem)] top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Pretraži proizvode..."
              defaultValue={urlSearch}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 border-b border-gray-300 font-poppins text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent placeholder:text-center"
            />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedCategoryTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </section>

      {/* Main Content - Filters + Products */}
      <section className="py-4 lg:py-8">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <p className="font-oswald text-lg text-gray-900">
              {meta?.total || 0}{" "}
              <span className="text-gray-500 font-poppins text-sm font-normal">
                proizvoda
              </span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="font-oswald uppercase gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filteri
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Animated Sidebar Filters - Hidden on mobile */}
            {categoriesLoading ? (
              <aside className="hidden lg:flex w-64 flex-shrink-0 items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
              </aside>
            ) : (
              <AnimatedFilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSort={selectedSort}
                selectedDiscount={selectedDiscount}
                totalProducts={meta?.total || 0}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                onDiscountChange={handleDiscountChange}
                className="hidden lg:block"
              />
            )}

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
              selectedDiscount={selectedDiscount}
              totalProducts={meta?.total || 0}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onDiscountChange={handleDiscountChange}
            />

            {/* Animated Products Grid */}
            <div className="flex-1">
              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  {/* Line filter chip */}
                  {activeTab !== "svi" && LINE_VALUES.has(activeTab) && (
                    <button
                      onClick={() => handleTabChange("svi")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-medium hover:bg-brand-orange/20 transition-colors"
                    >
                      {LINE_LABELS[activeTab]}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  {/* Tab filter chip (na-popustu, api-terapija, etc.) */}
                  {activeTab !== "svi" && !LINE_VALUES.has(activeTab) && (
                    <button
                      onClick={() => handleTabChange("svi")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full text-sm font-medium hover:bg-brand-orange/20 transition-colors"
                    >
                      {activeTab === "na-popustu" && "Na popustu"}
                      {activeTab === "api-terapija" && "Api terapija"}
                      {activeTab === "poklon-paketi" && "Poklon paketi"}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Category chip */}
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategoryChange(undefined)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {getCategoryName(selectedCategory)}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Sort chip */}
                  {selectedSort && (
                    <button
                      onClick={() => handleSortChange(undefined)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {SORT_LABELS[sortToParam(selectedSort) || ""] || "Sortirano"}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Search chip */}
                  {urlSearch && (
                    <button
                      onClick={clearSearch}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Pretraga: {urlSearch}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Clear all button - only show when multiple filters active */}
                  {activeFilterCount > 1 && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors ml-2"
                    >
                      Obriši sve
                    </button>
                  )}
                </div>
              )}

              {productsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : productsError ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                  <p className="text-gray-600 font-medium">
                    Greška pri učitavanju proizvoda. Molimo pokušajte ponovo.
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <p className="text-gray-600 font-medium text-lg">
                    Nema pronađenih proizvoda.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Pokušajte promijeniti filtere ili pretragu.
                  </p>
                </div>
              ) : (
                <>
                  <AnimatedProductGrid
                    products={products.map((p) => ({
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      price: p.price,
                      compareAtPrice: p.compareAtPrice,
                      discount: p.discount,
                      image: p.image,
                      inStock: p.inStock,
                    }))}
                  />
                  {meta && meta.totalPages > 1 && (
                    <ShopPagination
                      page={page}
                      totalPages={meta.totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function ShopPageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
    </div>
  );
}

export default function ShopProductsClient() {
  return (
    <Suspense fallback={<ShopPageLoading />}>
      <ShopPageContent />
    </Suspense>
  );
}
