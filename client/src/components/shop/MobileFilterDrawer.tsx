"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  X, 
  SlidersHorizontal, 
  ArrowDownWideNarrow, 
  ArrowUpNarrowWide, 
  Star, 
  TrendingUp,
  Grid3X3,
  Percent,
  Check
} from "lucide-react";
import { ShopCategory } from "@/hooks/useShopApi";
import { Button } from "@/components/ui/button";

interface SortOption {
  id: string;
  label: string;
  sortBy: "price" | "name" | "createdAt";
  sortOrder: "asc" | "desc";
  icon: React.ReactNode;
}

const sortOptions: SortOption[] = [
  { 
    id: "price-high", 
    label: "CIJENA: VISOKA → NISKA", 
    sortBy: "price", 
    sortOrder: "desc",
    icon: <ArrowDownWideNarrow className="w-4 h-4" />
  },
  { 
    id: "price-low", 
    label: "CIJENA: NISKA → VISOKA", 
    sortBy: "price", 
    sortOrder: "asc",
    icon: <ArrowUpNarrowWide className="w-4 h-4" />
  },
  { 
    id: "featured", 
    label: "ISTAKNUTO", 
    sortBy: "createdAt", 
    sortOrder: "desc",
    icon: <Star className="w-4 h-4" />
  },
  { 
    id: "popular", 
    label: "NAJPRODAVANIJE", 
    sortBy: "createdAt", 
    sortOrder: "desc",
    icon: <TrendingUp className="w-4 h-4" />
  },
];

const discountOptions = [
  { id: "10", label: "10%", value: 10 },
  { id: "20", label: "20%", value: 20 },
  { id: "40", label: "40%", value: 40 },
  { id: "50", label: "50%", value: 50 },
  { id: "all", label: "SVE", value: 0 },
];

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ShopCategory[];
  selectedCategory?: string;
  selectedSort?: { sortBy: "price" | "name" | "createdAt"; sortOrder: "asc" | "desc" };
  selectedDiscount?: number;
  totalProducts?: number;
  onCategoryChange?: (categoryId: string | undefined) => void;
  onSortChange?: (sort: { sortBy: "price" | "name" | "createdAt"; sortOrder: "asc" | "desc" } | undefined) => void;
  onDiscountChange?: (discount: number | undefined) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  selectedSort,
  selectedDiscount,
  totalProducts = 0,
  onCategoryChange,
  onSortChange,
  onDiscountChange,
}: MobileFilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSortChange = (sortOption: SortOption) => {
    const isSelected =
      selectedSort?.sortBy === sortOption.sortBy &&
      selectedSort?.sortOrder === sortOption.sortOrder;
    
    if (isSelected) {
      onSortChange?.(undefined);
    } else {
      onSortChange?.({
        sortBy: sortOption.sortBy,
        sortOrder: sortOption.sortOrder,
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const isSelected = selectedCategory === categoryId;
    onCategoryChange?.(isSelected ? undefined : categoryId);
  };

  const handleDiscountChange = (discountValue: number) => {
    if (discountValue === 0) {
      onDiscountChange?.(undefined);
    } else if (selectedDiscount === discountValue) {
      onDiscountChange?.(undefined);
    } else {
      onDiscountChange?.(discountValue);
    }
  };

  const handleClearAll = () => {
    onCategoryChange?.(undefined);
    onSortChange?.(undefined);
    onDiscountChange?.(undefined);
  };

  const hasActiveFilters = selectedCategory || selectedSort || selectedDiscount;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <h2 className="font-oswald text-lg font-bold text-gray-900 uppercase">
                  Filteri
                </h2>
                <span className="text-xs text-gray-500 font-poppins">
                  {totalProducts} proizvoda
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Sort Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownWideNarrow className="w-5 h-5 text-brand-orange" />
                <h3 className="font-oswald font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Sortiraj
                </h3>
              </div>
              <div className="space-y-2">
                {sortOptions.map((option) => {
                  const isSelected =
                    selectedSort?.sortBy === option.sortBy &&
                    selectedSort?.sortOrder === option.sortOrder;
                  
                  return (
                    <button 
                      key={option.id} 
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                        isSelected 
                          ? "bg-brand-orange text-white shadow-md" 
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => handleSortChange(option)}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        isSelected ? "bg-white/20" : "bg-white"
                      )}>
                        <span className={isSelected ? "text-white" : "text-brand-orange"}>
                          {option.icon}
                        </span>
                      </div>
                      <span className="font-oswald text-sm font-medium flex-1 text-left">
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Grid3X3 className="w-5 h-5 text-brand-orange" />
                <h3 className="font-oswald font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Kategorije
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.length === 0 ? (
                  <p className="font-poppins text-sm text-gray-500">Nema kategorija</p>
                ) : (
                  categories.map((category) => {
                    const isSelected = selectedCategory === category.slug;
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl font-oswald text-sm font-medium uppercase transition-all duration-200",
                          isSelected
                            ? "bg-brand-orange text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {category.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Discount Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-5 h-5 text-brand-orange" />
                <h3 className="font-oswald font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Popust
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {discountOptions.map((option) => {
                  const isSelected = option.value === 0 
                    ? selectedDiscount === undefined 
                    : selectedDiscount === option.value;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleDiscountChange(option.value)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl font-oswald text-sm font-bold uppercase transition-all duration-200",
                        isSelected
                          ? "bg-brand-orange text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex-1 font-oswald uppercase"
              >
                Očisti sve
              </Button>
            )}
            <Button
              variant="brand"
              onClick={onClose}
              className={cn(
                "font-oswald uppercase",
                hasActiveFilters ? "flex-1" : "w-full"
              )}
            >
              Prikaži {totalProducts} proizvoda
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
