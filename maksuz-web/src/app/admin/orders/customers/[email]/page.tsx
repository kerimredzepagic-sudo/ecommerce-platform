"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AdminHeader, StatusBadge, DataTable } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/useAdminApi";
import {
  Loader2,
  User,
  Mail,
  Calendar,
  ShoppingBag,
  TrendingUp,
  CheckCircle,
  Eye,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bs } from "date-fns/locale";

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);

  const { data, isLoading } = useCustomer(email);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Detalji kupca" showBack />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  const customer = data?.data;

  if (!customer) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Kupac nije pronađen" showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Kupac nije pronađen</p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: "orderNumber",
      header: "Narudžba",
      render: (order: (typeof customer.orders)[0]) => (
        <div>
          <p className="font-medium text-gray-900">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("bs-BA")}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Stavke",
      render: (order: (typeof customer.orders)[0]) => (
        <span className="text-gray-600">{order.itemCount} stavki</span>
      ),
    },
    {
      key: "total",
      header: "Ukupno",
      render: (order: (typeof customer.orders)[0]) => (
        <span className="font-semibold text-brand-orange">{order.total.toFixed(2)} KM</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order: (typeof customer.orders)[0]) => <StatusBadge status={order.status} />,
    },
    {
      key: "payment",
      header: "Plaćanje",
      render: (order: (typeof customer.orders)[0]) => <StatusBadge status={order.paymentStatus} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (order: (typeof customer.orders)[0]) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/orders/${order.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Detalji kupca"
        description={customer.email}
        showBack
      />

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <User className="w-8 h-8 text-brand-orange" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {customer.name || "Nepoznato ime"}
                </h2>
                <p className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Tip računa</span>
                {customer.isRegistered ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Registrovan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    <User className="w-3 h-3" />
                    Gost
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Ukupno narudžbi
                </span>
                <span className="font-semibold text-gray-900">{customer.orderCount}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ukupna potrošnja
                </span>
                <span className="font-semibold text-brand-orange">
                  {customer.totalSpent.toFixed(2)} KM
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Prva narudžba
                </span>
                <span className="text-gray-900">
                  {new Date(customer.firstOrderDate).toLocaleDateString("bs-BA")}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Zadnja narudžba
                </span>
                <span className="text-gray-900">
                  {formatDistanceToNow(new Date(customer.lastOrderDate), {
                    addSuffix: true,
                    locale: bs,
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Prosječna vrijednost narudžbe:{" "}
                <span className="font-semibold text-gray-900">
                  {customer.orderCount > 0
                    ? (customer.totalSpent / customer.orderCount).toFixed(2)
                    : "0"}{" "}
                  KM
                </span>
              </p>
            </div>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-orange" />
              Historija narudžbi
            </h2>

            <DataTable
              data={customer.orders}
              columns={columns}
              onRowClick={(order) => router.push(`/admin/orders/${order.id}`)}
              emptyMessage="Nema narudžbi"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

