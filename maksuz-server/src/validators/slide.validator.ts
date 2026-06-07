import { z } from "zod";

export const createSlideSchema = z.object({
  title: z
    .string()
    .min(1, "Naslov je obavezan")
    .max(200, "Naslov ne može biti duži od 200 karaktera"),
  subtitle: z
    .string()
    .max(300, "Podnaslov ne može biti duži od 300 karaktera")
    .optional(),
  description: z
    .string()
    .max(500, "Opis ne može biti duži od 500 karaktera")
    .optional(),
  headTitle: z
    .string()
    .max(100, "Gornji naslov ne može biti duži od 100 karaktera")
    .optional(),
  backgroundType: z.enum(["image", "video"]).default("image"),
  backgroundUrl: z.string().min(1, "Pozadinska slika ili video je obavezan"),
  buttonPrimaryText: z
    .string()
    .max(50, "Tekst primarnog dugmeta ne može biti duži od 50 karaktera")
    .optional(),
  buttonPrimaryLink: z.string().optional(),
  buttonSecondaryText: z
    .string()
    .max(50, "Tekst sekundarnog dugmeta ne može biti duži od 50 karaktera")
    .optional(),
  buttonSecondaryLink: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  location: z.enum(["shop", "corporate"]).default("shop"),
});

export const updateSlideSchema = createSlideSchema.partial();

export const reorderSlidesSchema = z.object({
  slides: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ),
});

export type CreateSlideInput = z.infer<typeof createSlideSchema>;
export type UpdateSlideInput = z.infer<typeof updateSlideSchema>;
export type ReorderSlidesInput = z.infer<typeof reorderSlidesSchema>;

