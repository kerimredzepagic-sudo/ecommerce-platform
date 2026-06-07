"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useSlide,
  useCreateSlide,
  useUpdateSlide,
  SlideInput,
} from "@/hooks/useAdminApi";
import { useImageUpload } from "@/hooks/useImageUpload";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Upload,
  X,
  Loader2,
  Eye,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Tabs configuration with icons
const tabs: SidebarTab[] = [
  { id: "basic", label: "Osnovne informacije", icon: FileText },
  { id: "media", label: "Pozadina", icon: ImageIcon },
  { id: "buttons", label: "Dugmadi", icon: LinkIcon },
  { id: "settings", label: "Postavke", icon: Settings },
  { id: "preview", label: "Pregled", icon: Eye },
];

const slideSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  headTitle: z.string().optional(),
  backgroundType: z.enum(["image", "video"]),
  backgroundUrl: z.string().min(1, "Pozadinska slika ili video je obavezan"),
  buttonPrimaryText: z.string().optional(),
  buttonPrimaryLink: z.string().optional(),
  buttonSecondaryText: z.string().optional(),
  buttonSecondaryLink: z.string().optional(),
  isActive: z.boolean(),
  location: z.enum(["shop", "corporate"]),
});

type SlideFormValues = z.infer<typeof slideSchema>;

export default function SlideFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [isUploading, setIsUploading] = useState(false);

  const { data: slideData, isLoading } = useSlide(id);
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const { uploadFiles } = useImageUpload("slides");

  const form = useForm<SlideFormValues>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      headTitle: "",
      backgroundType: "image",
      backgroundUrl: "",
      buttonPrimaryText: "",
      buttonPrimaryLink: "",
      buttonSecondaryText: "",
      buttonSecondaryLink: "",
      isActive: true,
      location: "shop",
    },
  });

  // Load existing data
  useEffect(() => {
    if (slideData?.data && !isNew) {
      const s = slideData.data;
      console.log("Loading slide data:", s);
      
      // Explicitly validate enum values to prevent Zod validation errors
      const validBackgroundType = ["image", "video"].includes(s.backgroundType) 
        ? s.backgroundType 
        : "image";
      const validLocation = ["shop", "corporate"].includes(s.location) 
        ? s.location 
        : "shop";
      
      form.reset({
        title: s.title,
        subtitle: s.subtitle || "",
        description: s.description || "",
        headTitle: s.headTitle || "",
        backgroundType: validBackgroundType as "image" | "video",
        backgroundUrl: s.backgroundUrl || "",
        buttonPrimaryText: s.buttonPrimaryText || "",
        buttonPrimaryLink: s.buttonPrimaryLink || "",
        buttonSecondaryText: s.buttonSecondaryText || "",
        buttonSecondaryLink: s.buttonSecondaryLink || "",
        isActive: s.isActive ?? true,
        location: validLocation as "shop" | "corporate",
      });
    }
  }, [slideData, isNew, form]);

  const backgroundType = form.watch("backgroundType");
  const backgroundUrl = form.watch("backgroundUrl");

  // File upload handler
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const results = await uploadFiles([file]);
        if (results.length > 0 && results[0].url) {
          form.setValue("backgroundUrl", results[0].url);
          toast.success("Datoteka uspješno uploadovana");
        } else {
          toast.error("Greška pri uploadu datoteke");
        }
      } catch (error) {
        toast.error("Greška pri uploadu datoteke");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    },
    [form, uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      backgroundType === "video"
        ? { "video/*": [".mp4", ".webm", ".mov"] }
        : { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const onSubmit = async (values: SlideFormValues) => {
    console.log("Form submitted with values:", values);
    try {
      const data: SlideInput = {
        ...values,
        subtitle: values.subtitle || undefined,
        description: values.description || undefined,
        headTitle: values.headTitle || undefined,
        buttonPrimaryText: values.buttonPrimaryText || undefined,
        buttonPrimaryLink: values.buttonPrimaryLink || undefined,
        buttonSecondaryText: values.buttonSecondaryText || undefined,
        buttonSecondaryLink: values.buttonSecondaryLink || undefined,
      };

      console.log("Sending data to API:", data);

      if (isNew) {
        await createSlide.mutateAsync(data);
        toast.success("Slajd uspješno kreiran");
      } else {
        await updateSlide.mutateAsync({ id, data });
        toast.success("Slajd uspješno ažuriran");
      }

      router.push("/admin/slides");
    } catch (error) {
      console.error("Error saving slide:", error);
      toast.error(isNew ? "Greška pri kreiranju slajda" : "Greška pri ažuriranju slajda");
    }
  };

  // Debug form errors
  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [form.formState.errors]);

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
            title={isNew ? "Novi slajd" : "Uredi slajd"}
            description={
              isNew
                ? "Kreirajte novi hero slajd"
                : "Uredite postojeći hero slajd"
            }
            showBack
            formActions={{
              isSubmitting: createSlide.isPending || updateSlide.isPending,
              submitLabel:
                createSlide.isPending || updateSlide.isPending
                  ? "Spremanje..."
                  : isNew
                  ? "Kreiraj slajd"
                  : "Spremi promjene",
            }}
          />

          <div className="flex-1 p-6">
            <SidebarLayout tabs={tabs}>
              <div className="space-y-6">
                {(createSlide.isError || updateSlide.isError) && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    Greška pri spremanju slajda
                  </div>
                )}

                {/* Basic Info Section */}
                <section id="basic">
                  <ContentCard title="Osnovne informacije" icon={FileText}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="headTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gornji naslov</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="npr. NOVO U PONUDI."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Narandžasti tekst iznad glavnog naslova
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Naslov *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Domaća receptura i domaće paprike..."
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opis</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Autentični balkanski okusi pravljeni s ljubavlju..."
                                rows={4}
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

                {/* Background Media Section */}
                <section id="media">
                  <ContentCard title="Pozadina" icon={ImageIcon}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="backgroundType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tip pozadine</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Odaberite tip pozadine" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="image">
                                  <span className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Slika
                                  </span>
                                </SelectItem>
                                <SelectItem value="video">
                                  <span className="flex items-center gap-2">
                                    <Video className="w-4 h-4" /> Video
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="backgroundUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {backgroundType === "video"
                                ? "Video datoteka *"
                                : "Slika pozadine *"}
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {/* Upload Zone */}
                                <div
                                  {...getRootProps()}
                                  className={cn(
                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                                    isDragActive
                                      ? "border-brand-orange bg-brand-orange/5"
                                      : "border-gray-300 hover:border-brand-orange/50",
                                    isUploading && "opacity-50 cursor-not-allowed"
                                  )}
                                >
                                  <input {...getInputProps()} />
                                  {isUploading ? (
                                    <div className="flex flex-col items-center">
                                      <Loader2 className="w-8 h-8 animate-spin text-brand-orange mb-2" />
                                      <p className="text-sm text-gray-500">
                                        Uploadovanje...
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center">
                                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-600 mb-1">
                                        Prevucite{" "}
                                        {backgroundType === "video"
                                          ? "video"
                                          : "sliku"}{" "}
                                        ovdje ili kliknite za odabir
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {backgroundType === "video"
                                          ? "MP4, WebM, MOV"
                                          : "PNG, JPG, WebP"}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* URL Input */}
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">ili</span>
                                  <Input
                                    placeholder="Unesite URL..."
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="flex-1"
                                  />
                                </div>

                                {/* Preview */}
                                {field.value && (
                                  <div className="relative rounded-lg overflow-hidden">
                                    {backgroundType === "video" ? (
                                      <video
                                        src={field.value}
                                        className="w-full h-48 object-cover"
                                        controls
                                      />
                                    ) : (
                                      <div className="relative h-48">
                                        <Image
                                          src={field.value}
                                          alt="Preview"
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => field.onChange("")}
                                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </ContentCard>
                </section>

                {/* Buttons Section */}
                <section id="buttons">
                  <ContentCard title="Dugmadi" icon={LinkIcon}>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 border-b pb-2">
                          Primarno dugme
                        </h4>
                        <FormField
                          control={form.control}
                          name="buttonPrimaryText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tekst</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="POGLEDAJ KATEGORIJU."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="buttonPrimaryLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link</FormLabel>
                              <FormControl>
                                <Input placeholder="/shop/products" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 border-b pb-2">
                          Sekundarno dugme
                        </h4>
                        <FormField
                          control={form.control}
                          name="buttonSecondaryText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tekst</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="KORPORATIVNI POKLONI."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="buttonSecondaryLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="/shop/products?category=korporativni-pokloni"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </ContentCard>
                </section>

                {/* Settings Section */}
                <section id="settings">
                  <ContentCard title="Postavke" icon={Settings}>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokacija</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Odaberite lokaciju" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="shop">Prodavnica</SelectItem>
                                <SelectItem value="corporate">
                                  Korporativna
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Gdje će se slajd prikazivati
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Aktivan</FormLabel>
                              <FormDescription>
                                Prikaži slajd na stranici
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

                {/* Preview Section */}
                <section id="preview">
                  <ContentCard title="Pregled uživo" icon={Eye}>
                    {backgroundUrl ? (
                      <div className="relative h-[400px] rounded-xl overflow-hidden">
                        {backgroundType === "video" ? (
                          <video
                            src={backgroundUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={backgroundUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        )}
                        <div
                          className="absolute inset-0 z-[1]"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)",
                          }}
                        />
                        <div className="relative z-10 h-full max-w-screen mx-auto px-6 flex items-center">
                          <div className="max-w-2xl space-y-4">
                            {form.watch("headTitle") && (
                              <p className="text-brand-orange font-oswald text-xl font-semibold uppercase tracking-wide">
                                {form.watch("headTitle")}
                              </p>
                            )}
                            <h1 className="font-poppins text-3xl md:text-4xl text-white font-normal leading-tight">
                              {form.watch("title") || "Naslov slajda"}
                            </h1>
                            {form.watch("description") && (
                              <p className="font-poppins text-white/80 text-base leading-relaxed max-w-xl">
                                {form.watch("description")}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-4 pt-2">
                              {form.watch("buttonPrimaryText") && (
                                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-oswald uppercase">
                                  {form.watch("buttonPrimaryText")}
                                </Button>
                              )}
                              {form.watch("buttonSecondaryText") && (
                                <Button
                                  variant="outline"
                                  className="border-white text-white hover:bg-white/10 font-oswald uppercase"
                                >
                                  {form.watch("buttonSecondaryText")}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[300px] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Dodajte pozadinsku sliku ili video za pregled</p>
                        </div>
                      </div>
                    )}
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
