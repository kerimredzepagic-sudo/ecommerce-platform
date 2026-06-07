"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrderStats, useMyOrders, Order } from "@/hooks/useAccountApi";
import { AdminHeader, StatCard } from "@/components/admin";
import { format } from "date-fns";
import { bs } from "date-fns/locale";
import {
  Package,
  Clock,
  CheckCircle,
  CreditCard,
  ShoppingCart,
  Loader2,
  Settings,
  ShoppingBag,
} from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Na čekanju",
  confirmed: "Potvrđeno",
  processing: "U obradi",
  shipped: "Poslano",
  delivered: "Dostavljeno",
  cancelled: "Otkazano",
};

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useMyOrderStats();
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders({ limit: 5 });

  const stats = statsData?.data;
  const recentOrders = ordersData?.data || [];

  const statCards = [
    {
      title: "Ukupno narudžbi",
      value: statsLoading ? "..." : (stats?.totalOrders || 0).toString(),
      icon: Package,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Aktivne narudžbe",
      value: statsLoading ? "..." : (stats?.pendingOrders || 0).toString(),
      icon: Clock,
      iconColor: "text-yellow-500",
      iconBgColor: "bg-yellow-100",
    },
    {
      title: "Dostavljeno",
      value: statsLoading ? "..." : (stats?.completedOrders || 0).toString(),
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-100",
    },
    {
      title: "Ukupna potrošnja",
      value: statsLoading ? "..." : `${(stats?.totalSpent || 0).toFixed(2)} KM`,
      icon: CreditCard,
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title={`Dobrodošli, ${user?.firstName || "Korisniče"}!`}
        description="Pratite svoje narudžbe i upravljajte postavkama računa."
      />

      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Nedavne narudžbe
              </h2>
              <Link
                href="/account/orders"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Pogledaj sve →
              </Link>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nemate narudžbi</p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-sm text-orange-500 hover:text-orange-600"
                >
                  Započnite kupovinu →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: Order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(order.createdAt), "d. MMM yyyy", {
                            locale: bs,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {order.total.toFixed(2)} KM
                      </p>
                      <p className="text-sm text-gray-500">
                        {statusLabels[order.status]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Vaš račun</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Ime</span>
                  <span className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 text-right truncate max-w-[180px]">
                    {user?.email}
                  </span>
                </div>
                {user?.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Telefon</span>
                    <span className="font-medium text-gray-900">
                      {user.phone}
                    </span>
                  </div>
                )}
              </div>
              <Link
                href="/account/settings"
                className="block text-center text-sm text-orange-500 hover:text-orange-600 mt-4 pt-4 border-t border-gray-100"
              >
                Uredi postavke →
              </Link>
            </div>

            {/* Continue Shopping */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Nastavi kupovinu</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Pregledajte naše najnovije proizvode i ponude.
              </p>
              <Link
                href="/"
                className="block text-center text-sm text-orange-500 hover:text-orange-600 pt-4 border-t border-gray-100"
              >
                Idi na shop →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
