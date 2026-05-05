"use client";

import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import { AdminHeader, StatCard } from "@/components/admin";

// Mock data - will be replaced with real API calls
const stats = [
  {
    title: "Ukupan prihod",
    value: "24.532 KM",
    change: { value: 12, type: "increase" as const },
    icon: DollarSign,
    iconColor: "text-green-500",
    iconBgColor: "bg-green-100",
  },
  {
    title: "Ukupno narudžbi",
    value: "156",
    change: { value: 8, type: "increase" as const },
    icon: ShoppingCart,
    iconColor: "text-blue-500",
    iconBgColor: "bg-blue-100",
  },
  {
    title: "Ukupno proizvoda",
    value: "48",
    change: { value: 3, type: "increase" as const },
    icon: Package,
    iconColor: "text-purple-500",
    iconBgColor: "bg-purple-100",
  },
  {
    title: "Ukupno kupaca",
    value: "892",
    change: { value: 15, type: "increase" as const },
    icon: Users,
    iconColor: "text-orange-500",
    iconBgColor: "bg-orange-100",
  },
];

const recentOrders = [
  {
    id: "1",
    orderNumber: "MKS-ABC123",
    customer: "Mujo Mujić",
    total: "125,00 KM",
    status: "U obradi",
    date: "Prije 2 sata",
  },
  {
    id: "2",
    orderNumber: "MKS-DEF456",
    customer: "Hana Hanić",
    total: "89,50 KM",
    status: "Poslano",
    date: "Prije 5 sati",
  },
  {
    id: "3",
    orderNumber: "MKS-GHI789",
    customer: "Amir Amirović",
    total: "245,00 KM",
    status: "Na čekanju",
    date: "Prije 1 dan",
  },
  {
    id: "4",
    orderNumber: "MKS-JKL012",
    customer: "Amina Aminić",
    total: "67,25 KM",
    status: "Dostavljeno",
    date: "Prije 2 dana",
  },
];

const recentMessages = [
  {
    id: "1",
    name: "Selma Selimović",
    subject: "Upit o proizvodu",
    status: "new",
    date: "Prije 1 sat",
  },
  {
    id: "2",
    name: "Edin Edić",
    subject: "Problem sa narudžbom",
    status: "read",
    date: "Prije 3 sata",
  },
  {
    id: "3",
    name: "Emina Eminović",
    subject: "Pitanje o dostavi",
    status: "replied",
    date: "Prije 1 dan",
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Kontrolna tabla"
        description="Dobrodošli nazad! Evo šta se dešava u vašoj trgovini."
      />

      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
              <a
                href="/admin/orders"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Pogledaj sve →
              </a>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.total}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats & Messages */}
          <div className="space-y-6">
            {/* Performance Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Performanse</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Stopa konverzije
                  </span>
                  <span className="font-medium text-gray-900">3,2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Prosječna vrijednost narudžbe
                  </span>
                  <span className="font-medium text-gray-900">156,50 KM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Stopa povrata</span>
                  <span className="font-medium text-gray-900">2,1%</span>
                </div>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Poruke</h3>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  3 nove
                </span>
              </div>
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {message.name}
                      </p>
                      <p className="text-xs text-gray-500">{message.subject}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {message.date}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="/admin/contacts"
                className="block text-center text-sm text-orange-500 hover:text-orange-600 mt-4 pt-4 border-t border-gray-100"
              >
                Pogledaj sve poruke →
              </a>
            </div>

            {/* Blog Posts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Blog objave</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Objavljenih članaka</p>
              </div>
              <a
                href="/admin/blog"
                className="block text-center text-sm text-orange-500 hover:text-orange-600 pt-4 border-t border-gray-100"
              >
                Upravljaj blogom →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
