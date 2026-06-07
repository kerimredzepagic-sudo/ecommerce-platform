"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader, DataTable, StatusBadge } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers, type CustomerStats } from "@/hooks/useAdminApi";
import { useDebounce } from "use-debounce";
import {
  Search,
  Users,
  TrendingUp,
  ShoppingBag,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bs } from "date-fns/locale";

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState<"totalSpent" | "orderCount" | "lastOrderDate">("totalSpent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useCustomers({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const customers = data?.data || [];

  const columns = [
    {
      key: "customer",
      header: "Kupac",
      render: (customer: CustomerStats) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{customer.name || "Nepoznato"}</p>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tip",
      render: (customer: CustomerStats) => (
        customer.isRegistered ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" />
            Registrovan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            <User className="w-3 h-3" />
            Gost
          </span>
        )
      ),
    },
    {
      key: "orders",
      header: "Narudžbe",
      render: (customer: CustomerStats) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">{customer.orderCount}</span>
        </div>
      ),
    },
    {
      key: "totalSpent",
      header: "Ukupna potrošnja",
      render: (customer: CustomerStats) => (
        <span className="font-semibold text-brand-orange">
          {customer.totalSpent.toFixed(2)} KM
        </span>
      ),
    },
    {
      key: "lastOrder",
      header: "Zadnja narudžba",
      render: (customer: CustomerStats) => (
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDistanceToNow(new Date(customer.lastOrderDate), {
              addSuffix: true,
              locale: bs,
            })}
          </span>
        </div>
      ),
    },
  ];

  // Calculate totals
  const totalCustomers = data?.meta?.total || 0;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalCustomers > 0 
    ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orderCount, 0) 
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Kupci"
        description="Pregled svih kupaca i njihove historije narudžbi"
      />

      <div className="flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                <p className="text-sm text-gray-500">Ukupno kupaca</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)} KM</p>
                <p className="text-sm text-gray-500">Ukupni prihod (ova stranica)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {avgOrderValue > 0 ? avgOrderValue.toFixed(2) : "0"} KM
                </p>
                <p className="text-sm text-gray-500">Prosječna vrijednost narudžbe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Pretraži po imenu ili emailu..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sortiraj po" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">Potrošnja</SelectItem>
                <SelectItem value="orderCount">Broj narudžbi</SelectItem>
                <SelectItem value="lastOrderDate">Zadnja narudžba</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "desc" ? "↓" : "↑"}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <DataTable
            data={customers}
            columns={columns}
            loading={isLoading}
            onRowClick={(customer) =>
              router.push(`/admin/orders/customers/${encodeURIComponent(customer.email)}`)
            }
            pagination={
              data?.meta
                ? {
                    page: data.meta.page,
                    limit: data.meta.limit,
                    total: data.meta.total,
                    totalPages: data.meta.totalPages,
                    onPageChange: setPage,
                  }
                : undefined
            }
            emptyMessage="Nema pronađenih kupaca"
          />
        </div>
      </div>
    </div>
  );
}

