"use client";

import { Clock, TrendingUp, CalendarDays, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrderAnalytics, type OrderAnalytics } from "@/hooks/useAdminApi";

interface KPICardProps {
  title: string;
  count: number;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  highlight?: boolean;
}

function KPICard({
  title,
  count,
  value,
  icon,
  iconBgColor,
  iconColor,
  highlight = false,
}: KPICardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-5 transition-all hover:shadow-md",
        highlight ? "border-brand-orange ring-1 ring-brand-orange/20" : "border-gray-200"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{count}</span>
            <span className="text-sm text-gray-500">narudžbi</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-lg font-semibold text-brand-orange">
              {formatCurrency(value)} KM
            </span>
          </div>
        </div>
        <div className={cn("p-3 rounded-xl", iconBgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface TopCustomerCardProps {
  customers: OrderAnalytics["topCustomers"];
}

function TopCustomersCard({ customers }: TopCustomerCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bs-BA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Top Kupci
      </h3>
      <div className="space-y-3">
        {customers.slice(0, 5).map((customer, index) => (
          <div
            key={customer.userId}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                    ? "bg-gray-200 text-gray-600"
                    : index === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                <p className="text-xs text-gray-500">{customer.orderCount} narudžbi</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(customer.totalSpent)} KM
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface OrdersByStatusCardProps {
  ordersByStatus: OrderAnalytics["ordersByStatus"];
}

function OrdersByStatusCard({ ordersByStatus }: OrdersByStatusCardProps) {
  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Na čekanju", color: "bg-yellow-500" },
    confirmed: { label: "Potvrđeno", color: "bg-blue-500" },
    processing: { label: "U obradi", color: "bg-purple-500" },
    shipped: { label: "Poslano", color: "bg-cyan-500" },
    delivered: { label: "Dostavljeno", color: "bg-green-500" },
    cancelled: { label: "Otkazano", color: "bg-red-500" },
  };

  const totalOrders = ordersByStatus.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        Status Narudžbi
      </h3>
      <div className="space-y-3">
        {ordersByStatus.map((item) => {
          const statusInfo = statusLabels[item.status] || {
            label: item.status,
            color: "bg-gray-500",
          };
          const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;

          return (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{statusInfo.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={cn("h-2 rounded-full transition-all", statusInfo.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrderKPICards() {
  const { data, isLoading } = useOrderAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  const analytics = data?.data;

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Na čekanju"
          count={analytics.pending.count}
          value={analytics.pending.value}
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          highlight={analytics.pending.count > 0}
        />
        <KPICard
          title="Danas"
          count={analytics.today.count}
          value={analytics.today.revenue}
          icon={<TrendingUp className="w-6 h-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <KPICard
          title="Ovaj mjesec"
          count={analytics.thisMonth.count}
          value={analytics.thisMonth.revenue}
          icon={<CalendarDays className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Ukupno"
          count={analytics.allTime.count}
          value={analytics.allTime.revenue}
          icon={<DollarSign className="w-6 h-6" />}
          iconBgColor="bg-brand-orange/10"
          iconColor="text-brand-orange"
        />
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrdersByStatusCard ordersByStatus={analytics.ordersByStatus} />
        <TopCustomersCard customers={analytics.topCustomers} />
      </div>
    </div>
  );
}

