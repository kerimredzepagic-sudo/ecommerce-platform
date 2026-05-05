"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Search, X, Filter, Download } from "lucide-react";
import { AdminHeader, DataTable, StatusBadge, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts, useDeleteProduct, useCategories, type Product } from "@/hooks/useAdminApi";
import { authenticatedFetch } from "@/lib/authClient";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [lineFilter, setLineFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategories();

  // Convert filter strings to proper boolean values
  const isActiveFilter = statusFilter === "" ? undefined : statusFilter === "active";
  const inStockFilter = stockFilter === "" ? undefined : stockFilter === "inStock";

  const { data, isLoading } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
    category: categoryFilter || undefined,
    line: lineFilter || undefined,
    isActive: isActiveFilter,
    inStock: inStockFilter,
  });
  const deleteProduct = useDeleteProduct();

  // Count active filters
  const activeFiltersCount = [categoryFilter, lineFilter, statusFilter, stockFilter].filter(Boolean).length;

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setLineFilter("");
    setStatusFilter("");
    setStockFilter("");
    setPage(1);
  };

  const LINE_LABELS: Record<string, string> = {
    originals: "Originals",
    premium: "Premium",
    health: "Health",
    energy: "Energy",
  };

  const [exporting, setExporting] = useState(false);

  const exportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);
      if (lineFilter) params.set("line", lineFilter);
      if (isActiveFilter !== undefined) params.set("isActive", String(isActiveFilter));
      if (inStockFilter !== undefined) params.set("inStock", String(inStockFilter));

      const response = await authenticatedFetch(`${API_BASE}/products/export/csv?${params.toString()}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proizvodi_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  // Get primary image or first image URL
  const getProductImage = (product: Product): string | null => {
    // Handle single image field (from list API)
    if (product.image) {
      return product.image;
    }
    // Handle images array (from detail API)
    if (!product.images || product.images.length === 0) return null;
    const primaryImage = product.images.find((img) => img.isPrimary);
    return primaryImage?.url || product.images[0]?.url || null;
  };

  const columns = [
    {
      key: "name",
      header: "Proizvod",
      render: (product: Product) => {
        const imageUrl = getProductImage(product);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                  Bez slike
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sku || "Bez SKU"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Kategorija",
      render: (product: Product) => (
        <span className="text-muted-foreground">{product.category?.name || "-"}</span>
      ),
    },
    {
      key: "price",
      header: "Cijena",
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{product.price.toFixed(2)} KM</span>
          {product.isOnSale && product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.compareAtPrice.toFixed(2)} KM
            </span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Zaliha",
      render: (product: Product) => {
        const stockColor =
          product.stock > 10
            ? "text-emerald-600 bg-emerald-50"
            : product.stock > 0
            ? "text-amber-600 bg-amber-50"
            : "text-red-600 bg-red-50";
        return (
          <span className={cn("px-2 py-0.5 rounded text-xs font-medium", stockColor)}>
            {product.stock}
          </span>
        );
      },
    },
    {
      key: "isActive",
      header: "Status",
      render: (product: Product) => (
        <StatusBadge status={product.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "Akcije",
      className: "text-right",
      render: (product: Product) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/shop/product/${product.slug}`, "_blank");
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/products/${product.id}`);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(product.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Proizvodi"
        description="Upravljajte katalogom proizvoda"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCSV} disabled={exporting}>
              <Download className="w-4 h-4 mr-2" />
              {exporting ? "Eksportiranje..." : "Export CSV"}
            </Button>
            <Button onClick={() => router.push("/admin/products/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj proizvod
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pretraži proizvode..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-10 pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Sve kategorije" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve kategorije</SelectItem>
                {categoriesData?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {"—".repeat(category.level - 1)} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Line Filter */}
            <Select
              value={lineFilter}
              onValueChange={(value) => {
                setLineFilter(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Sve linije" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve linije</SelectItem>
                <SelectItem value="originals">Originals</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Svi statusi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Aktivan
                  </div>
                </SelectItem>
                <SelectItem value="inactive">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Neaktivan
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Stock Filter */}
            <Select
              value={stockFilter}
              onValueChange={(value) => {
                setStockFilter(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Sve zalihe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve zalihe</SelectItem>
                <SelectItem value="inStock">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Na stanju
                  </div>
                </SelectItem>
                <SelectItem value="outOfStock">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Nema na stanju
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-10 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Obriši filtere ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Active filters summary */}
          {(search || activeFiltersCount > 0) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Aktivni filteri:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-medium">
                  Pretraga: "{search}"
                  <button
                    onClick={() => setSearch("")}
                    className="hover:bg-brand-orange/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                  Kategorija: {categoriesData?.data?.find((c) => c.id === categoryFilter)?.name}
                  <button
                    onClick={() => setCategoryFilter("")}
                    className="hover:bg-blue-500/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {lineFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 text-xs font-medium">
                  Linija: {lineFilter === "originals" ? "Originals" : lineFilter === "premium" ? "Premium" : lineFilter === "health" ? "Health" : "Energy"}
                  <button
                    onClick={() => setLineFilter("")}
                    className="hover:bg-teal-500/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-medium">
                  Status: {statusFilter === "active" ? "Aktivan" : "Neaktivan"}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="hover:bg-purple-500/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {stockFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                  Zaliha: {stockFilter === "inStock" ? "Na stanju" : "Nema na stanju"}
                  <button
                    onClick={() => setStockFilter("")}
                    className="hover:bg-amber-500/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <DataTable
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          onRowClick={(product) => router.push(`/admin/products/${product.id}`)}
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
          emptyMessage="Nema pronađenih proizvoda. Dodajte svoj prvi proizvod!"
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Obriši proizvod"
        description="Jeste li sigurni da želite obrisati ovaj proizvod? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="danger"
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
