"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useLocation,
  useCreateLocation,
  useUpdateLocation,
  LocationInput,
} from "@/hooks/useAdminApi";
import {
  AdminHeader,
  SidebarLayout,
  ContentCard,
  type SidebarTab,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  MapPin,
  Clock,
  Phone,
  Settings,
  Loader2,
  Plus,
  X,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

// Tabs configuration
const tabs: SidebarTab[] = [
  { id: "basic", label: "Osnovne informacije", icon: FileText },
  { id: "address", label: "Adresa", icon: MapPin },
  { id: "contact", label: "Kontakt", icon: Phone },
  { id: "hours", label: "Radno vrijeme", icon: Clock },
  { id: "features", label: "Karakteristike", icon: Tag },
  { id: "settings", label: "Postavke", icon: Settings },
];

const locationSchema = z.object({
  name: z.string().min(1, "Naziv je obavezan"),
  subtitle: z.string().optional(),
  address: z.string().min(1, "Adresa je obavezna"),
  city: z.string().min(1, "Grad je obavezan"),
  phone: z.string().min(1, "Telefon je obavezan"),
  email: z.string().email("Unesite validan email"),
  workingHours: z.object({
    weekdays: z.string().min(1, "Radno vrijeme je obavezno"),
    saturday: z.string().min(1, "Radno vrijeme je obavezno"),
    sunday: z.string().min(1, "Radno vrijeme je obavezno"),
  }),
  image: z.string().optional(),
  mapUrl: z.string().optional(),
  features: z.array(z.object({ value: z.string() })),
  isHighlight: z.boolean(),
  isActive: z.boolean(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

export default function LocationFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const { data: locationData, isLoading } = useLocation(id);
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      subtitle: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      workingHours: {
        weekdays: "08:00 - 20:00",
        saturday: "08:00 - 16:00",
        sunday: "Zatvoreno",
      },
      image: "",
      mapUrl: "",
      features: [],
      isHighlight: false,
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  // Load existing data
  useEffect(() => {
    if (locationData?.data && !isNew) {
      const l = locationData.data;
      form.reset({
        name: l.name,
        subtitle: l.subtitle || "",
        address: l.address,
        city: l.city,
        phone: l.phone,
        email: l.email,
        workingHours: {
          weekdays: l.workingHours?.weekdays || "08:00 - 20:00",
          saturday: l.workingHours?.saturday || "08:00 - 16:00",
          sunday: l.workingHours?.sunday || "Zatvoreno",
        },
        image: l.image || "",
        mapUrl: l.mapUrl || "",
        features: (l.features || []).map((f) => ({ value: f })),
        isHighlight: l.isHighlight ?? false,
        isActive: l.isActive ?? true,
      });
    }
  }, [locationData, isNew, form]);

  const onSubmit = async (values: LocationFormValues) => {
    try {
      const data: LocationInput = {
        name: values.name,
        subtitle: values.subtitle || undefined,
        address: values.address,
        city: values.city,
        phone: values.phone,
        email: values.email,
        workingHours: values.workingHours,
        image: values.image || undefined,
        mapUrl: values.mapUrl || undefined,
        features: values.features.map((f) => f.value).filter((v) => v.trim() !== ""),
        isHighlight: values.isHighlight,
        isActive: values.isActive,
      };

      if (isNew) {
        await createLocation.mutateAsync(data);
        toast.success("Poslovnica uspješno kreirana");
      } else {
        await updateLocation.mutateAsync({ id, data });
        toast.success("Poslovnica uspješno ažurirana");
      }

      router.push("/admin/locations");
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(
        isNew ? "Greška pri kreiranju poslovnice" : "Greška pri ažuriranju poslovnice"
      );
    }
  };

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AdminHeader
            title={isNew ? "Nova poslovnica" : "Uredi poslovnicu"}
            description={
              isNew
                ? "Kreirajte novu poslovnicu"
                : "Uredite postojeću poslovnicu"
            }
            showBack
            formActions={{
              isSubmitting: createLocation.isPending || updateLocation.isPending,
              submitLabel:
                createLocation.isPending || updateLocation.isPending
                  ? "Spremanje..."
                  : isNew
                  ? "Kreiraj poslovnicu"
                  : "Spremi promjene",
            }}
          />

          <div className="flex-1 p-6">
            <SidebarLayout tabs={tabs}>
              <div className="space-y-6">
                {(createLocation.isError || updateLocation.isError) && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    Greška pri spremanju poslovnice
                  </div>
                )}

                {/* Basic Info Section */}
                <section id="basic">
                  <ContentCard title="Osnovne informacije" icon={FileText}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Naziv poslovnice *</FormLabel>
                            <FormControl>
                              <Input placeholder="npr. Maksuz Kutak Grbavica" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Podnaslov</FormLabel>
                            <FormControl>
                              <Input placeholder="npr. Centrala" {...field} />
                            </FormControl>
                            <FormDescription>
                              Opcioni tekst ispod naziva (npr. &quot;Centrala&quot;)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Address Section */}
                <section id="address">
                  <ContentCard title="Adresa" icon={MapPin}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ulica i broj *</FormLabel>
                            <FormControl>
                              <Input placeholder="npr. Radnička bb, Grbavica" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grad i poštanski broj *</FormLabel>
                            <FormControl>
                              <Input placeholder="npr. 71000 Sarajevo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mapUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Maps Link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://maps.google.com/?q=..."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Link za otvaranje lokacije na Google Maps
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Contact Section */}
                <section id="contact">
                  <ContentCard title="Kontakt" icon={Phone}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon *</FormLabel>
                            <FormControl>
                              <Input placeholder="+387 33 123 456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="grbavica@maksuz.ba"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Working Hours Section */}
                <section id="hours">
                  <ContentCard title="Radno vrijeme" icon={Clock}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="workingHours.weekdays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ponedjeljak - Petak *</FormLabel>
                            <FormControl>
                              <Input placeholder="08:00 - 20:00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workingHours.saturday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subota *</FormLabel>
                            <FormControl>
                              <Input placeholder="08:00 - 16:00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workingHours.sunday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nedjelja *</FormLabel>
                            <FormControl>
                              <Input placeholder="Zatvoreno" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Features Section */}
                <section id="features">
                  <ContentCard title="Karakteristike" icon={Tag}>
                    <div className="space-y-4">
                      <FormDescription>
                        Dodajte karakteristike poslovnice (npr. &quot;Kompletan asortiman&quot;, &quot;Degustacija&quot;, &quot;Parking&quot;)
                      </FormDescription>

                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`features.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="npr. Kompletan asortiman" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ value: "" })}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Dodaj karakteristiku
                      </Button>
                    </div>
                  </ContentCard>
                </section>

                {/* Settings Section */}
                <section id="settings">
                  <ContentCard title="Postavke" icon={Settings}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="isHighlight"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Centrala</FormLabel>
                              <FormDescription>
                                Označi ovu poslovnicu kao glavnu centralu
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Aktivna</FormLabel>
                              <FormDescription>
                                Prikaži poslovnicu na stranici
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>
              </div>
            </SidebarLayout>
          </div>
        </form>
      </Form>
    </div>
  );
}
