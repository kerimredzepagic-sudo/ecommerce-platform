"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export function EmptyCart() {
  const { closeCart } = useCart();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>

      <h3 className="font-oswald text-xl font-bold text-gray-900 mb-2">
        Vaša korpa je prazna
      </h3>

      <p className="text-gray-500 text-sm mb-6 max-w-[250px]">
        Dodajte proizvode u korpu kako biste nastavili s kupovinom
      </p>

      <Link href="/shop/products" onClick={closeCart}>
        <Button className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 text-white px-8">
          Pregledaj proizvode
        </Button>
      </Link>
    </div>
  );
}

