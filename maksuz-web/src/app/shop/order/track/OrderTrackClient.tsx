"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Box,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
  };
  createdAt: string;
}

const statusSteps = [
  { key: "pending", label: "Narudžba primljena", icon: Clock },
  { key: "confirmed", label: "Potvrđena", icon: CheckCircle2 },
  { key: "processing", label: "U obradi", icon: Box },
  { key: "shipped", label: "Poslano", icon: Truck },
  { key: "delivered", label: "Dostavljeno", icon: Package },
];

function getStatusIndex(status: OrderData["status"]): number {
  if (status === "cancelled") return -1;
  return statusSteps.findIndex((step) => step.key === status);
}

function getStatusColor(status: OrderData["status"]): string {
  switch (status) {
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    case "shipped":
      return "text-blue-600";
    default:
      return "text-brand-orange";
  }
}

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/orders/track/${orderNum}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Narudžba nije pronađena");
      }

      setOrderData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri pretraživanju");
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount if order number is provided
  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderNumber(searchQuery);
    fetchOrder(searchQuery);
  };

  const currentStatusIndex = orderData ? getStatusIndex(orderData.status) : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-orange transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-oswald text-sm uppercase">Nazad na shop</span>
          </Link>
          <h1 className="font-oswald text-3xl font-bold text-gray-900">
            Pratite narudžbu
          </h1>
          <p className="text-gray-500 mt-1">
            Unesite broj narudžbe za praćenje statusa
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Unesite broj narudžbe (npr. MKS-XXXXX-XXXX)"
                className="pl-12 py-6 font-oswald"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 px-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Pretraži"
              )}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange mx-auto mb-4" />
            <p className="text-gray-500">Tražim narudžbu...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-oswald text-lg font-bold text-gray-900 mb-2">
              Narudžba nije pronađena
            </h3>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {/* Order Data */}
        {orderData && !isLoading && (
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-oswald text-lg font-bold text-gray-900">
                  Status narudžbe
                </h2>
                <span
                  className={cn(
                    "font-oswald font-bold uppercase",
                    getStatusColor(orderData.status),
                  )}
                >
                  {orderData.status === "cancelled"
                    ? "Otkazano"
                    : statusSteps[currentStatusIndex]?.label}
                </span>
              </div>

              {orderData.status === "cancelled" ? (
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-oswald font-bold text-red-700">
                      Narudžba je otkazana
                    </p>
                    <p className="text-sm text-red-600">
                      Ova narudžba je otkazana i neće biti dostavljena.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div
                    className="absolute left-5 top-0 w-0.5 bg-brand-orange transition-all duration-500"
                    style={{
                      height: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Steps */}
                  <div className="relative space-y-6">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.key} className="flex items-center gap-4">
                          <div
                            className={cn(
                              "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                              isCompleted
                                ? "bg-brand-orange text-white"
                                : "bg-gray-100 text-gray-400",
                            )}
                          >
                            <StepIcon className="w-5 h-5" />
                            {isCurrent && (
                              <span className="absolute -right-1 -top-1 w-3 h-3 bg-brand-orange rounded-full animate-pulse" />
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-oswald font-bold",
                                isCompleted ? "text-gray-900" : "text-gray-400",
                              )}
                            >
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-brand-orange">
                                Trenutni status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4">
                Detalji narudžbe
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Broj narudžbe</p>
                  <p className="font-oswald font-bold text-brand-orange">
                    {orderData.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Datum narudžbe</p>
                  <p className="font-oswald font-medium text-gray-900">
                    {new Date(orderData.createdAt).toLocaleDateString("bs-BA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-oswald font-bold text-gray-900">
                    {orderData.shippingAddress.firstName}{" "}
                    {orderData.shippingAddress.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {orderData.shippingAddress.city},{" "}
                    {orderData.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/productimage.png"}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-oswald font-medium text-gray-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Količina: {item.quantity}
                      </p>
                    </div>
                    <p className="font-oswald font-bold text-gray-900 text-sm">
                      {(item.price * item.quantity).toFixed(2)} KM
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Međuzbir:</span>
                  <span className="font-oswald">
                    {orderData.subtotal.toFixed(2)} KM
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dostava:</span>
                  <span className="font-oswald">
                    {orderData.shipping === 0
                      ? "Besplatna"
                      : `${orderData.shipping.toFixed(2)} KM`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PDV:</span>
                  <span className="font-oswald">
                    {orderData.tax.toFixed(2)} KM
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-oswald font-bold">Ukupno:</span>
                  <span className="font-oswald font-bold text-brand-orange">
                    {orderData.total.toFixed(2)} KM
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Imate pitanja o vašoj narudžbi? Kontaktirajte nas na{" "}
                <a
                  href="tel:+38762200088"
                  className="text-brand-orange hover:underline font-medium"
                >
                  +387 62 200 088
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Initial State - No search yet */}
        {!orderData && !isLoading && !error && !initialOrderNumber && (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-oswald text-lg font-bold text-gray-900 mb-2">
              Pratite vašu narudžbu
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Unesite broj narudžbe koji ste dobili prilikom kupovine kako biste
              vidjeli status vaše pošiljke.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Učitavanje...</div>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
