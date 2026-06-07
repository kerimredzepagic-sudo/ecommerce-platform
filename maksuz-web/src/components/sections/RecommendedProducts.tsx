"use client";

import { useState, useRef, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn } from "@/lib/utils";
import { useShopProducts, useShopCategories } from "@/hooks/useShopApi";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import { SectionHeader } from "../ui/section-header";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency?: string;
  image: string | null;
  className?: string;
}

function ProductCard({
  id,
  slug,
  name,
  price,
  currency = "KM",
  image,
  className,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: id,
      slug,
      name,
      price,
      image: image || "/productimage.png",
      quantity: 1,
    });

    toast.success(`${name} dodano u korpu`, {
      description: "Kliknite na korpu za pregled",
    });
  };

  return (
    <Link href={`/shop/product/${slug}`}>
      <div
        className={cn(
          "flex flex-col w-[280px] h-[380px] relative justify-end cursor-pointer group",
          "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        {/* Image Container */}
        <div className="absolute top-0 left-0 right-0 h-[220px] flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-[180px] h-[180px]">
            <Image
              src={image || "/productimage.png"}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content - Product name, price, and cart icon */}
        <div className="flex items-center justify-between px-5 pb-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-3">
            <h4 className="font-oswald font-bold text-gray-900 uppercase text-base group-hover:text-brand-orange transition-colors truncate">
              {name}
            </h4>
            <p className="font-oswald text-gray-700 text-lg font-medium">
              {price.toFixed(2)} {currency}
            </p>
          </div>

          {/* Shopping Bag Icon */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-all shadow-md flex-shrink-0 hover:scale-110"
            aria-label="Dodaj u korpu"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </Link>
  );
}

// Filter interface
interface FilterOption {
  label: string;
  value: string | null; // null means "all"
}

export const RecommendedProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const autoplayPlugin = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true })
  );

  // Fetch categories from API
  const { data: categoriesData } = useShopCategories();
  const categories = categoriesData?.data || [];

  // Fetch products - all featured products initially
  const { data: productsData, isLoading } = useShopProducts({
    limit: 20,
    isActive: true,
    isFeatured: true,
    category: selectedCategory || undefined,
  });

  const products = productsData?.data || [];

  // Build filter options from categories (top-level only for cleaner UI)
  const filterOptions: FilterOption[] = useMemo(() => {
    const topLevelCategories = categories
      .filter((cat) => cat.level === 0 && cat.isActive)
      .sort((a, b) => a.order - b.order)
      .slice(0, 4); // Limit to 4 categories for clean UI

    return [
      { label: "SVI ISTAKNUTI", value: null },
      ...topLevelCategories.map((cat) => ({
        label: cat.name.toUpperCase(),
        value: cat.slug,
      })),
    ];
  }, [categories]);

  const handleFilterClick = (value: string | null) => {
    setSelectedCategory(value);
    // Reset autoplay when filter changes
    autoplayPlugin.current.reset();
  };

  return (
    <section className="w-full flex flex-col justify-center items-center py-16 bg-white">
      <div className="flex flex-col justify-center items-center w-full mx-auto max-w-screen px-4">
        {/* Headings */}
        <div className="mb-4">
          <SectionHeader
            label="NAJODABRANIJE ZA VAS"
            title="Ponosno istaknuti Maksuz proizvodi."
            centered
          />
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {filterOptions.map((filter) => (
            <Button
              key={filter.label}
              onClick={() => handleFilterClick(filter.value)}
              variant={selectedCategory === filter.value ? "brand" : "outline"}
              className={cn(
                "font-oswald text-sm uppercase px-6 font-bold transition-all duration-300 group",
                selectedCategory === filter.value
                  ? "shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-[#F8F8F8] text-gray-900 border-gray-300 border hover:border-brand-orange hover:text-brand-orange hover:scale-105"
              )}
            >
              {filter.label}
              {selectedCategory === filter.value && (
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          ))}
        </div>

        {/* Product Cards Carousel */}
        <div className="w-full relative px-12 mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-500 font-oswald text-lg">
                Nema proizvoda u ovoj kategoriji
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="font-oswald uppercase"
              >
                Pogledaj sve proizvode
              </Button>
            </div>
          ) : (
            <Carousel
              plugins={[autoplayPlugin.current]}
              opts={{
                align: "center",
                loop: products.length > 4,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6 py-4 justify-center">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="pl-6 basis-auto">
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};
