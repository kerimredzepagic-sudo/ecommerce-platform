"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Info,
  FileText,
  Image as ImageIcon,
  Search,
  Send,
  ListChecks,
  X,
  Plus,
} from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCareer } from "@/hooks/useAdminApi";
import {
  ImageGallery,
  ProductImage,
} from "@/components/admin/products/ImageGallery";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

// Tabs configuration with icons
const tabs: SidebarTab[] = [
  { id: "basic", label: "Osnovne informacije", icon: Info },
  { id: "content", label: "Sadržaj", icon: FileText },
  { id: "lists", label: "Zahtjevi & Beneficije", icon: ListChecks },
  { id: "media", label: "Slika", icon: ImageIcon },
  { id: "seo", label: "SEO", icon: Search },
  { id: "publishing", label: "Objavljivanje", icon: Send },
];

interface CareerFormValues {
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  shortDescription: string;
  fullDescription: string;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  isFeatured: boolean;
  expiresAt: string;
  order: number;
}

export default function NewCareerPage() {
  const router = useRouter();
  const createCareer = useCreateCareer();

  const [coverImage, setCoverImage] = useState<ProductImage[]>([]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  const form = useForm<CareerFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      department: "",
      location: "",
      employmentType: "full-time",
      shortDescription: "",
      fullDescription: "",
      metaTitle: "",
      metaDescription: "",
      isActive: false,
      isFeatured: false,
      expiresAt: "",
      order: 0,
    },
  });

  const watchTitle = form.watch("title");

  // Auto-generate slug from title
  const generateSlug = () => {
    const slug = watchTitle
      .toLowerCase()
      .replace(/[čć]/g, "c")
      .replace(/[šś]/g, "s")
      .replace(/ž/g, "z")
      .replace(/đ/g, "dj")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    form.setValue("slug", slug);
  };

  // Array field handlers
  const addArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const updateArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const removeArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: CareerFormValues) => {
    try {
      const careerData = {
        title: values.title,
        slug: values.slug || undefined,
        department: values.department,
        location: values.location,
        employmentType: values.employmentType as "full-time" | "part-time" | "contract" | "internship",
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        requirements: requirements.filter((r) => r.trim() !== ""),
        responsibilities: responsibilities.filter((r) => r.trim() !== ""),
        benefits: benefits.filter((b) => b.trim() !== ""),
        coverImage: coverImage[0]?.url || undefined,
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        isActive: values.isActive,
        isFeatured: values.isFeatured,
        expiresAt: values.expiresAt || undefined,
        order: values.order || 0,
      };

      await createCareer.mutateAsync(careerData);
      router.push("/admin/careers");
    } catch (error) {
      console.error("Greška pri kreiranju pozicije:", error);
    }
  };

  const ArrayFieldList = ({
    items,
    setter,
    placeholder,
    label,
  }: {
    items: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder: string;
    label: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem(setter)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Dodaj
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateArrayItem(setter, index, e.target.value)}
              placeholder={placeholder}
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem(setter, index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AdminHeader
            title="Nova pozicija"
            description="Kreirajte novi oglas za posao"
            showBack
            formActions={{
              isSubmitting: createCareer.isPending,
              submitLabel: createCareer.isPending
                ? "Kreiranje..."
                : "Kreiraj poziciju",
            }}
          />

          <div className="flex-1 p-6">
            <SidebarLayout tabs={tabs}>
              <div className="space-y-6">
                {createCareer.isError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    {createCareer.error?.message ||
                      "Greška pri kreiranju pozicije"}
                  </div>
                )}

                {/* Basic Info Section */}
                <section id="basic">
                  <ContentCard title="Osnovne informacije" icon={Info}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Naziv je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Naziv pozicije *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="npr. Prodajni savjetnik"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  placeholder="url-slug-pozicije"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateSlug}
                              >
                                Generiši
                              </Button>
                            </div>
                            <FormDescription>
                              /karijera/{field.value || "slug"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="department"
                          rules={{ required: "Odjel je obavezan" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Odjel *</FormLabel>
                              <FormControl>
                                <Input placeholder="npr. Prodaja" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          rules={{ required: "Lokacija je obavezna" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lokacija *</FormLabel>
                              <FormControl>
                                <Input placeholder="npr. Sarajevo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="employmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tip zaposlenja</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  {...field}
                                >
                                  <option value="full-time">Puno radno vrijeme</option>
                                  <option value="part-time">Pola radnog vremena</option>
                                  <option value="contract">Ugovor</option>
                                  <option value="internship">Praksa</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Redoslijed</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value) || 0)
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Manji broj = viši prioritet
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              Istaknuta pozicija (prikazuje se na vrhu)
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Content Section */}
                <section id="content">
                  <ContentCard title="Sadržaj oglasa" icon={FileText}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="shortDescription"
                        rules={{ required: "Kratki opis je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kratki opis *</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Kratak sažetak pozicije koji će se prikazivati u listama..."
                                maxLength={500}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/500 karaktera
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullDescription"
                        rules={{ required: "Puni opis je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Puni opis pozicije *</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Opišite poziciju, odgovornosti, radno okruženje..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Lists Section */}
                <section id="lists">
                  <ContentCard
                    title="Zahtjevi & Beneficije"
                    icon={ListChecks}
                    description="Dodajte zahtjeve, odgovornosti i beneficije za ovu poziciju"
                  >
                    <div className="space-y-8">
                      <ArrayFieldList
                        items={requirements}
                        setter={setRequirements}
                        placeholder="npr. SSS ili više obrazovanje"
                        label="Zahtjevi"
                      />

                      <ArrayFieldList
                        items={responsibilities}
                        setter={setResponsibilities}
                        placeholder="npr. Rad sa kupcima"
                        label="Odgovornosti"
                      />

                      <ArrayFieldList
                        items={benefits}
                        setter={setBenefits}
                        placeholder="npr. Konkurentna plata"
                        label="Beneficije"
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Media Section */}
                <section id="media">
                  <ContentCard
                    title="Naslovna slika"
                    icon={ImageIcon}
                    description="Slika koja se prikazuje uz oglas (opcionalno)"
                  >
                    <ImageGallery
                      images={coverImage}
                      onChange={setCoverImage}
                      maxImages={1}
                      folder="careers"
                    />
                  </ContentCard>
                </section>

                {/* SEO Section */}
                <section id="seo">
                  <ContentCard title="SEO optimizacija" icon={Search}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta naslov</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={watchTitle || "Naslov za pretraživače"}
                                maxLength={60}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/60 karaktera
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta opis</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Opis za rezultate pretrage..."
                                maxLength={160}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {field.value?.length || 0}/160 karaktera
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* SEO Preview */}
                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">
                          Pregled u Google rezultatima:
                        </p>
                        <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                          {form.watch("metaTitle") || watchTitle || "Naziv pozicije"}
                        </div>
                        <div className="text-green-700 text-sm">
                          maksuz.ba › karijera › {form.watch("slug") || "slug"}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {form.watch("metaDescription") ||
                            form.watch("shortDescription") ||
                            "Opis pozicije će se prikazati ovdje..."}
                        </div>
                      </div>
                    </div>
                  </ContentCard>
                </section>

                {/* Publishing Section */}
                <section id="publishing">
                  <ContentCard title="Objavljivanje" icon={Send}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              Objavi odmah (vidljivo na stranici)
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Datum isteka</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormDescription>
                              Oglas će automatski postati neaktivan nakon ovog datuma
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Status Summary */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Pregled statusa</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <span className="ml-2 font-medium">
                              {form.watch("isActive") ? "Aktivan" : "Nacrt"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Istaknuto:</span>
                            <span className="ml-2 font-medium">
                              {form.watch("isFeatured") ? "Da" : "Ne"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Zahtjevi:</span>
                            <span className="ml-2 font-medium">
                              {requirements.filter((r) => r.trim()).length}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Beneficije:</span>
                            <span className="ml-2 font-medium">
                              {benefits.filter((b) => b.trim()).length}
                            </span>
                          </div>
                        </div>
                      </div>
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
