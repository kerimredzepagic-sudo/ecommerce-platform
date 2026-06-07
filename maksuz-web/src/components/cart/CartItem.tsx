"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1, item.variantId);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1, item.variantId);
    } else {
      removeItem(item.productId, item.variantId);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId, item.variantId);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Product Image */}
      <Link
        href={`/shop/product/${item.slug}`}
        className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
      >
        <Image
          src={item.image || "/productimage.png"}
          alt={item.name}
          fill
          className="object-contain p-2"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/shop/product/${item.slug}`}>
          <h4 className="font-oswald font-medium text-gray-900 text-sm uppercase truncate hover:text-brand-orange transition-colors">
            {item.name}
          </h4>
        </Link>

        {item.variantName && (
          <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>
        )}

        <p className="font-oswald font-bold text-gray-900 mt-1">
          {item.price.toFixed(2)} KM
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={handleDecrement}
              className="p-1.5 hover:bg-gray-100 transition-colors rounded-l-lg"
              aria-label="Smanji količinu"
            >
              <Minus className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="px-3 py-1 font-oswald text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-1.5 hover:bg-gray-100 transition-colors rounded-r-lg"
              aria-label="Povećaj količinu"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Ukloni iz korpe"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-right flex-shrink-0">
        <p className="font-oswald font-bold text-gray-900">
          {(item.price * item.quantity).toFixed(2)} KM
        </p>
      </div>
    </div>
  );
}

