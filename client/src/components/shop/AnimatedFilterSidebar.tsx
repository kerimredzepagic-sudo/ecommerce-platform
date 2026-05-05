"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ShopCategory } from "@/hooks/useShopApi";
import { 
  ArrowDownWideNarrow, 
  ArrowUpNarrowWide, 
  Star, 
  TrendingUp,
  Grid3X3,
  Percent,
  Check
} from "lucide-react";

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

interface AnimatedFilterSidebarProps {
  categories: ShopCategory[];
  selectedCategory?: string;
  selectedSort?: { sortBy: "price" | "name" | "createdAt"; sortOrder: "asc" | "desc" };
  selectedDiscount?: number;
  totalProducts?: number;
  onCategoryChange?: (categoryId: string | undefined) => void;
  onSortChange?: (sort: { sortBy: "price" | "name" | "createdAt"; sortOrder: "asc" | "desc" } | undefined) => void;
  onDiscountChange?: (discount: number | undefined) => void;
  className?: string;
}

export function AnimatedFilterSidebar({
  categories,
  selectedCategory,
  selectedSort,
  selectedDiscount,
  totalProducts = 0,
  onCategoryChange,
  onSortChange,
  onDiscountChange,
  className,
}: AnimatedFilterSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const categorySectionRef = useRef<HTMLDivElement>(null);
  const discountSectionRef = useRef<HTMLDivElement>(null);

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
      // "SVE" option - clear discount filter
      onDiscountChange?.(undefined);
    } else if (selectedDiscount === discountValue) {
      onDiscountChange?.(undefined);
    } else {
      onDiscountChange?.(discountValue);
    }
  };

  useEffect(() => {
    // Set initial states
    gsap.set(sidebarRef.current, { opacity: 0, x: -50 });
    gsap.set(headerRef.current, { opacity: 0, y: 20 });
    gsap.set(filterSectionRef.current, { opacity: 0, y: 20 });
    gsap.set(categorySectionRef.current, { opacity: 0, y: 20 });
    gsap.set(discountSectionRef.current, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.8 });

    tl.to(sidebarRef.current, { opacity: 1, x: 0, duration: 0.7 });
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    tl.to(filterSectionRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    tl.to(categorySectionRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    tl.to(discountSectionRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  return (
    <aside ref={sidebarRef} className={cn("w-64 flex-shrink-0", className)}>
      {/* Header with product count */}
      <div ref={headerRef} className="mb-6">
        <h2 className="font-oswald text-xl font-bold text-gray-900 uppercase">
          Svi proizvodi
        </h2>
        <span className="font-poppins text-sm text-gray-500">
          {totalProducts} rezultata
        </span>
      </div>

      {/* Filter & Sort Section */}
      <div ref={filterSectionRef} className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
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
                  "w-full flex items-center gap-2 p-2.5 rounded-lg transition-all text-left",
                  isSelected 
                    ? "bg-brand-orange text-white" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => handleSortChange(option)}
              >
                <span className={isSelected ? "text-white" : "text-brand-orange"}>
                  {option.icon}
                </span>
                <span className="font-oswald text-xs font-medium flex-1">
                  {option.label}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Section */}
      <div ref={categorySectionRef} className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-5 h-5 text-brand-orange" />
          <h3 className="font-oswald font-bold text-gray-900 text-sm uppercase tracking-wide">
            Kategorije
          </h3>
        </div>
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
          {categories.length === 0 ? (
            <p className="font-poppins text-sm text-gray-500">Nema kategorija</p>
          ) : (
            categories.map((category) => {
              const isSelected = selectedCategory === category.slug;
              return (
                <button 
                  key={category.id} 
                  className={cn(
                    "w-full flex items-center gap-2 p-2.5 rounded-lg transition-all text-left",
                    isSelected 
                      ? "bg-brand-orange text-white" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  <span className="font-oswald text-xs font-medium uppercase flex-1 truncate">
                    {category.name}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Discount Section */}
      <div ref={discountSectionRef} className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-5 h-5 text-brand-orange" />
          <h3 className="font-oswald font-bold text-gray-900 text-sm uppercase tracking-wide">
            Popust
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {discountOptions.map((option) => {
            const isSelected = option.value === 0 
              ? selectedDiscount === undefined 
              : selectedDiscount === option.value;
            
            return (
              <button
                key={option.id}
                onClick={() => handleDiscountChange(option.value)}
                className={cn(
                  "px-4 py-2.5 rounded-lg font-oswald text-sm font-bold uppercase transition-all duration-200",
                  isSelected
                    ? "bg-brand-orange text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
