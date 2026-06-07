"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMyOrder, useCancelOrder } from "@/hooks/useAccountApi";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { bs } from "date-fns/locale";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Loader2,
  XCircle,
  CheckCircle,
  Clock,
  PackageCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  pending: "Na čekanju",
  confirmed: "Potvrđeno",
  processing: "U obradi",
  shipped: "Poslano",
  delivered: "Dostavljeno",
  cancelled: "Otkazano",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

const orderTimeline = [
  { status: "pending", label: "Na čekanju" },
  { status: "confirmed", label: "Potvrđeno" },
  { status: "processing", label: "U obradi" },
  { status: "shipped", label: "Poslano" },
  { status: "delivered", label: "Dostavljeno" },
];

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params);
  const { data, isLoading, error } = useMyOrder(id);
  const cancelMutation = useCancelOrder();

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Narudžba nije pronađena" showBack />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-lg text-gray-500">Narudžba nije pronađena</p>
            <Link href="/account/orders">
              <Button variant="outline" className="mt-4">
                Nazad na narudžbe
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status] || Package;
  const currentStatusIndex = orderTimeline.findIndex(
    (s) => s.status === order.status,
  );
  const canCancel =
    order.status !== "cancelled" &&
    order.status !== "shipped" &&
    order.status !== "delivered";

  const handleCancel = async () => {
    await cancelMutation.mutateAsync(id);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={`Narudžba #${order.orderNumber}`}
        description={format(new Date(order.createdAt), "d. MMMM yyyy, HH:mm", {
          locale: bs,
        })}
        showBack
        actions={
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full",
                statusColors[order.status],
              )}
            >
              {statusLabels[order.status]}
            </span>
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Otkaži
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Otkazati narudžbu?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Jeste li sigurni da želite otkazati ovu narudžbu? Ova
                      radnja se ne može poništiti.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Odustani</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {cancelMutation.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      Da, otkaži
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        }
      />

      <div className="flex-1 p-6">
        {/* Order Timeline (for non-cancelled orders) */}
        {order.status !== "cancelled" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0" />
              <div
                className="absolute left-0 top-1/2 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all"
                style={{
                  width: `${(currentStatusIndex / (orderTimeline.length - 1)) * 100}%`,
                }}
              />

              {orderTimeline.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const Icon = statusIcons[step.status];

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center z-10"
                  >
                    <div
                      className={cn(
                        "w-16 h-10 rounded-full flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-500",
                        isCurrent && "ring-4 ring-orange-200",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-2",
                        isActive
                          ? "text-gray-900 font-medium"
                          : "text-gray-500",
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Proizvodi ({order.itemCount})
                </h3>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.quantity} × {item.price.toFixed(2)} KM
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.total.toFixed(2)} KM
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Adresa dostave</h3>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-500">{order.shippingAddress.street}</p>
                <p className="text-gray-500">
                  {order.shippingAddress.postalCode}{" "}
                  {order.shippingAddress.city}
                </p>
                <p className="text-gray-500">{order.shippingAddress.country}</p>
                <p className="text-gray-500 pt-2">
                  Tel: {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Napomene</h3>
                <p className="text-sm text-gray-500">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Sažetak</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Međuzbir</span>
                  <span className="text-gray-900">
                    {order.subtotal.toFixed(2)} KM
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dostava</span>
                  <span className="text-gray-900">
                    {order.shipping === 0
                      ? "Besplatno"
                      : `${order.shipping.toFixed(2)} KM`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PDV (17%)</span>
                  <span className="text-gray-900">
                    {order.tax.toFixed(2)} KM
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Ukupno</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {order.total.toFixed(2)} KM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Status plaćanja
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    order.paymentStatus === "paid"
                      ? "bg-green-100"
                      : order.paymentStatus === "pending"
                        ? "bg-yellow-100"
                        : "bg-red-100",
                  )}
                >
                  {order.paymentStatus === "paid" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : order.paymentStatus === "pending" ? (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {order.paymentStatus === "paid"
                      ? "Plaćeno"
                      : order.paymentStatus === "pending"
                        ? "Čeka plaćanje"
                        : order.paymentStatus === "failed"
                          ? "Neuspjelo"
                          : "Refundirano"}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">
                Trebate pomoć?{" "}
                <Link
                  href="/contact"
                  className="text-orange-500 hover:underline"
                >
                  Kontaktirajte nas
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
