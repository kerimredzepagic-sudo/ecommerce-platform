"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  Truck,
  Copy,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast.success("Broj narudžbe kopiran!");
    }
  };

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-6 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="font-oswald text-2xl font-bold text-gray-900 mb-2">
            Nema narudžbe za prikaz
          </h1>
          <p className="text-gray-500 mb-6">
            Izgleda da nemate aktivnu narudžbu.
          </p>
          <Link href="/shop">
            <Button className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90">
              Nazad na shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="font-oswald text-3xl font-bold text-gray-900 mb-2">
            Hvala vam na narudžbi!
          </h1>
          <p className="text-gray-600">
            Vaša narudžba je uspješno primljena i bit će obrađena u najkraćem
            roku.
          </p>
        </div>

        {/* Order Number Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase font-oswald mb-2">
              Broj narudžbe
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-oswald text-2xl font-bold text-brand-orange">
                {orderNumber}
              </span>
              <button
                onClick={copyOrderNumber}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Kopiraj broj narudžbe"
              >
                <Copy className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Sačuvajte ovaj broj kako biste mogli pratiti status vaše narudžbe.
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4">
            Šta slijedi?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="font-oswald font-bold text-gray-900">
                  Potvrda narudžbe
                </p>
                <p className="text-sm text-gray-500">
                  Primićete email s potvrdom vaše narudžbe na vašu email adresu.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="font-oswald font-bold text-gray-900">Dostava</p>
                <p className="text-sm text-gray-500">
                  Vaša narudžba bit će dostavljena u roku od 2-5 radnih dana.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/shop/order/track?orderNumber=${orderNumber}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full font-oswald uppercase py-6"
            >
              Prati narudžbu
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button className="w-full font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 py-6">
              Nastavi kupovinu
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Imate pitanja? Kontaktirajte nas na{" "}
            <a
              href="tel:+38762200088"
              className="text-brand-orange hover:underline font-medium"
            >
              +387 62 200 088
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Učitavanje...</div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
