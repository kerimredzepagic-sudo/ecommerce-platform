"use client";

import { useRef } from "react";
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
import { useShopProducts } from "@/hooks/useShopApi";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";

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
          "flex flex-col w-[240px] sm:w-[280px] h-[340px] sm:h-[380px] relative justify-end cursor-pointer group",
          "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
          className
        )}
      >
        {/* Image Container */}
        <div className="absolute top-0 left-0 right-0 h-[180px] sm:h-[220px] flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]">
            <Image
              src={image || "/productimage.png"}
              alt={name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content - Product name, price, and cart icon */}
        <div className="flex items-center justify-between px-4 sm:px-5 pb-5 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1 flex-1 min-w-0 pr-3">
            <h4 className="font-oswald font-bold text-gray-900 uppercase text-sm sm:text-base group-hover:text-brand-orange transition-colors truncate">
              {name}
            </h4>
            <p className="font-oswald text-gray-700 text-base sm:text-lg font-medium">
              {price.toFixed(2)} {currency}
            </p>
          </div>

          {/* Shopping Bag Icon */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-all shadow-md flex-shrink-0 hover:scale-110"
            aria-label="Dodaj u korpu"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </Link>
  );
}

interface LineProductsCarouselProps {
  line: string;
  className?: string;
}

export function LineProductsCarousel({ line, className }: LineProductsCarouselProps) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  // Fetch products for this line
  const { data: productsData, isLoading } = useShopProducts({
    line,
    limit: 8,
    isActive: true,
  });

  const products = productsData?.data || [];

  return (
    <div className={cn("w-full relative px-4 sm:px-12", className)}>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-white/80 font-oswald text-lg text-center">
            Proizvodi uskoro dolaze
          </p>
          <Button
            variant="outline"
            className="font-oswald uppercase bg-white text-brand-orange border-white hover:bg-white/90"
            asChild
          >
            <Link href="/shop/products">Pogledaj sve proizvode</Link>
          </Button>
        </div>
      ) : (
        <Carousel
          plugins={[autoplayPlugin.current]}
          opts={{
            align: "start",
            loop: products.length > 4,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-6 py-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 sm:pl-6 basis-auto">
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
          <CarouselPrevious className="left-0 sm:-left-4 bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-lg" />
          <CarouselNext className="right-0 sm:-right-4 bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-lg" />
        </Carousel>
      )}
    </div>
  );
}
