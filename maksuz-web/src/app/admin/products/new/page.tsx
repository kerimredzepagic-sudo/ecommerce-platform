"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Eye,
  Info,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Package,
  Truck,
  Settings,
  Search,
  X,
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
import { useCreateProduct, useCategories } from "@/hooks/useAdminApi";
import {
  ImageGallery,
  ProductImage,
} from "@/components/admin/products/ImageGallery";
import {
  VariantsManager,
  ProductVariant,
} from "@/components/admin/products/VariantsManager";
import { AttributesEditor } from "@/components/admin/products/AttributesEditor";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

// Tabs configuration with icons
const tabs: SidebarTab[] = [
  { id: "basic", label: "Osnovne informacije", icon: Info },
  { id: "description", label: "Opis", icon: FileText },
  { id: "media", label: "Mediji", icon: ImageIcon },
  { id: "pricing", label: "Cijene i akcije", icon: DollarSign },
  { id: "variants", label: "Varijante", icon: Layers },
  { id: "inventory", label: "Zalihe", icon: Package },
  { id: "shipping", label: "Dostava", icon: Truck },
  { id: "attributes", label: "Atributi", icon: Settings },
  { id: "seo", label: "SEO", icon: Search },
];

interface ProductFormValues {
  // Basic
  name: string;
  slug: string;
  category: string;
  line: string;
  tags: string;
  isActive: boolean;
  isFeatured: boolean;

  // Description
  shortDescription: string;
  description: string;

  // Pricing
  price: number;
  compareAtPrice: number | undefined;
  saleStartDate: string;
  saleEndDate: string;

  // Inventory
  sku: string;
  stock: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  allowBackorder: boolean;

  // Shipping
  weight: number | undefined;
  dimensionLength: number | undefined;
  dimensionWidth: number | undefined;
  dimensionHeight: number | undefined;

  // SEO
  metaTitle: string;
  metaDescription: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categoriesData } = useCategories();

  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [hasVariants, setHasVariants] = useState(false);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      // Basic
      name: "",
      slug: "",
      category: "",
      line: "",
      tags: "",
      isActive: true,
      isFeatured: false,

      // Description
      shortDescription: "",
      description: "",

      // Pricing
      price: 0,
      compareAtPrice: undefined,
      saleStartDate: "",
      saleEndDate: "",

      // Inventory
      sku: "",
      stock: 0,
      trackInventory: true,
      lowStockThreshold: 5,
      allowBackorder: false,

      // Shipping
      weight: undefined,
      dimensionLength: undefined,
      dimensionWidth: undefined,
      dimensionHeight: undefined,

      // SEO
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Auto-generate slug from name
  const watchName = form.watch("name");
  const generateSlug = () => {
    const slug = watchName
      .toLowerCase()
      .replace(/[čć]/g, "c")
      .replace(/[šś]/g, "s")
      .replace(/ž/g, "z")
      .replace(/đ/g, "dj")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    form.setValue("slug", slug);
  };

  // Calculate discount percentage
  const watchPrice = form.watch("price");
  const watchCompareAtPrice = form.watch("compareAtPrice");
  const discountPercentage =
    watchCompareAtPrice && watchCompareAtPrice > watchPrice
      ? Math.round(
          ((watchCompareAtPrice - watchPrice) / watchCompareAtPrice) * 100
        )
      : 0;

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const productData = {
        // Basic
        name: values.name,
        slug: values.slug || undefined,
        category: values.category || undefined,
        line: values.line || null,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        isActive: values.isActive,
        isFeatured: values.isFeatured,

        // Description
        shortDescription: values.shortDescription || undefined,
        description: values.description,

        // Media
        images: images,

        // Pricing
        price: Number(values.price),
        compareAtPrice: values.compareAtPrice
          ? Number(values.compareAtPrice)
          : undefined,
        saleStartDate: values.saleStartDate
          ? new Date(values.saleStartDate).toISOString()
          : undefined,
        saleEndDate: values.saleEndDate
          ? new Date(values.saleEndDate).toISOString()
          : undefined,

        // Inventory
        sku: values.sku || undefined,
        stock: Number(values.stock),
        trackInventory: values.trackInventory,
        lowStockThreshold: Number(values.lowStockThreshold),
        allowBackorder: values.allowBackorder,

        // Shipping
        weight: values.weight ? Number(values.weight) : undefined,
        dimensions: values.dimensionLength
          ? {
              length: Number(values.dimensionLength),
              width: Number(values.dimensionWidth) || 0,
              height: Number(values.dimensionHeight) || 0,
            }
          : undefined,

        // Variants
        variants: hasVariants ? variants : [],
        hasVariants,

        // Attributes
        attributes,

        // SEO
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
      };

      await createProduct.mutateAsync(productData as any);
      router.push("/admin/products");
    } catch (error) {
      console.error("Greška pri kreiranju proizvoda:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AdminHeader
            title="Novi proizvod"
            description="Dodajte novi proizvod u katalog"
            showBack
            formActions={{
              isSubmitting: createProduct.isPending,
              submitLabel: createProduct.isPending
                ? "Kreiranje..."
                : "Kreiraj proizvod",
            }}
          />

          <div className="flex-1 p-6">
            <SidebarLayout tabs={tabs}>
              <div className="space-y-6">
                {createProduct.isError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    {createProduct.error?.message ||
                      "Greška pri kreiranju proizvoda"}
                  </div>
                )}

                {/* Basic Info Section */}
                <section id="basic">
                  <ContentCard title="Osnovne informacije" icon={Info}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Naziv je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Naziv proizvoda *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Unesite naziv proizvoda"
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
                                  placeholder="url-slug-proizvoda"
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
                              /shop/product/{field.value || "slug"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          rules={{ required: "Kategorija je obavezna" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kategorija *</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  {...field}
                                >
                                  <option value="">Odaberite kategoriju</option>
                                  {categoriesData?.data?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {"—".repeat((cat.level || 1) - 1)}{" "}
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="line"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Linija proizvoda</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  {...field}
                                >
                                  <option value="">Bez linije</option>
                                  <option value="originals">Originals</option>
                                  <option value="premium">Premium</option>
                                  <option value="health">Health</option>
                                  <option value="energy">Energy</option>
                                </select>
                              </FormControl>
                              <FormDescription>
                                Odaberite liniju proizvoda za grupiranje
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Šifra proizvoda"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Oznake</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="med, propolis, zdravlje"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Odvojite oznake zarezom
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-6">
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
                                Aktivan proizvod
                              </FormLabel>
                            </FormItem>
                          )}
                        />

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
                                Istaknuti proizvod
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </ContentCard>
                </section>

                {/* Description Section */}
                <section id="description">
                  <ContentCard title="Opis proizvoda" icon={FileText}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kratak opis</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Kratak opis za prikaz u listama proizvoda"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: "Opis je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Puni opis *</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Detaljni opis proizvoda..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Media Section */}
                <section id="media">
                  <ContentCard title="Slike proizvoda" icon={ImageIcon}>
                    <ImageGallery
                      images={images}
                      onChange={setImages}
                      maxImages={10}
                      folder="products"
                    />
                  </ContentCard>
                </section>

                {/* Pricing Section */}
                <section id="pricing">
                  <ContentCard title="Cijene i akcije" icon={DollarSign}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="price"
                          rules={{
                            required: "Cijena je obavezna",
                            min: {
                              value: 0,
                              message: "Cijena ne može biti negativna",
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cijena (KM) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0,00"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="compareAtPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stara cijena (KM)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0,00"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {discountPercentage > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <span className="text-green-700 font-medium">
                            🏷️ Popust: {discountPercentage}%
                          </span>
                          <span className="text-green-600 ml-2">
                            (Ušteda:{" "}
                            {(watchCompareAtPrice! - watchPrice).toFixed(2)} KM)
                          </span>
                        </div>
                      )}

                      <div className="border-t pt-6">
                        <h3 className="font-medium mb-2">Zakazana akcija</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ostavite prazno za trajnu akciju. Ako postavite datume, popust će biti aktivan samo u tom periodu.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="saleStartDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Početak akcije</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input type="datetime-local" {...field} />
                                  </FormControl>
                                  {field.value && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => field.onChange("")}
                                      title="Ukloni datum"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="saleEndDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kraj akcije</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input type="datetime-local" {...field} />
                                  </FormControl>
                                  {field.value && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => field.onChange("")}
                                      title="Ukloni datum"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </ContentCard>
                </section>

                {/* Variants Section */}
                <section id="variants">
                  <ContentCard
                    title="Varijante proizvoda"
                    icon={Layers}
                    description="Definirajte varijante ako proizvod dolazi u različitim veličinama, bojama, itd."
                  >
                    <div className="space-y-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hasVariants}
                          onChange={(e) => setHasVariants(e.target.checked)}
                          className="w-4 h-4 rounded border-input"
                        />
                        <span className="text-sm">
                          Ovaj proizvod ima varijante
                        </span>
                      </label>

                      {hasVariants ? (
                        <VariantsManager
                          variants={variants}
                          onChange={setVariants}
                          basePrice={watchPrice}
                        />
                      ) : (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                          <p>Varijante su isključene</p>
                          <p className="text-sm">
                            Uključite checkbox iznad za dodavanje varijanti.
                          </p>
                        </div>
                      )}
                    </div>
                  </ContentCard>
                </section>

                {/* Inventory Section */}
                <section id="inventory">
                  <ContentCard title="Upravljanje zalihama" icon={Package}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="trackInventory"
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
                              Prati zalihe za ovaj proizvod
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {form.watch("trackInventory") && (
                        <>
                          <div className="grid grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="stock"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Trenutna zaliha</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lowStockThreshold"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Upozorenje za nisku zalihu
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="5"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Obavijesti kada zaliha padne ispod ove
                                    vrijednosti
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="allowBackorder"
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
                                  Dozvoli narudžbe kada nema na zalihi
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  </ContentCard>
                </section>

                {/* Shipping Section */}
                <section id="shipping">
                  <ContentCard title="Dostava" icon={Truck}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Težina (grami)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="npr. 500"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Dimenzije (cm)
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="dimensionLength"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Dužina"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionWidth"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Širina"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dimensionHeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Visina"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </ContentCard>
                </section>

                {/* Attributes Section */}
                <section id="attributes">
                  <ContentCard
                    title="Custom atributi"
                    icon={Settings}
                    description="Dodajte dodatne informacije o proizvodu kao što su sastojci, materijal, certifikati, itd."
                  >
                    <AttributesEditor
                      attributes={attributes}
                      onChange={setAttributes}
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
                                placeholder={
                                  watchName || "Naslov za pretraživače"
                                }
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
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="text-sm text-gray-500 mb-2">
                          Pregled u Google rezultatima:
                        </p>
                        <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                          {form.watch("metaTitle") ||
                            watchName ||
                            "Naslov proizvoda"}
                        </div>
                        <div className="text-green-700 text-sm">
                          maksuz.ba › shop › product ›{" "}
                          {form.watch("slug") || "slug"}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {form.watch("metaDescription") ||
                            form.watch("shortDescription") ||
                            "Opis proizvoda će se prikazati ovdje..."}
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
