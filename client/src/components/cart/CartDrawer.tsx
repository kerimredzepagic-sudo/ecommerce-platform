"use client";

import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "./CartItem";
import { EmptyCart } from "./EmptyCart";

export function CartDrawer() {
  const router = useRouter();
  const { items, itemCount, subtotal, isOpen, closeCart } = useCart();

  // Calculate shipping (free over 50 KM)
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    closeCart();
    router.push("/shop/checkout");
  };

  const handleContinueShopping = () => {
    closeCart();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()} direction="right">
      <DrawerContent className="h-full w-full max-w-md ml-auto">
        {/* Header */}
        <DrawerHeader className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-brand-orange" />
              <DrawerTitle className="font-oswald text-lg font-bold uppercase">
                Korpa ({itemCount})
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Zatvori korpu"
              >
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.variantId || "default"}`}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <DrawerFooter className="border-t border-gray-200 px-6 py-4 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Međuzbir:</span>
                <span className="font-oswald font-medium">
                  {subtotal.toFixed(2)} KM
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dostava:</span>
                <span className="font-oswald font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Besplatna</span>
                  ) : (
                    `${shipping.toFixed(2)} KM`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500">
                  Besplatna dostava za narudžbe preko 50 KM
                </p>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-oswald font-bold text-lg">Ukupno:</span>
                <span className="font-oswald font-bold text-lg text-brand-orange">
                  {total.toFixed(2)} KM
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleCheckout}
                className="w-full font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 text-white py-6"
              >
                Nastavi na kasu
              </Button>
              <Button
                variant="outline"
                onClick={handleContinueShopping}
                className="w-full font-oswald uppercase py-6"
              >
                Nastavi kupovinu
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

