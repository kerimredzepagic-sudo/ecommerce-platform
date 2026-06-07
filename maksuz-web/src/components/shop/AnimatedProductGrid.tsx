"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  image: string | null;
  inStock?: boolean;
}

interface AnimatedProductGridProps {
  products: Product[];
  total?: number;
  className?: string;
}

function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  discount,
  image,
  inStock = true,
  currency = "KM",
}: {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  image: string | null;
  inStock?: boolean;
  currency?: string;
}) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const imageUrl = image || "/placeholder-product.png";
  // Only show sale price if discount is set (backend validates sale dates)
  const displayPrice = price;
  const originalPrice = discount && discount > 0 && compareAtPrice ? compareAtPrice : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.error("Proizvod nije na zalihama");
      return;
    }

    addItem({
      productId: id,
      slug,
      name,
      price: displayPrice,
      image: imageUrl,
      quantity: 1,
    });

    toast.success(`${name} dodano u korpu`, {
      description: "Kliknite na korpu za pregled",
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Uklonjeno iz liste želja" : "Dodano u listu želja");
  };

  return (
    <Link href={`/shop/product/${slug}`}>
      <div className="flex flex-col bg-white rounded-2xl overflow-hidden group relative cursor-pointer border border-gray-200 hover:border-brand-orange/30 hover:shadow-xl transition-all duration-300">
        {/* Out of Stock Badge */}
        {!inStock && (
          <div className="absolute top-2 left-2 z-10 bg-gray-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
            Nema na zalihama
          </div>
        )}

        {/* Discount Badge */}
        {inStock && discount && discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            -{discount}%
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
            isWishlisted 
              ? "bg-red-500 text-white" 
              : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white border border-gray-200"
          )}
          aria-label="Dodaj u listu želja"
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>

        {/* Image Container */}
        <div className={cn(
          "relative aspect-square flex items-center justify-center p-4 bg-white border-b border-gray-200",
          !inStock && "opacity-60"
        )}>
          {image ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={cn(
                "object-contain p-4 transition-transform duration-500 group-hover:scale-105",
                !inStock && "grayscale"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              Bez slike
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 bg-white">
          {/* Product Name */}
          <h4 className="font-poppins font-semibold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-3">
            {name}
          </h4>
          
          {/* Price and Cart Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <p className="font-oswald text-brand-orange text-lg font-bold leading-tight">
                {displayPrice.toFixed(2)} {currency}
              </p>
              {originalPrice && (
                <p className="font-oswald text-gray-400 text-xs line-through">
                  {originalPrice.toFixed(2)} {currency}
                </p>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-full transition-all flex-shrink-0",
                inStock
                  ? "bg-brand-orange hover:bg-brand-orange/90 active:scale-95 shadow-lg shadow-brand-orange/30 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              )}
              aria-label={inStock ? "Dodaj u korpu" : "Nema na zalihama"}
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AnimatedProductGrid({ products, className }: AnimatedProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate product cards with stagger
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.set(cards, { opacity: 0, y: 30, scale: 0.98 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: {
          each: 0.06,
          from: "start",
        },
        delay: 0.3,
        ease: "power2.out",
      });
    }
  }, [products]);

  return (
    <div className={cn("flex-1", className)}>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            discount={product.discount}
            image={product.image}
            inStock={product.inStock}
          />
        ))}
      </div>
    </div>
  );
}
