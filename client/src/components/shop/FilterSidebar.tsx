"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  checked?: boolean;
}

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  sortBy: string[];
  categories: string[];
  discount: string | null;
}

const sortOptions: FilterOption[] = [
  { id: "price-high", label: "Cijena (High to low)" },
  { id: "price-low", label: "Cijena (Low to High)" },
  { id: "new", label: "Najnovije", checked: true },
  { id: "popular", label: "Najprodavanije" },
];

const categoryOptions: FilterOption[] = [
  { id: "med", label: "Med", checked: true },
  { id: "sokovi", label: "Sokovi" },
  { id: "korporativni", label: "Korporativni pokloni" },
  { id: "voce", label: "Voće" },
  { id: "povrce1", label: "Povrće" },
  { id: "povrce2", label: "Povrće" },
  { id: "povrce3", label: "Povrće" },
  { id: "povrce4", label: "Povrće" },
];

const discountOptions = ["10%", "20%", "40%", "50%", "SVE"];

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [sortFilters, setSortFilters] = useState<string[]>(["new"]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>(["med"]);
  const [discountFilter, setDiscountFilter] = useState<string | null>("10%");

  const handleFilterChange = (type: "sort" | "category", id: string) => {
    if (type === "sort") {
      const newFilters = sortFilters.includes(id)
        ? sortFilters.filter((f) => f !== id)
        : [...sortFilters, id];
      setSortFilters(newFilters);
      onFilterChange?.({ sortBy: newFilters, categories: categoryFilters, discount: discountFilter });
    } else {
      const newFilters = categoryFilters.includes(id)
        ? categoryFilters.filter((f) => f !== id)
        : [...categoryFilters, id];
      setCategoryFilters(newFilters);
      onFilterChange?.({ sortBy: sortFilters, categories: newFilters, discount: discountFilter });
    }
  };

  const handleDiscountChange = (value: string) => {
    const newValue = value === discountFilter ? null : value;
    setDiscountFilter(newValue);
    onFilterChange?.({ sortBy: sortFilters, categories: categoryFilters, discount: newValue });
  };

  return (
    <aside className="w-64 flex-shrink-0">
      {/* Filter & Sort Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-oswald font-semibold text-gray-900 text-base">
            Filter & Short
          </h3>
          <span className="text-gray-400">—</span>
        </div>
        <div className="space-y-3">
          {sortOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleFilterChange("sort", option.id)}
            >
              <div
                className={cn(
                  "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                  sortFilters.includes(option.id)
                    ? "bg-brand-orange border-brand-orange"
                    : "border-gray-300 group-hover:border-brand-orange"
                )}
              >
                {sortFilters.includes(option.id) && (
                  <svg
                    width="12"
                    height="10"
                    viewBox="0 0 12 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5L4.5 8.5L11 1.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="font-poppins text-sm text-gray-700">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-oswald font-semibold text-gray-900 text-base">
            Kategorije
          </h3>
          <span className="text-gray-400">—</span>
        </div>
        <div className="space-y-3">
          {categoryOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleFilterChange("category", option.id)}
            >
              <div
                className={cn(
                  "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
                  categoryFilters.includes(option.id)
                    ? "bg-brand-orange border-brand-orange"
                    : "border-gray-300 group-hover:border-brand-orange"
                )}
              >
                {categoryFilters.includes(option.id) && (
                  <svg
                    width="12"
                    height="10"
                    viewBox="0 0 12 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5L4.5 8.5L11 1.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="font-poppins text-sm text-gray-700">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Discount Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-oswald font-semibold text-gray-900 text-base">
            Popust
          </h3>
          <span className="text-gray-400">—</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {discountOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleDiscountChange(option)}
              className={cn(
                "px-4 py-2 rounded-full font-poppins text-sm transition-colors border",
                discountFilter === option
                  ? "bg-brand-orange text-white border-brand-orange"
                  : "bg-white text-gray-700 border-gray-300 hover:border-brand-orange"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}


