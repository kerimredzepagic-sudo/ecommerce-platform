"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Search, X, Tag } from "lucide-react";
import { AdminHeader, DataTable, StatusBadge, OrderKPICards } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrders, type Order } from "@/hooks/useAdminApi";

const statusFilters = [
  { value: "", label: "Sve narudžbe" },
  { value: "pending", label: "Na čekanju" },
  { value: "confirmed", label: "Potvrđeno" },
  { value: "processing", label: "U obradi" },
  { value: "shipped", label: "Poslano" },
  { value: "delivered", label: "Dostavljeno" },
  { value: "cancelled", label: "Otkazano" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useOrders({
    page,
    limit: 15,
    status: status || undefined,
  });

  // Filter orders by search query (order number or customer name/email)
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim() || !data?.data) return data?.data || [];

    const query = searchQuery.toLowerCase().trim();
    return data.data.filter((order) => {
      const orderNumber = order.orderNumber?.toLowerCase() || "";
      const customerName = order.user
        ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase()
        : "";
      const customerEmail = order.user?.email?.toLowerCase() || "";

      return (
        orderNumber.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query)
      );
    });
  }, [data?.data, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns = [
    {
      key: "orderNumber",
      header: "Narudžba",
      render: (order: Order) => (
        <div>
          <p className="font-medium text-foreground font-mono">
            {order.orderNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("bs-BA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Kupac",
      render: (order: Order) => (
        <div>
          <p className="text-foreground font-medium">
            {order.user
              ? `${order.user.firstName} ${order.user.lastName}`
              : order.shippingAddress
              ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
              : "Gost"}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.user?.email || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Stavke",
      render: (order: Order) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {order.itemCount}
          </span>
        </div>
      ),
    },
    {
      key: "total",
      header: "Ukupno",
      render: (order: Order) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">
            {formatCurrency(order.total)} KM
          </span>
          {order.promoCode && (
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full w-fit">
              <Tag className="w-3 h-3" />
              {order.promoCode.code}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order: Order) => <StatusBadge status={order.status} />,
    },
    {
      key: "paymentStatus",
      header: "Plaćanje",
      render: (order: Order) => <StatusBadge status={order.paymentStatus} />,
    },
    {
      key: "paymentMethod",
      header: "Metoda",
      render: (order: Order) => (
        <span className="text-sm text-muted-foreground capitalize">
          {order.paymentMethod === "cash_on_delivery"
            ? "Pouzeće"
            : order.paymentMethod === "card"
            ? "Kartica"
            : order.paymentMethod}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (order: Order) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
        title="Narudžbe"
        description="Upravljajte narudžbama kupaca i dostavom"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* KPI Dashboard */}
        <OrderKPICards />

        {/* Filters and Search Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pretraži po broju narudžbe, imenu ili emailu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={status === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatus(filter.value);
                    setPage(1);
                  }}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <DataTable
            data={filteredOrders}
            columns={columns}
            loading={isLoading}
            onRowClick={(order) => router.push(`/admin/orders/${order.id}`)}
            pagination={
              !searchQuery && data?.meta
                ? {
                    page: data.meta.page,
                    limit: data.meta.limit,
                    total: data.meta.total,
                    totalPages: data.meta.totalPages,
                    onPageChange: setPage,
                  }
                : undefined
            }
            emptyMessage={
              searchQuery
                ? `Nema rezultata za "${searchQuery}"`
                : "Nema pronađenih narudžbi"
            }
          />
        </div>
      </div>
    </div>
  );
}
