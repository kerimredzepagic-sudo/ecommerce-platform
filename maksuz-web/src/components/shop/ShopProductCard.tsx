"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ShopProductCardProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  discount?: number;
  className?: string;
}

export function ShopProductCard({
  productId,
  slug,
  name,
  price,
  currency = "KM",
  image,
  discount,
  className,
}: ShopProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if card is wrapped in Link
    e.stopPropagation();

    addItem({
      productId,
      slug,
      name,
      price,
      image,
      quantity: 1,
    });

    toast.success(`${name} dodano u korpu`, {
      description: "Kliknite na korpu za pregled",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-50 rounded-2xl overflow-hidden group relative",
        className
      )}
    >
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-brand-orange text-white text-xs font-oswald font-bold px-2 py-1 rounded">
            -{discount}% AKCIJA
          </span>
        </div>
      )}

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <h4 className="font-oswald font-bold text-gray-900 uppercase text-xs leading-tight">
            {name}
          </h4>
          <p className="font-oswald text-gray-700 text-base font-medium">
            {price.toFixed(2)} {currency}
          </p>
        </div>

        {/* Shopping Bag Icon */}
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-orange hover:bg-brand-orange/90 transition-colors shadow-md flex-shrink-0"
          aria-label="Dodaj u korpu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 7H18L17 14H7L6 7ZM6 7L5 3H3M9 19C9.55228 19 10 18.5523 10 18C10 17.4477 9.55228 17 9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19ZM17 19C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
