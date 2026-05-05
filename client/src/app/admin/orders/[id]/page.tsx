"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
  MapPin,
  FileText,
  Clock,
  Printer,
  Mail,
  Ban,
  Send,
  Copy,
  Tag,
} from "lucide-react";
import {
  AdminHeader,
  StatusBadge,
  SidebarLayout,
  ContentCard,
  type SidebarTab,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
  useUpdateTracking,
} from "@/hooks/useAdminApi";
import { cn } from "@/lib/utils";

const orderStatuses = [
  { value: "pending", label: "Na čekanju", icon: Clock, color: "text-yellow-600" },
  { value: "confirmed", label: "Potvrđeno", icon: CheckCircle, color: "text-blue-600" },
  { value: "processing", label: "U obradi", icon: Package, color: "text-purple-600" },
  { value: "shipped", label: "Poslano", icon: Truck, color: "text-indigo-600" },
  { value: "delivered", label: "Dostavljeno", icon: CheckCircle, color: "text-green-600" },
  { value: "cancelled", label: "Otkazano", icon: XCircle, color: "text-red-600" },
];

const paymentStatuses = [
  { value: "pending", label: "Na čekanju", color: "text-yellow-600" },
  { value: "paid", label: "Plaćeno", color: "text-green-600" },
  { value: "failed", label: "Neuspješno", color: "text-red-600" },
  { value: "refunded", label: "Refundirano", color: "text-blue-600" },
];

// Tabs configuration
const tabs: SidebarTab[] = [
  { id: "items", label: "Stavke", icon: Package },
  { id: "status", label: "Status i praćenje", icon: Truck },
  { id: "customer", label: "Kupac", icon: User },
  { id: "shipping", label: "Dostava", icon: MapPin },
  { id: "notes", label: "Napomene", icon: FileText },
  { id: "timeline", label: "Vremenska linija", icon: Clock },
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updatePayment = useUpdatePaymentStatus();
  const updateTracking = useUpdateTracking();

  const [trackingInput, setTrackingInput] = useState("");

  const order = data?.data;

  // Set tracking input when order loads
  if (order && !trackingInput && order.trackingNumber) {
    setTrackingInput(order.trackingNumber);
  }

  const handleStatusChange = (status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Status promijenjen u: ${orderStatuses.find((s) => s.value === status)?.label}`);
        },
        onError: () => {
          toast.error("Greška pri promjeni statusa");
        },
      }
    );
  };

  const handlePaymentChange = (paymentStatus: string) => {
    updatePayment.mutate(
      { id, paymentStatus },
      {
        onSuccess: () => {
          toast.success(`Status plaćanja promijenjen u: ${paymentStatuses.find((s) => s.value === paymentStatus)?.label}`);
        },
        onError: () => {
          toast.error("Greška pri promjeni statusa plaćanja");
        },
      }
    );
  };

  const handleTrackingUpdate = () => {
    updateTracking.mutate(
      { id, trackingNumber: trackingInput },
      {
        onSuccess: () => {
          toast.success("Broj za praćenje sačuvan");
        },
        onError: () => {
          toast.error("Greška pri čuvanju broja za praćenje");
        },
      }
    );
  };

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      toast.success("Broj narudžbe kopiran");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Detalji narudžbe" showBack />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Narudžba nije pronađena" showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Narudžba nije pronađena</p>
        </div>
      </div>
    );
  }

  // Get customer info (registered or guest)
  const customerName = order.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : order.guestName || "Nepoznato";
  const customerEmail = order.user?.email || order.guestEmail || "Nema emaila";

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={
          <div className="flex items-center gap-3">
            <span>Narudžba {order.orderNumber}</span>
            <button onClick={copyOrderNumber} className="text-gray-400 hover:text-gray-600">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        }
        description={`Kreirana ${new Date(order.createdAt).toLocaleString("bs-BA")}`}
        showBack
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Štampaj
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6">
        <SidebarLayout tabs={tabs}>
          <div className="space-y-6">
            {/* Order Items */}
            <ContentCard id="items" title="Stavke narudžbe" icon={Package}>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Količina: {item.quantity} × {item.price.toFixed(2)} KM
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {item.total.toFixed(2)} KM
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Međuzbroj</span>
                  <span className="text-gray-900">{order.subtotal.toFixed(2)} KM</span>
                </div>
                {order.promoCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Tag className="w-3 h-3 text-green-600" />
                      Promo kod ({order.promoCode.code})
                      <span className="text-xs text-gray-400">
                        {order.promoCode.type === 'percentage' && `-${order.promoCode.value}%`}
                        {order.promoCode.type === 'fixed' && `-${order.promoCode.value} KM`}
                        {order.promoCode.type === 'free_shipping' && 'Besplatna dostava'}
                      </span>
                    </span>
                    <span className="text-green-600">-{order.promoCode.discountAmount.toFixed(2)} KM</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dostava</span>
                  <span className="text-gray-900">{order.shipping.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PDV</span>
                  <span className="text-gray-900">{order.tax.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Ukupno</span>
                  <span className="text-brand-orange">{order.total.toFixed(2)} KM</span>
                </div>
              </div>
            </ContentCard>

            {/* Status & Tracking */}
            <ContentCard id="status" title="Status i praćenje" icon={Truck}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Status */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Status narudžbe</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {orderStatuses.map((status) => {
                      const Icon = status.icon;
                      return (
                        <button
                          key={status.value}
                          onClick={() => handleStatusChange(status.value)}
                          disabled={order.status === status.value || updateStatus.isPending}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                            order.status === status.value
                              ? "bg-brand-orange/10 text-brand-orange border border-brand-orange"
                              : "hover:bg-gray-100 text-gray-600 border border-gray-200"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          {status.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Status plaćanja</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <StatusBadge status={order.paymentStatus} />
                    <span className="text-sm text-gray-500">
                      putem {order.paymentMethod === "cash_on_delivery" ? "pouzeća" : order.paymentMethod}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentStatuses.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handlePaymentChange(status.value)}
                        disabled={order.paymentStatus === status.value || updatePayment.isPending}
                        className={cn(
                          "px-3 py-2 rounded-lg text-left text-sm transition-colors",
                          order.paymentStatus === status.value
                            ? "bg-brand-orange/10 text-brand-orange border border-brand-orange"
                            : "hover:bg-gray-100 text-gray-600 border border-gray-200"
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracking Number */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Label htmlFor="tracking" className="mb-2 block">Broj za praćenje pošiljke</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Unesite broj za praćenje"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleTrackingUpdate}
                    disabled={updateTracking.isPending}
                  >
                    {updateTracking.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Sačuvaj"
                    )}
                  </Button>
                </div>
                {order.trackingNumber && (
                  <p className="text-sm text-gray-500 mt-2">
                    Trenutni broj: <span className="font-mono">{order.trackingNumber}</span>
                  </p>
                )}
              </div>
            </ContentCard>

            {/* Customer Info */}
            <ContentCard id="customer" title="Kupac" icon={User}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-brand-orange" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customerName}</p>
                  <p className="text-gray-500">{customerEmail}</p>
                  {order.user ? (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Registrovani korisnik
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      <User className="w-3 h-3" />
                      Gost
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/admin/orders/customers/${encodeURIComponent(customerEmail)}`}>
                    <Button variant="outline" size="sm">
                      Pogledaj profil
                    </Button>
                  </Link>
                </div>
              </div>
            </ContentCard>

            {/* Shipping Address */}
            <ContentCard id="shipping" title="Adresa za dostavu" icon={MapPin}>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600 mt-1">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                <p className="text-gray-600 mt-2 font-medium">{order.shippingAddress.phone}</p>
              </div>
            </ContentCard>

            {/* Notes */}
            <ContentCard id="notes" title="Napomene" icon={FileText}>
              {order.notes ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nema napomena za ovu narudžbu</p>
              )}
            </ContentCard>

            {/* Timeline */}
            <ContentCard id="timeline" title="Vremenska linija" icon={Clock}>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Narudžba kreirana</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("bs-BA", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                {order.status !== "pending" && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Status: {orderStatuses.find((s) => s.value === order.status)?.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ažurirano {new Date(order.updatedAt).toLocaleString("bs-BA", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ContentCard>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Brze akcije</h2>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Štampaj narudžbu
                </Button>
                <Button variant="outline" disabled>
                  <Mail className="w-4 h-4 mr-2" />
                  Pošalji email (uskoro)
                </Button>
                {order.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={updateStatus.isPending}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Otkaži narudžbu
                  </Button>
                )}
                {order.status === "processing" && (
                  <Button
                    className="bg-brand-orange hover:bg-brand-orange/90"
                    onClick={() => handleStatusChange("shipped")}
                    disabled={updateStatus.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Označi kao poslano
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SidebarLayout>
      </div>
    </div>
  );
}
