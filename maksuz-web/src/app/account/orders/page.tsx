"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyOrders, Order } from "@/hooks/useAccountApi";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { bs } from "date-fns/locale";
import {
  Package,
  Loader2,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
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

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useMyOrders({
    page,
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Moje narudžbe"
        description="Pregled svih vaših narudžbi"
        actions={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtriraj po statusu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sve narudžbe</SelectItem>
              <SelectItem value="pending">Na čekanju</SelectItem>
              <SelectItem value="confirmed">Potvrđeno</SelectItem>
              <SelectItem value="processing">U obradi</SelectItem>
              <SelectItem value="shipped">Poslano</SelectItem>
              <SelectItem value="delivered">Dostavljeno</SelectItem>
              <SelectItem value="cancelled">Otkazano</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-900">
                  {meta ? `${meta.total} narudžbi` : "Narudžbe"}
                </h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg text-gray-500">Nemate narudžbi</p>
                <p className="text-sm text-gray-400 mt-1">
                  {statusFilter !== "all"
                    ? "Pokušajte promijeniti filter"
                    : "Započnite kupovinu da biste vidjeli narudžbe ovdje"}
                </p>
                <Link href="/">
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                    Započnite kupovinu
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-gray-900">
                              #{order.orderNumber}
                            </p>
                            <span
                              className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                statusColors[order.status]
                              )}
                            >
                              {statusLabels[order.status]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(order.createdAt), "d. MMMM yyyy, HH:mm", {
                              locale: bs,
                            })}
                            {" · "}
                            {order.itemCount}{" "}
                            {order.itemCount === 1 ? "proizvod" : "proizvoda"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {order.total.toFixed(2)} KM
                        </p>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            order.paymentStatus === "paid"
                              ? "text-green-600"
                              : order.paymentStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          )}
                        >
                          {order.paymentStatus === "paid"
                            ? "Plaćeno"
                            : order.paymentStatus === "pending"
                            ? "Čeka plaćanje"
                            : order.paymentStatus === "failed"
                            ? "Neuspjelo"
                            : "Refundirano"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Stranica {meta.page} od {meta.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Prethodna
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= meta.totalPages}
                      >
                        Sljedeća
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
