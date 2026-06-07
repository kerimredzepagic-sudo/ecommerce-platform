"use client";

import { AdminHeader, StatCard, StatusBadge } from "@/components/admin";
import { useOrderAnalytics } from "@/hooks/useAdminApi";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Package,
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  pending: { label: "Na čekanju", icon: Clock, color: "bg-yellow-500" },
  confirmed: { label: "Potvrđeno", icon: CheckCircle, color: "bg-blue-500" },
  processing: { label: "U obradi", icon: Package, color: "bg-purple-500" },
  shipped: { label: "Poslano", icon: Truck, color: "bg-indigo-500" },
  delivered: { label: "Dostavljeno", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Otkazano", icon: XCircle, color: "bg-red-500" },
};

export default function StatisticsPage() {
  const { data: analyticsData, isLoading } = useOrderAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader
          title="Statistika narudžbi"
          description="Detaljna analiza narudžbi i prihoda"
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </div>
      </div>
    );
  }

  const analytics = analyticsData?.data;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Statistika narudžbi"
        description="Detaljna analiza narudžbi i prihoda"
      />

      <div className="flex-1 p-6">
        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Narudžbe na čekanju"
            value={analytics?.pending?.count || 0}
            icon={Package}
            iconColor="text-yellow-500"
            iconBgColor="bg-yellow-100"
            description={`${(analytics?.pending?.value || 0).toFixed(2)} KM vrijednosti`}
          />
          <StatCard
            title="Današnje narudžbe"
            value={analytics?.today?.count || 0}
            icon={Calendar}
            iconColor="text-blue-500"
            iconBgColor="bg-blue-100"
            description={`${(analytics?.today?.revenue || 0).toFixed(2)} KM prihoda`}
          />
          <StatCard
            title="Ovaj mjesec"
            value={analytics?.thisMonth?.count || 0}
            icon={TrendingUp}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-100"
            description={`${(analytics?.thisMonth?.revenue || 0).toFixed(2)} KM prihoda`}
          />
          <StatCard
            title="Ukupan prihod"
            value={`${(analytics?.allTime?.revenue || 0).toFixed(2)} KM`}
            icon={DollarSign}
            iconColor="text-green-500"
            iconBgColor="bg-green-100"
            description={`${analytics?.allTime?.count || 0} ukupno narudžbi`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-orange" />
              Narudžbe po statusu
            </h3>
            <div className="space-y-4">
              {analytics?.ordersByStatus?.map((statusStat) => {
                const config = statusConfig[statusStat.status] || {
                  label: statusStat.status,
                  icon: Package,
                  color: "bg-gray-500",
                };
                const Icon = config.icon;
                const totalOrders = analytics?.allTime?.count || 1;
                const percentage = (statusStat.count / totalOrders) * 100;

                return (
                  <div key={statusStat.status}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${config.color} bg-opacity-20 flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${config.color.replace('bg-', 'text-')}`} />
                        </div>
                        <span className="font-medium text-gray-900">{config.label}</span>
                        <span className="text-sm text-gray-500">({statusStat.count})</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {statusStat.value.toFixed(2)} KM
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-orange" />
              Top kupci
            </h3>
            <div className="space-y-4">
              {analytics?.topCustomers?.map((customer, index) => (
                <Link
                  key={customer.email}
                  href={`/admin/orders/customers/${encodeURIComponent(customer.email)}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center font-bold text-brand-orange">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-orange">
                      {customer.totalSpent.toFixed(2)} KM
                    </p>
                    <p className="text-xs text-gray-500">{customer.orderCount} narudžbi</p>
                  </div>
                </Link>
              ))}

              {(!analytics?.topCustomers || analytics.topCustomers.length === 0) && (
                <p className="text-gray-500 text-center py-4">Nema podataka o kupcima</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/admin/orders/customers"
                className="text-brand-orange hover:text-brand-orange/80 text-sm font-medium"
              >
                Pogledaj sve kupce →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Brzi pregled</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.pending?.count || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Narudžbe za obradu</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {(analytics?.pending?.value || 0).toFixed(0)} KM
              </p>
              <p className="text-sm text-gray-500 mt-1">Vrijednost na čekanju</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.allTime?.count
                  ? (analytics.allTime.revenue / analytics.allTime.count).toFixed(0)
                  : 0}{" "}
                KM
              </p>
              <p className="text-sm text-gray-500 mt-1">Prosječna narudžba</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.topCustomers?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Aktivnih kupaca</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

