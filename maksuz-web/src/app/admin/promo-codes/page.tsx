"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminHeader, DataTable, StatusBadge } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  usePromoCodes,
  useCreatePromoCode,
  useTogglePromoCode,
  useDeletePromoCode,
  usePromoCodeWithOrders,
  type PromoCode,
} from "@/hooks/useAdminApi";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Trash2,
  Power,
  Tag,
  Percent,
  DollarSign,
  Truck,
  Copy,
  Sparkles,
  X,
  Eye,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const promoCodeSchema = z.object({
  code: z
    .string()
    .min(3, "Kod mora imati najmanje 3 karaktera")
    .max(20, "Kod može imati najviše 20 karaktera"),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().min(0, "Vrijednost mora biti pozitivna"),
  minOrderAmount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional().nullable(),
  validFrom: z.string().min(1, "Datum početka je obavezan"),
  validUntil: z.string().min(1, "Datum isteka je obavezan"),
});

type PromoCodeFormData = z.infer<typeof promoCodeSchema>;

export default function PromoCodesPage() {
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);

  const { data, isLoading } = usePromoCodes({ page, limit: 15 });
  const { data: promoWithOrders, isLoading: ordersLoading } =
    usePromoCodeWithOrders(selectedPromoId || "");
  const createPromoCode = useCreatePromoCode();
  const togglePromoCode = useTogglePromoCode();
  const deletePromoCode = useDeletePromoCode();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromoCodeFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 10,
      minOrderAmount: 0,
      maxUses: null,
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  const selectedType = watch("type");

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("code", code);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Kod kopiran u clipboard");
  };

  const onSubmit = async (formData: PromoCodeFormData) => {
    try {
      await createPromoCode.mutateAsync({
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
      });
      toast.success("Promo kod uspješno kreiran");
      setIsDrawerOpen(false);
      reset();
    } catch {
      toast.error("Greška pri kreiranju promo koda");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await togglePromoCode.mutateAsync(id);
      toast.success("Status promo koda ažuriran");
    } catch {
      toast.error("Greška pri ažuriranju statusa");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePromoCode.mutateAsync(deleteId);
      toast.success("Promo kod obrisan");
      setDeleteId(null);
    } catch {
      toast.error("Greška pri brisanju promo koda");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="w-4 h-4" />;
      case "fixed":
        return <DollarSign className="w-4 h-4" />;
      case "free_shipping":
        return <Truck className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "percentage":
        return "Postotak";
      case "fixed":
        return "Fiksni iznos";
      case "free_shipping":
        return "Besplatna dostava";
      default:
        return type;
    }
  };

  const formatValue = (promo: PromoCode) => {
    switch (promo.type) {
      case "percentage":
        return `${promo.value}%`;
      case "fixed":
        return `${promo.value} KM`;
      case "free_shipping":
        return "Besplatna dostava";
      default:
        return String(promo.value);
    }
  };

  const columns = [
    {
      key: "code",
      header: "Kod",
      render: (promo: PromoCode) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-gray-900">
            {promo.code}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(promo.code);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tip",
      render: (promo: PromoCode) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(promo.type)}
          <span>{getTypeLabel(promo.type)}</span>
        </div>
      ),
    },
    {
      key: "value",
      header: "Vrijednost",
      render: (promo: PromoCode) => (
        <span className="font-semibold text-brand-orange">
          {formatValue(promo)}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Korištenje",
      render: (promo: PromoCode) => (
        <span className="text-gray-600">
          {promo.usedCount} / {promo.maxUses ?? "∞"}
        </span>
      ),
    },
    {
      key: "validity",
      header: "Validnost",
      render: (promo: PromoCode) => {
        const now = new Date();
        const validFrom = new Date(promo.validFrom);
        const validUntil = new Date(promo.validUntil);
        const isExpired = now > validUntil;
        const isNotStarted = now < validFrom;

        return (
          <div className="text-sm">
            <p
              className={cn(
                isExpired && "text-red-500",
                isNotStarted && "text-yellow-600"
              )}
            >
              {validFrom.toLocaleDateString("bs-BA")} -{" "}
              {validUntil.toLocaleDateString("bs-BA")}
            </p>
            {isExpired && <span className="text-xs text-red-500">Istekao</span>}
            {isNotStarted && (
              <span className="text-xs text-yellow-600">Nije počeo</span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (promo: PromoCode) => (
        <StatusBadge status={promo.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (promo: PromoCode) => (
        <div className="flex items-center justify-end gap-2">
          {promo.usedCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPromoId(promo._id);
              }}
              className="h-8 w-8 text-blue-500 hover:text-blue-700"
              title="Pogledaj narudžbe"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(promo._id);
            }}
            className={cn(
              "h-8 w-8",
              promo.isActive
                ? "text-green-600 hover:text-green-700"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Power className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(promo._id);
            }}
            className="h-8 w-8 text-red-500 hover:text-red-700"
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
        title="Promo Kodovi"
        description="Upravljajte promotivnim kodovima i popustima"
        actions={
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novi Promo Kod
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-orange" />
                  Kreiraj Promo Kod
                </SheetTitle>
                <SheetDescription>
                  Popunite formu ispod za kreiranje novog promotivnog koda
                </SheetDescription>
              </SheetHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 mt-6"
              >
                {/* Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">Kod</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      {...register("code")}
                      placeholder="POPUST10"
                      className="uppercase font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomCode}
                      title="Generiši nasumični kod"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.code && (
                    <p className="text-sm text-red-500">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label>Tip Popusta</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) =>
                      setValue(
                        "type",
                        value as "percentage" | "fixed" | "free_shipping"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          Postotak (%)
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Fiksni iznos (KM)
                        </div>
                      </SelectItem>
                      <SelectItem value="free_shipping">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Besplatna dostava
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Value */}
                {selectedType !== "free_shipping" && (
                  <div className="space-y-2">
                    <Label htmlFor="value">
                      Vrijednost{" "}
                      {selectedType === "percentage" ? "(%)" : "(KM)"}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      {...register("value", { valueAsNumber: true })}
                    />
                    {errors.value && (
                      <p className="text-sm text-red-500">
                        {errors.value.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Min Order Amount */}
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">
                    Minimalni iznos narudžbe (KM)
                  </Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...register("minOrderAmount", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-gray-500">
                    Ostavite 0 za bez ograničenja
                  </p>
                </div>

                {/* Max Uses */}
                <div className="space-y-2">
                  <Label htmlFor="maxUses">Maksimalni broj korištenja</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    placeholder="Neograničeno"
                    {...register("maxUses", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-gray-500">
                    Ostavite prazno za neograničeno korištenje
                  </p>
                </div>

                {/* Validity Period */}
                <div className="space-y-4">
                  <Label>Period Validnosti</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="validFrom"
                        className="text-xs text-gray-500"
                      >
                        Od
                      </Label>
                      <Input
                        id="validFrom"
                        type="date"
                        {...register("validFrom")}
                      />
                      {errors.validFrom && (
                        <p className="text-sm text-red-500">
                          {errors.validFrom.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="validUntil"
                        className="text-xs text-gray-500"
                      >
                        Do
                      </Label>
                      <Input
                        id="validUntil"
                        type="date"
                        {...register("validUntil")}
                      />
                      {errors.validUntil && (
                        <p className="text-sm text-red-500">
                          {errors.validUntil.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Otkaži
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-brand-orange hover:bg-brand-orange/90"
                    disabled={createPromoCode.isPending}
                  >
                    {createPromoCode.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Kreiranje...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Kreiraj
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        }
      />

      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <DataTable
            data={data?.data || []}
            columns={columns}
            loading={isLoading}
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
            emptyMessage="Nema promo kodova"
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obriši promo kod?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija se ne može poništiti. Promo kod će biti trajno obrisan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Orders Drawer */}
      <Sheet
        open={!!selectedPromoId}
        onOpenChange={() => setSelectedPromoId(null)}
      >
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-orange" />
              Narudžbe s promo kodom
            </SheetTitle>
            {promoWithOrders?.data && (
              <SheetDescription>
                <span className="font-mono font-bold text-brand-orange">
                  {promoWithOrders.data.code}
                </span>{" "}
                - Korišten {promoWithOrders.data.usedCount} puta
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
              </div>
            ) : promoWithOrders?.data?.usedInOrders?.length ? (
              promoWithOrders.data.usedInOrders.map((order) => {
                const customerName = order.user
                  ? `${order.user.firstName} ${order.user.lastName}`
                  : order.guestName ||
                    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
                const customerEmail =
                  order.user?.email || order.guestEmail || "";

                return (
                  <div
                    key={order._id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono font-medium text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {customerName}
                        </p>
                        {customerEmail && (
                          <p className="text-xs text-gray-500">
                            {customerEmail}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(order.createdAt).toLocaleDateString(
                            "bs-BA",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-orange">
                          {order.total.toFixed(2)} KM
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <a
                        href={`/admin/orders/${order._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Pogledaj narudžbu
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nema narudžbi s ovim promo kodom
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
