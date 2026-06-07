"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShippingSettings, useUpdateShippingSettings } from "@/hooks/useAdminApi";
import { toast } from "sonner";
import { Loader2, Truck, Package, Receipt } from "lucide-react";

const shippingSchema = z.object({
  flatRate: z.number().min(0, "Cijena mora biti pozitivna"),
  freeShippingThreshold: z.number().min(0, "Prag mora biti pozitivan"),
  taxRate: z.number().min(0).max(1, "PDV mora biti između 0 i 1 (npr. 0.17 za 17%)"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function ShippingSettingsPage() {
  const { data, isLoading } = useShippingSettings();
  const updateSettings = useUpdateShippingSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      flatRate: 5,
      freeShippingThreshold: 50,
      taxRate: 0.17,
    },
  });

  // Reset form when data loads
  useEffect(() => {
    if (data?.data) {
      reset({
        flatRate: data.data.flatRate,
        freeShippingThreshold: data.data.freeShippingThreshold,
        taxRate: data.data.taxRate,
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: ShippingFormData) => {
    try {
      await updateSettings.mutateAsync(formData);
      toast.success("Postavke dostave uspješno sačuvane");
    } catch {
      toast.error("Greška pri čuvanju postavki");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Postavke Dostave"
        description="Konfigurirajte cijene dostave i PDV"
      />

      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
          {/* Flat Rate Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cijena Dostave</h3>
                  <p className="text-sm text-gray-500">Fiksna cijena za dostavu narudžbi</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flatRate">Cijena dostave (KM)</Label>
                  <Input
                    id="flatRate"
                    type="number"
                    step="0.01"
                    {...register("flatRate", { valueAsNumber: true })}
                    className="max-w-xs"
                  />
                  {errors.flatRate && (
                    <p className="text-sm text-red-500">{errors.flatRate.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Free Shipping Threshold */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Besplatna Dostava</h3>
                  <p className="text-sm text-gray-500">Prag za besplatnu dostavu (0 = nikad besplatna)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Minimalni iznos za besplatnu dostavu (KM)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    step="0.01"
                    {...register("freeShippingThreshold", { valueAsNumber: true })}
                    className="max-w-xs"
                  />
                  {errors.freeShippingThreshold && (
                    <p className="text-sm text-red-500">{errors.freeShippingThreshold.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Narudžbe iznad ovog iznosa imaju besplatnu dostavu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-orange-100">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">PDV</h3>
                  <p className="text-sm text-gray-500">Stopa poreza na dodanu vrijednost</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">PDV stopa (decimalni broj, npr. 0.17 za 17%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    {...register("taxRate", { valueAsNumber: true })}
                    className="max-w-xs"
                  />
                  {errors.taxRate && (
                    <p className="text-sm text-red-500">{errors.taxRate.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Unesite kao decimalni broj (0.17 = 17%)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || updateSettings.isPending}
              className="min-w-[150px]"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Čuvanje...
                </>
              ) : (
                "Sačuvaj Postavke"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

