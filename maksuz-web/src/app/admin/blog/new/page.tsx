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
  Clock,
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
import { useCreateBlogPost, useBlogCategories } from "@/hooks/useAdminApi";
import {
  ImageGallery,
  ProductImage,
} from "@/components/admin/products/ImageGallery";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

// Tabs configuration with icons
const tabs: SidebarTab[] = [
  { id: "basic", label: "Osnovne informacije", icon: Info },
  { id: "content", label: "Sadržaj", icon: FileText },
  { id: "media", label: "Naslovna slika", icon: ImageIcon },
  { id: "seo", label: "SEO", icon: Search },
  { id: "publishing", label: "Objavljivanje", icon: Send },
];

interface BlogPostFormValues {
  title: string;
  slug: string;
  category: string;
  tags: string;
  isFeatured: boolean;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  isPublished: boolean;
  scheduledAt: string;
  allowComments: boolean;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const createBlogPost = useCreateBlogPost();
  const { data: categoriesData } = useBlogCategories();

  const [coverImage, setCoverImage] = useState<ProductImage[]>([]);
  const [ogImage, setOgImage] = useState<ProductImage[]>([]);

  const form = useForm<BlogPostFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      tags: "",
      isFeatured: false,
      excerpt: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      isPublished: false,
      scheduledAt: "",
      allowComments: true,
    },
  });

  const watchTitle = form.watch("title");
  const watchExcerpt = form.watch("excerpt");
  const watchContent = form.watch("content");

  // Calculate reading time
  const wordCount = watchContent.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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

  const onSubmit = async (values: BlogPostFormValues) => {
    try {
      const postData = {
        title: values.title,
        slug: values.slug || undefined,
        category: values.category || undefined,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        isFeatured: values.isFeatured,
        excerpt: values.excerpt,
        content: values.content,
        coverImage: coverImage[0]?.url || undefined,
        ogImage: ogImage[0]?.url || undefined,
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        canonicalUrl: values.canonicalUrl || undefined,
        isPublished: values.isPublished,
        scheduledAt: values.scheduledAt || undefined,
        allowComments: values.allowComments,
      };

      await createBlogPost.mutateAsync(postData);
      router.push("/admin/blog");
    } catch (error) {
      console.error("Greška pri kreiranju članka:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AdminHeader
            title="Novi članak"
            description="Napišite novi blog članak"
            showBack
            formActions={{
              isSubmitting: createBlogPost.isPending,
              submitLabel: createBlogPost.isPending
                ? "Kreiranje..."
                : "Kreiraj članak",
            }}
          />

          <div className="flex-1 p-6">
            <SidebarLayout tabs={tabs}>
              <div className="space-y-6">
                {createBlogPost.isError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    {createBlogPost.error?.message ||
                      "Greška pri kreiranju članka"}
                  </div>
                )}

                {/* Basic Info Section */}
                <section id="basic">
                  <ContentCard title="Osnovne informacije" icon={Info}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Naslov je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Naslov članka *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Unesite naslov članka"
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
                                  placeholder="url-slug-clanka"
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
                              /blog/{field.value || "slug"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kategorija</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  {...field}
                                >
                                  <option value="">Odaberite kategoriju</option>
                                  {categoriesData?.data?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
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
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Oznake</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="vijesti, savjeti, med"
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
                              Istaknuti članak (prikazuje se na naslovnici)
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Content Section */}
                <section id="content">
                  <ContentCard title="Sadržaj članka" icon={FileText}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="excerpt"
                        rules={{ required: "Izvod je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Izvod (sažetak) *</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Kratak sažetak članka koji će se prikazivati u listama..."
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
                        name="content"
                        rules={{ required: "Sadržaj je obavezan" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Puni sadržaj *</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Napišite sadržaj članka..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Reading time indicator */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <Clock className="w-4 h-4" />
                        <span>
                          Procijenjeno vrijeme čitanja:{" "}
                          <strong>{readingTime} min</strong> ({wordCount} riječi)
                        </span>
                      </div>
                    </div>
                  </ContentCard>
                </section>

                {/* Media Section */}
                <section id="media">
                  <ContentCard
                    title="Naslovna slika"
                    icon={ImageIcon}
                    description="Slika koja se prikazuje u listama članaka i kao glavna slika"
                  >
                    <ImageGallery
                      images={coverImage}
                      onChange={setCoverImage}
                      maxImages={1}
                      folder="blog"
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

                      <FormField
                        control={form.control}
                        name="canonicalUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kanonski URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://maksuz.ba/blog/originalni-clanak"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Ostavite prazno ako je ovo originalni sadržaj
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* OG Image */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Open Graph slika (za dijeljenje na društvenim mrežama)
                        </label>
                        <ImageGallery
                          images={ogImage}
                          onChange={setOgImage}
                          maxImages={1}
                          folder="blog"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Preporučena veličina: 1200x630px. Ako nije postavljena, koristi se naslovna slika.
                        </p>
                      </div>

                      {/* SEO Preview */}
                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">
                          Pregled u Google rezultatima:
                        </p>
                        <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                          {form.watch("metaTitle") || watchTitle || "Naslov članka"}
                        </div>
                        <div className="text-green-700 text-sm">
                          maksuz.ba › blog › {form.watch("slug") || "slug"}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {form.watch("metaDescription") || watchExcerpt || "Opis članka će se prikazati ovdje..."}
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
                        name="isPublished"
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
                              Objavi odmah
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {!form.watch("isPublished") && (
                        <FormField
                          control={form.control}
                          name="scheduledAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zakaži objavu</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormDescription>
                                Članak će biti automatski objavljen u odabrano vrijeme
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="allowComments"
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
                              Dozvoli komentare
                            </FormLabel>
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
                              {form.watch("isPublished")
                                ? "Objavljeno"
                                : form.watch("scheduledAt")
                                ? "Zakazano"
                                : "Nacrt"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vrijeme čitanja:</span>
                            <span className="ml-2 font-medium">{readingTime} min</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Broj riječi:</span>
                            <span className="ml-2 font-medium">{wordCount}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Komentari:</span>
                            <span className="ml-2 font-medium">
                              {form.watch("allowComments") ? "Dozvoljeni" : "Onemogućeni"}
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
